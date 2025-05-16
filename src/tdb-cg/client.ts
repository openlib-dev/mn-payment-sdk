import axios, { AxiosRequestConfig } from 'axios';
import https from 'https';
import fs from 'fs';
import {
  TdbCgConfig,
  TdbCgAuthTokenRequest,
  TdbCgAuthTokenResponse,
  TdbCgAuthRefreshRequest,
  TdbCgPaymentGetRequest,
  TdbCgPaymentGetResponse,
  TdbCgPaymentCheckRequest,
  TdbCgPaymentCheckResponse,
  TdbCgInvoiceCreateRequest,
  TdbCgInvoiceCreateResponse,
  TdbCgInvoiceGetRequest,
  TdbCgInvoiceGetResponse
} from './types';
import { HttpErrorHandler, PaymentError, PaymentErrorCode } from '../common/errors';
import { API } from '../types';
const MAX_RETRIES = 3;
const TIMEOUT_MS = 30000; // 30 seconds
const RETRY_DELAY_MS = 1000; // 1 second

export class TdbCgClient {
  private endpoint: string;
  private loginId: string;
  private clientSecret: string;
  private password: string;
  private certPass: string;
  private certPathPfx: string;
  private certPathCer: string;
  private anyBic: string;
  private roleId: string;

  constructor(config: TdbCgConfig) {
    this.endpoint = config.endpoint;
    this.loginId = config.loginId;
    this.clientSecret = config.clientSecret;
    this.password = config.password;
    this.certPass = config.certPass;
    this.certPathPfx = config.certPathPfx;
    this.certPathCer = config.certPathCer;
    this.anyBic = config.anyBic;
    this.roleId = config.roleId;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async httpRequest<T>(body: any, api: API, urlExt: string = ''): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const cert = fs.readFileSync(this.certPathPfx);
        const ca = fs.readFileSync(this.certPathCer);

        const httpsAgent = new https.Agent({
          pfx: cert,
          passphrase: this.certPass,
          ca: ca
        });

        const config: AxiosRequestConfig = {
          method: api.method,
          url: this.endpoint + api.url + urlExt,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${this.loginId}:${this.password}`).toString('base64')}`
          },
          httpsAgent,
          data: body,
          timeout: TIMEOUT_MS
        };

        console.log(`[TdbCgClient] Making ${api.method} request to ${api.url}${urlExt} (Attempt ${attempt}/${MAX_RETRIES})`);
        const response = await axios(config);
        const data = response.data;

        if (data.error) {
          throw new PaymentError({
            code: PaymentErrorCode.PAYMENT_FAILED,
            message: data.error.message || 'Payment failed',
            provider: 'tdb-cg',
            requestId: data.error.id || data.error.code
          });
        }

        console.log(`[TdbCgClient] Successfully completed ${api.method} request to ${api.url}${urlExt}`);
        return data;
      } catch (error: any) {
        lastError = error;
        
        // Don't retry if it's a business logic error
        if (error instanceof PaymentError) {
          throw error;
        }

        // Check if we should retry
        const isRetryable = error.code === 'ECONNABORTED' || // Timeout
                          error.code === 'ECONNRESET' || // Connection reset
                          error.code === 'ETIMEDOUT' || // Connection timeout
                          (error.response && error.response.status >= 500); // Server errors

        if (!isRetryable || attempt === MAX_RETRIES) {
          break;
        }

        console.log(`[TdbCgClient] Request failed, retrying in ${RETRY_DELAY_MS}ms... (Error: ${error.message})`);
        await this.sleep(RETRY_DELAY_MS * attempt); // Exponential backoff
      }
    }

    HttpErrorHandler.handleError('tdb-cg', lastError);
  }

  async getAuthToken(request: TdbCgAuthTokenRequest): Promise<TdbCgAuthTokenResponse> {
    return this.httpRequest<TdbCgAuthTokenResponse>(
      request,
      { url: '/auth/token', method: 'POST' }
    );
  }

  async refreshAuthToken(request: TdbCgAuthRefreshRequest): Promise<TdbCgAuthTokenResponse> {
    return this.httpRequest<TdbCgAuthTokenResponse>(
      request,
      { url: '/auth/refresh', method: 'POST' }
    );
  }

  async getPayment(request: TdbCgPaymentGetRequest): Promise<TdbCgPaymentGetResponse> {
    return this.httpRequest<TdbCgPaymentGetResponse>(
      null,
      { url: '/payment/get/', method: 'GET' },
      request.paymentId
    );
  }

  async checkPayment(request: TdbCgPaymentCheckRequest): Promise<TdbCgPaymentCheckResponse> {
    return this.httpRequest<TdbCgPaymentCheckResponse>(
      null,
      { url: '/payment/check/', method: 'GET' },
      request.paymentId
    );
  }

  async createInvoice(request: TdbCgInvoiceCreateRequest): Promise<TdbCgInvoiceCreateResponse> {
    return this.httpRequest<TdbCgInvoiceCreateResponse>(
      request,
      { url: '/bill/create', method: 'POST' }
    );
  }

  async getInvoice(request: TdbCgInvoiceGetRequest): Promise<TdbCgInvoiceGetResponse> {
    return this.httpRequest<TdbCgInvoiceGetResponse>(
      null,
      { url: '/invoice/', method: 'GET' },
      request.invoiceId
    );
  }
} 