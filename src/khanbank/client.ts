import axios, { AxiosRequestConfig } from 'axios';
import {
  KhanConfig,
  OrderRegisterInput,
  RegisterOrderResponse,
  OrderStatusResponse,
  OrderRequest,
  OrderStatusRequest
} from './types';
import {
  KhanOrderRegister,
  KhanOrderStatus
} from './apis';
import { HttpErrorHandler, PaymentError, PaymentErrorCode } from '../common/errors';

const MAX_RETRIES = 3;
const TIMEOUT_MS = 30000; // 30 seconds
const RETRY_DELAY_MS = 1000; // 1 second

export class KhanClient {
  private endpoint: string;
  private username: string;
  private password: string;
  private language: string;

  constructor(config: KhanConfig) {
    this.endpoint = config.endpoint;
    this.username = config.username;
    this.password = config.password;
    this.language = config.language;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest<T>(config: AxiosRequestConfig): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[KhanClient] Making ${config.method} request to ${config.url} (Attempt ${attempt}/${MAX_RETRIES})`);
        const response = await axios(config);
        const data = response.data;

        if (data.ErrorCode) {
          throw new PaymentError({
            code: PaymentErrorCode.PAYMENT_FAILED,
            message: data.ErrorMessage || 'Payment failed',
            provider: 'Khan',
            requestId: data.OrderNumber || data.ErrorCode
          });
        }

        console.log(`[KhanClient] Successfully completed ${config.method} request to ${config.url}`);
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

        console.log(`[KhanClient] Request failed, retrying in ${RETRY_DELAY_MS}ms... (Error: ${error.message})`);
        await this.sleep(RETRY_DELAY_MS * attempt); // Exponential backoff
      }
    }

    HttpErrorHandler.handleError('Khan', lastError);
  }

  private async httpRequest<T>(body: any, api: API): Promise<T> {
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

  async registerOrder(input: OrderRegisterInput): Promise<RegisterOrderResponse> {
    const request: OrderRequest = {
      orderNumber: input.orderNumber,
      amount: input.amount.toFixed(2),
      returnUrl: input.successCallback,
      failUrl: input.failCallback,
      jsonParams: {
        orderNumber: input.orderNumber
      },
      userName: this.username,
      Password: this.password,
      language: this.language
    };

    return this.httpRequest<RegisterOrderResponse>(request, KhanOrderRegister);
  }

  async checkOrder(orderId: string): Promise<OrderStatusResponse> {
    const request: OrderStatusRequest = {
      userName: this.username,
      Password: this.password,
      language: this.language,
      orderId
    };

    const response = await this.httpRequest<any>(request, KhanOrderStatus);
    
    return {
      success: response.orderStatus === '2',
      errorCode: response.ErrorCode,
      errorMessage: response.ErrorMessage,
      orderNumber: response.OrderNumber,
      ip: response.Ip
    };
  }
} 