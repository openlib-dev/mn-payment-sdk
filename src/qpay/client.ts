import axios, { AxiosRequestConfig } from 'axios';
import {
  QPayConfig,
  QPayLoginResponse,
  QPayCreateInvoiceInput,
  QPaySimpleInvoiceRequest,
  QPaySimpleInvoiceResponse,
  QPayInvoiceGetResponse,
  QPayPaymentCheckRequest,
  QPayPaymentCheckResponse,
  QPayPaymentCancelRequest,
  QPayPaymentListRequest
} from './types';
import {
  QPayAuthToken,
  QPayAuthRefresh,
  QPayPaymentGet,
  QPayPaymentCheck,
  QPayPaymentCancel,
  QPayPaymentRefund,
  QPayPaymentList,
  QPayInvoiceCreate,
  QPayInvoiceGet,
  QPayInvoiceCancel
} from './apis';
import { HttpErrorHandler, PaymentError, PaymentErrorCode } from '../common/errors';
import { API } from '../types';

const MAX_RETRIES = 3;
const TIMEOUT_MS = 30000; // 30 seconds
const RETRY_DELAY_MS = 1000; // 1 second

export class QpayClient {
  private endpoint: string;
  private password: string;
  private username: string;
  private callback: string;
  private invoiceCode: string;
  private merchantId: string;
  private loginObject: QPayLoginResponse | null;

  constructor(config: QPayConfig) {
    this.endpoint = config.endpoint;
    this.password = config.password;
    this.username = config.username;
    this.callback = config.callback;
    this.invoiceCode = config.invoiceCode;
    this.merchantId = config.merchantId;
    this.loginObject = null;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest<T>(config: AxiosRequestConfig): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[QPayClient] Making ${config.method} request to ${config.url} (Attempt ${attempt}/${MAX_RETRIES})`);
        const response = await axios(config);
        const data = response.data;

        if (data.error) {
          throw new PaymentError({
            code: PaymentErrorCode.PAYMENT_FAILED,
            message: data.error || 'Payment failed',
            provider: 'qpay',
            requestId: data.id || data.error
          });
        }

        console.log(`[QPayClient] Successfully completed ${config.method} request to ${config.url}`);
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

        console.log(`[QPayClient] Request failed, retrying in ${RETRY_DELAY_MS}ms... (Error: ${error.message})`);
        await this.sleep(RETRY_DELAY_MS * attempt); // Exponential backoff
      }
    }

    HttpErrorHandler.handleError('qpay', lastError);
  }

  private async httpRequest<T>(body: any, api: API, urlExt: string = ''): Promise<T> {
    try {
      const authObj = await this.authQpayV2();
      this.loginObject = authObj;

      const config: AxiosRequestConfig = {
        method: api.method,
        url: this.endpoint + api.url + urlExt,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.loginObject.accessToken}`
        },
        timeout: TIMEOUT_MS
      };

      if (body) {
        config.data = body;
      }

      return this.makeRequest<T>(config);
    } catch (error) {
      HttpErrorHandler.handleError('qpay', error);
    }
  }

  private async authQpayV2(): Promise<QPayLoginResponse> {
    // Check if loginObject is valid
    if (this.loginObject) {
      const expireInA = new Date(this.loginObject.expiresIn * 1000);
      const expireInB = new Date(expireInA.getTime() - 12 * 60 * 60 * 1000);
      const now = new Date();
      if (now < expireInB) {
        return this.loginObject;
      }
    }

    try {
      const config: AxiosRequestConfig = {
        method: QPayAuthToken.method,
        url: this.endpoint + QPayAuthToken.url,
        headers: {
          'Content-Type': 'application/json'
        },
        auth: {
          username: this.username,
          password: this.password
        },
        timeout: TIMEOUT_MS
      };

      console.log(`[QPayClient] Making authentication request (Attempt 1/1)`);
      const response = await axios(config);
      const data = response.data;

      if (data.error) {
        throw new PaymentError({
          code: PaymentErrorCode.UNAUTHORIZED,
          message: data.error || 'Authentication failed',
          provider: 'qpay'
        });
      }

      console.log(`[QPayClient] Successfully authenticated`);
      return data;
    } catch (error) {
      HttpErrorHandler.handleError('qpay', error);
    }
  }

  private async refreshToken(): Promise<QPayLoginResponse> {
    if (!this.loginObject) {
      throw new Error('No login object available');
    }

    const config: AxiosRequestConfig = {
      method: QPayAuthRefresh.method,
      url: this.endpoint + QPayAuthRefresh.url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.loginObject.refreshToken}`
      }
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.error || error.response.data);
      }
      throw error;
    }
  }

  async createInvoice(input: QPayCreateInvoiceInput): Promise<QPaySimpleInvoiceResponse> {
    const vals = new URLSearchParams();
    for (const [key, value] of Object.entries(input.callbackParam)) {
      vals.append(key, value);
    }

    const request: QPaySimpleInvoiceRequest = {
      invoiceCode: this.invoiceCode,
      senderInvoiceCode: input.senderCode,
      senderBranchCode: input.senderBranchCode,
      invoiceReceiverCode: input.receiverCode,
      invoiceDescription: input.description,
      amount: input.amount,
      callbackUrl: `${this.callback}?${vals.toString()}`
    };

    return this.httpRequest<QPaySimpleInvoiceResponse>(
      request,
      QPayInvoiceCreate
    );
  }

  async getInvoice(invoiceId: string): Promise<QPayInvoiceGetResponse> {
    return this.httpRequest<QPayInvoiceGetResponse>(
      null,
      QPayInvoiceGet,
      invoiceId
    );
  }

  async cancelInvoice(invoiceId: string): Promise<any> {
    return this.httpRequest<any>(
      null,
      QPayInvoiceCancel,
      invoiceId
    );
  }

  async getPayment(invoiceId: string): Promise<any> {
    return this.httpRequest<any>(
      null,
      QPayPaymentGet,
      invoiceId
    );
  }

  async checkPayment(invoiceId: string, pageLimit: number, pageNumber: number): Promise<QPayPaymentCheckResponse> {
    const request: QPayPaymentCheckRequest = {
      objectID: invoiceId,
      objectType: 'INVOICE',
      offset: {
        pageLimit,
        pageNumber
      }
    };

    return this.httpRequest<QPayPaymentCheckResponse>(
      request,
      QPayPaymentCheck
    );
  }

  async cancelPayment(invoiceId: string, paymentUUID: string): Promise<QPayPaymentCheckResponse> {
    const request: QPayPaymentCancelRequest = {
      callbackUrl: this.callback + paymentUUID,
      note: `Cancel payment - ${invoiceId}`
    };

    return this.httpRequest<QPayPaymentCheckResponse>(
      request,
      QPayPaymentCancel,
      invoiceId
    );
  }

  async refundPayment(invoiceId: string, paymentUUID: string): Promise<any> {
    const request: QPayPaymentCancelRequest = {
      callbackUrl: this.callback + paymentUUID,
      note: `Cancel payment - ${invoiceId}`
    };

    return this.httpRequest<any>(
      request,
      QPayPaymentRefund,
      invoiceId
    );
  }
} 