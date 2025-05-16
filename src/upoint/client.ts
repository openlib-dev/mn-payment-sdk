import {
  UpointConfig,
  UpointCheckInfoRequest,
  UpointCheckInfoResponse,
  UpointTransactionRequest,
  UpointTransactionResponse,
  UpointReturnTransactionRequest,
  UpointReturnTransactionResponse,
  UpointCheckTransactionRequest,
  UpointCheckTransactionResponse,
  UpointProductRequest,
  UpointProductResponse,
  UpointCancelTransactionRequest,
  UpointCancelTransactionResponse,
  UpointQrResponse,
  UpointQrCheckResponse,
  UpointQrCheckInfoResponse,
  UpointTransactionQrRequest,
  UpointTransactionQrResponse
} from './types';
import {
  UpointCheckUserInfo,
  UpointProcessTransaction,
  UpointReturnTransaction,
  UpointCheckTransaction,
  UpointCancelTransaction,
  UpointProduct,
  UpointQr,
  UpointCheckQr,
  UpointCheckQrInfo,
  UpointTransactionQr
} from './apis';
import { HttpErrorHandler, PaymentError, PaymentErrorCode } from '../common/errors';

const MAX_RETRIES = 3;
const TIMEOUT_MS = 30000; // 30 seconds
const RETRY_DELAY_MS = 1000; // 1 second

export class UpointClient {
  private endpoint: string;
  private token: string;

  constructor(config: UpointConfig) {
    this.endpoint = config.endpoint;
    this.token = config.token;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest<T>(url: string, options: RequestInit): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[UpointClient] Making ${options.method} request to ${url} (Attempt ${attempt}/${MAX_RETRIES})`);
        
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
            provider: 'upoint'
          });
        }

        const data = await response.json();
        if (data.error) {
          throw new PaymentError({
            code: PaymentErrorCode.PAYMENT_FAILED,
            message: data.error.message || 'Payment failed',
            provider: 'upoint',
            requestId: data.error.id || data.error.code
          });
        }

        console.log(`[UpointClient] Successfully completed ${options.method} request to ${url}`);
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

        console.log(`[UpointClient] Request failed, retrying in ${RETRY_DELAY_MS}ms... (Error: ${error.message})`);
        await this.sleep(RETRY_DELAY_MS * attempt); // Exponential backoff
      }
    }

    HttpErrorHandler.handleError('upoint', lastError);
  }

  private async httpRequest<T>(body: any, api: API): Promise<T> {
    const url = this.endpoint + api.url;
    const options: RequestInit = {
      method: api.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.token}`
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return this.makeRequest<T>(url, options);
  }

  async checkUserInfo(request: UpointCheckInfoRequest): Promise<UpointCheckInfoResponse> {
    return this.httpRequest<UpointCheckInfoResponse>(request, UpointCheckUserInfo);
  }

  async processTransaction(request: UpointTransactionRequest): Promise<UpointTransactionResponse> {
    return this.httpRequest<UpointTransactionResponse>(request, UpointProcessTransaction);
  }

  async returnTransaction(request: UpointReturnTransactionRequest): Promise<UpointReturnTransactionResponse> {
    return this.httpRequest<UpointReturnTransactionResponse>(request, UpointReturnTransaction);
  }

  async checkTransaction(request: UpointCheckTransactionRequest): Promise<UpointCheckTransactionResponse> {
    return this.httpRequest<UpointCheckTransactionResponse>(request, UpointCheckTransaction);
  }

  async cancelTransaction(request: UpointCancelTransactionRequest): Promise<UpointCancelTransactionResponse> {
    return this.httpRequest<UpointCancelTransactionResponse>(request, UpointCancelTransaction);
  }

  async getProduct(request: UpointProductRequest): Promise<UpointProductResponse> {
    return this.httpRequest<UpointProductResponse>(request, UpointProduct);
  }

  async generateQr(): Promise<UpointQrResponse> {
    return this.httpRequest<UpointQrResponse>(null, UpointQr);
  }

  async checkQr(qrString: string): Promise<UpointQrCheckResponse> {
    return this.httpRequest<UpointQrCheckResponse>({ qr_string: qrString }, UpointCheckQr);
  }

  async checkQrInfo(qrString: string): Promise<UpointQrCheckInfoResponse> {
    return this.httpRequest<UpointQrCheckInfoResponse>({ qr_string: qrString }, UpointCheckQrInfo);
  }

  async processTransactionQr(request: UpointTransactionQrRequest): Promise<UpointTransactionQrResponse> {
    return this.httpRequest<UpointTransactionQrResponse>(request, UpointTransactionQr);
  }
} 