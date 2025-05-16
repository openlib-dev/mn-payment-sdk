import axios from 'axios';
import {
  HipayConfig,
  HipayCheckoutRequest,
  HipayCheckoutResponse,
  HipayCheckoutGetResponse,
  HipayPaymentGetResponse,
  HipayPaymentCorrectionRequest,
  HipayPaymentCorrectionResponse,
  HipayStatementRequest,
  HipayStatementResponse
} from './types';
import {
  HipayCheckout,
  HipayCheckoutGet,
  HipayPaymentGet,
  HipayPaymentCorrection,
  HipayStatement
} from './apis';
import { API } from '../types';
import { HttpErrorHandler, PaymentError, PaymentErrorCode } from '../common/errors';

const MAX_RETRIES = 3;
const TIMEOUT_MS = 30000; // 30 seconds
const RETRY_DELAY_MS = 1000; // 1 second

export class HipayClient {
  private endpoint: string;
  private token: string;
  private entityId: string;

  constructor(config: HipayConfig) {
    this.endpoint = config.endpoint;
    this.token = config.token;
    this.entityId = config.entityId;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest<T>(config: any): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[HipayClient] Making ${config.method} request to ${config.url} (Attempt ${attempt}/${MAX_RETRIES})`);
        const response = await axios(config);
        const data = response.data;

        if (data.result?.code && data.result.code !== '000.000.000') {
          throw new PaymentError({
            code: PaymentErrorCode.PAYMENT_FAILED,
            message: `${data.result.code}: ${data.result.description || 'Payment failed'}`,
            provider: 'hipay',
            requestId: data.id || data.result.code
          });
        }

        console.log(`[HipayClient] Successfully completed ${config.method} request to ${config.url}`);
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

        console.log(`[HipayClient] Request failed, retrying in ${RETRY_DELAY_MS}ms... (Error: ${error.message})`);
        await this.sleep(RETRY_DELAY_MS * attempt); // Exponential backoff
      }
    }

    HttpErrorHandler.handleError('hipay', lastError);
  }

  private async httpRequest<T>(body: any, api: API): Promise<T> {
    const config = {
      method: api.method,
      url: this.endpoint + api.url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      data: body,
      timeout: TIMEOUT_MS
    };

    return this.makeRequest<T>(config);
  }

  async checkout(amount: number): Promise<HipayCheckoutResponse> {
    const request: HipayCheckoutRequest = {
      entityId: this.entityId,
      amount,
      currency: 'MNT',
      qrData: true,
      signal: false
    };

    return this.httpRequest<HipayCheckoutResponse>(request, HipayCheckout);
  }

  async checkoutGet(checkoutId: string): Promise<HipayCheckoutGetResponse> {
    const ext = `${checkoutId}?entityId=${this.entityId}`;
    return this.httpRequest<HipayCheckoutGetResponse>(null, HipayCheckoutGet);
  }

  async paymentGet(paymentId: string): Promise<HipayPaymentGetResponse> {
    const ext = `${paymentId}?entityId=${this.entityId}`;
    return this.httpRequest<HipayPaymentGetResponse>(null, HipayPaymentGet);
  }

  async paymentCorrection(paymentId: string): Promise<HipayPaymentCorrectionResponse> {
    const request: HipayPaymentCorrectionRequest = {
      entityId: this.entityId,
      paymentId
    };

    return this.httpRequest<HipayPaymentCorrectionResponse>(request, HipayPaymentCorrection);
  }

  async statement(date: string): Promise<HipayStatementResponse> {
    const request: HipayStatementRequest = {
      entityId: this.entityId,
      date
    };

    return this.httpRequest<HipayStatementResponse>(request, HipayStatement);
  }
} 