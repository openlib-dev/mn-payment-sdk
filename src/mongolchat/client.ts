import axios, { AxiosRequestConfig } from 'axios';
import {
  MongolchatConfig,
  MchatOnlineQrGenerateRequest,
  MchatOnlineQrGenerateResponse,
  MchatOnlineQrCheckResponse
} from './types';
import {
  MchatOnlineQrGenerate,
  MchatOnlineQrcheck
} from './apis';
import { HttpErrorHandler, PaymentError, PaymentErrorCode } from '../common/errors';
import { API } from '../types';
const MAX_RETRIES = 3;
const TIMEOUT_MS = 30000; // 30 seconds
const RETRY_DELAY_MS = 1000; // 1 second

export class MongolchatClient {
  private endpoint: string;
  private apiKey: string;
  private workerKey: string;
  private appSecret: string;
  private branchNo: string;

  constructor(config: MongolchatConfig) {
    this.endpoint = config.endpoint;
    this.apiKey = config.apiKey;
    this.workerKey = config.workerKey;
    this.appSecret = config.appSecret;
    this.branchNo = config.branchNo;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest<T>(config: AxiosRequestConfig): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[MongolchatClient] Making ${config.method} request to ${config.url} (Attempt ${attempt}/${MAX_RETRIES})`);
        const response = await axios(config);
        const data = response.data;

        if (data.code !== 1000) {
          throw new PaymentError({
            code: PaymentErrorCode.PAYMENT_FAILED,
            message: data.message || 'Payment failed',
            provider: 'mongolchat',
            requestId: data.referenceNumber || data.code
          });
        }

        console.log(`[MongolchatClient] Successfully completed ${config.method} request to ${config.url}`);
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

        console.log(`[MongolchatClient] Request failed, retrying in ${RETRY_DELAY_MS}ms... (Error: ${error.message})`);
        await this.sleep(RETRY_DELAY_MS * attempt); // Exponential backoff
      }
    }

    HttpErrorHandler.handleError('mongolchat', lastError);
  }

  private async httpRequest<T>(body: any, api: API): Promise<T> {
    const config: AxiosRequestConfig = {
      method: api.method,
      url: this.endpoint + api.url,
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.apiKey,
        'Authorization': `WorkerKey ${this.workerKey}`
      },
      data: body,
      timeout: TIMEOUT_MS
    };

    return this.makeRequest<T>(config);
  }

  async generateQR(input: MchatOnlineQrGenerateRequest): Promise<MchatOnlineQrGenerateResponse> {
    return this.httpRequest<MchatOnlineQrGenerateResponse>(input, MchatOnlineQrGenerate);
  }

  async checkQR(qr: string): Promise<MchatOnlineQrCheckResponse> {
    return this.httpRequest<MchatOnlineQrCheckResponse>({ qr }, MchatOnlineQrcheck);
  }
} 