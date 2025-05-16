import axios, { AxiosRequestConfig } from 'axios';
import {
  PassConfig,
  CreateOrderInput,
  CreateOrderResponse,
  OrderInqueryInput,
  OrderInqueryResponse,
  OrderNotifyInput,
  OrderNotifyResponse,
  OrderCancelInput,
  OrderCancelResponse,
  OrderVoidInput,
  OrderVoidResponse
} from './types';
import {
  PassCreateOrder,
  PassInqueryOrder,
  PassNotifyOrder,
  PassCancelOrder,
  PassVoidOrder
} from './apis';
import { HttpErrorHandler, PaymentError, PaymentErrorCode } from '../common/errors';
import { API } from '../types';

const MAX_RETRIES = 3;
const TIMEOUT_MS = 30000; // 30 seconds
const RETRY_DELAY_MS = 1000; // 1 second

export class PassClient {
  private endpoint: string;
  private ecommerceToken: string;
  private callback: string;

  constructor(config: PassConfig) {
    this.endpoint = config.endpoint;
    this.ecommerceToken = config.ecommerceToken;
    this.callback = config.callback;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest<T>(config: AxiosRequestConfig): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[PassClient] Making ${config.method} request to ${config.url} (Attempt ${attempt}/${MAX_RETRIES})`);
        const response = await axios(config);
        const data = response.data;

        if (data.msg?.code) {
          throw new PaymentError({
            code: PaymentErrorCode.PAYMENT_FAILED,
            message: `[${data.msg.code}] (${data.msg.level}) ${data.msg.body}`,
            provider: 'pass',
            requestId: data.orderId || data.msg.code
          });
        }

        console.log(`[PassClient] Successfully completed ${config.method} request to ${config.url}`);
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

        console.log(`[PassClient] Request failed, retrying in ${RETRY_DELAY_MS}ms... (Error: ${error.message})`);
        await this.sleep(RETRY_DELAY_MS * attempt); // Exponential backoff
      }
    }

    HttpErrorHandler.handleError('pass', lastError);
  }

  private async httpRequestPass<T>(body: any, api: API): Promise<T> {
    const config: AxiosRequestConfig = {
      method: api.method,
      url: this.endpoint + api.url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: body,
      timeout: TIMEOUT_MS
    };

    return this.makeRequest<T>(config);
  }

  async createOrder(amount: number, callbackParams: Record<string, string>): Promise<CreateOrderResponse> {
    const params = new URLSearchParams(callbackParams);
    const request: CreateOrderInput = {
      ecommerceToken: this.ecommerceToken,
      amount: amount * 100, // Convert to cents
      callbackUrl: `${this.callback}?${params.toString()}`
    };

    return this.httpRequestPass<CreateOrderResponse>(request, PassCreateOrder);
  }

  async inqueryOrder(orderId: string): Promise<OrderInqueryResponse> {
    const request: OrderInqueryInput = {
      ecommerceToken: this.ecommerceToken,
      orderId
    };

    return this.httpRequestPass<OrderInqueryResponse>(request, PassInqueryOrder);
  }

  async notifyOrder(orderId: string, phone: string): Promise<OrderNotifyResponse> {
    const request: OrderNotifyInput = {
      ecommerceToken: this.ecommerceToken,
      orderId,
      phone
    };

    return this.httpRequestPass<OrderNotifyResponse>(request, PassNotifyOrder);
  }

  async cancelOrder(orderId: string): Promise<OrderCancelResponse> {
    const request: OrderCancelInput = {
      ecommerceToken: this.ecommerceToken,
      orderId
    };

    return this.httpRequestPass<OrderCancelResponse>(request, PassCancelOrder);
  }

  async voidOrder(orderId: string): Promise<OrderVoidResponse> {
    const request: OrderVoidInput = {
      ecommerceToken: this.ecommerceToken,
      orderId
    };

    return this.httpRequestPass<OrderVoidResponse>(request, PassVoidOrder);
  }
} 