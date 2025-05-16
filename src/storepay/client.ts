import {
  StorepayConfig,
  StorepayLoginResponse,
  StorepayLoanInput,
  StorepayLoanRequest,
  StorepayLoanResponse,
  StorepayCheckResponse,
  StorepayUserCheckRequest,
  StorepayUserCheckResponse
} from './types';
import {
  StorepayAuth,
  StorepayLoan,
  StorepayLoanCheck,
  StorepayUserPossibleAmount
} from './apis';
import { API } from '../types';
import { HttpErrorHandler, PaymentError, PaymentErrorCode } from '../common/errors';

const MAX_RETRIES = 3;
const TIMEOUT_MS = 30000; // 30 seconds
const RETRY_DELAY_MS = 1000; // 1 second

export class StorepayClient {
  private appUsername: string;
  private appPassword: string;
  private username: string;
  private password: string;
  private authUrl: string;
  private baseUrl: string;
  private storeId: string;
  private callbackUrl: string;
  private expireIn: number | null;
  private loginObject: StorepayLoginResponse | null;

  constructor(config: StorepayConfig) {
    this.appUsername = config.appUsername;
    this.appPassword = config.appPassword;
    this.username = config.username;
    this.password = config.password;
    this.authUrl = config.authUrl;
    this.baseUrl = config.baseUrl;
    this.storeId = config.storeId;
    this.callbackUrl = config.callbackUrl;
    this.expireIn = null;
    this.loginObject = null;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest<T>(url: string, options: RequestInit): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[StorepayClient] Making ${options.method} request to ${url} (Attempt ${attempt}/${MAX_RETRIES})`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
        
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new PaymentError({
            code: PaymentErrorCode.PROVIDER_ERROR,
            message: `HTTP error! status: ${response.status} - ${errorText}`,
            provider: 'storepay'
          });
        }

        const data = await response.json();
        if (data.status !== 'Success') {
          throw new PaymentError({
            code: PaymentErrorCode.PAYMENT_FAILED,
            message: `${data.status}: ${data.msgList?.[0]?.code || ''} - ${data.msgList?.[0]?.text || ''}`,
            provider: 'storepay',
            requestId: data.id
          });
        }

        console.log(`[StorepayClient] Successfully completed ${options.method} request to ${url}`);
        return data;
      } catch (error: any) {
        lastError = error;
        
        // Don't retry if it's a business logic error
        if (error instanceof PaymentError) {
          throw error;
        }

        // Check if we should retry
        const isRetryable = error.name === 'AbortError' || // Timeout
                          error.name === 'TypeError' || // Network error
                          (error.response && error.response.status >= 500); // Server errors

        if (!isRetryable || attempt === MAX_RETRIES) {
          break;
        }

        console.log(`[StorepayClient] Request failed, retrying in ${RETRY_DELAY_MS}ms... (Error: ${error.message})`);
        await this.sleep(RETRY_DELAY_MS * attempt); // Exponential backoff
      }
    }

    HttpErrorHandler.handleError('storepay', lastError);
  }

  private async httpRequest<T>(body: any, api: API, urlExt: string = ''): Promise<T> {
    try {
      const authObj = await this.authStorepay();
      this.loginObject = authObj;

      const url = this.baseUrl + api.url + urlExt;
      const options: RequestInit = {
        method: api.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.loginObject.access_token}`
        }
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      return this.makeRequest<T>(url, options);
    } catch (error) {
      HttpErrorHandler.handleError('storepay', error);
    }
  }

  private async authStorepay(): Promise<StorepayLoginResponse> {
    if (this.loginObject && this.expireIn && Date.now() < this.expireIn) {
      return this.loginObject;
    }

    const url = `${this.authUrl}${StorepayAuth.url}?grant_type=password&username=${this.appUsername}&password=${this.appPassword}`;
    const options: RequestInit = {
      method: StorepayAuth.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`
      }
    };

    try {
      console.log(`[StorepayClient] Making authentication request (Attempt 1/1)`);
      const response = await this.makeRequest<StorepayLoginResponse>(url, options);
      this.expireIn = Date.now() + (response.expires_in * 1000);
      console.log(`[StorepayClient] Successfully authenticated`);
      return response;
    } catch (error) {
      HttpErrorHandler.handleError('storepay', error);
    }
  }

  async loan(input: StorepayLoanInput): Promise<number> {
    const request: StorepayLoanRequest = {
      storeId: this.storeId,
      mobileNumber: input.mobileNumber,
      description: input.description,
      amount: input.amount.toString(),
      callbackUrl: this.callbackUrl
    };

    const response = await this.httpRequest<StorepayLoanResponse>(request, StorepayLoan);
    return response.value;
  }

  async loanCheck(id: string): Promise<boolean> {
    const response = await this.httpRequest<StorepayCheckResponse>(null, StorepayLoanCheck, id);
    return response.value;
  }

  async userPossibleAmount(mobileNumber: string): Promise<number> {
    const request: StorepayUserCheckRequest = {
      mobileNumber
    };

    const response = await this.httpRequest<StorepayUserCheckResponse>(request, StorepayUserPossibleAmount);
    return response.value;
  }

  close(): void {
    this.expireIn = null;
    this.loginObject = null;
  }
} 