import axios, { AxiosRequestConfig } from 'axios';
import {
  TokipayConfig,
  TokipayPaymentInput,
  TokipayPaymentQrRequest,
  TokipayPaymentResponse,
  TokipayPaymentStatusResponse,
  TokipayPaymentResponseExt,
  TokipayPaymentSentUserRequest,
  TokipayPaymentScanUserRequest,
  TokipayRefundRequest,
  TokipayRefundInput,
  TokipayDeeplinkRequest,
  TokipayDeeplinkResponse,
  TokipayThirdPartyPhoneRequest,
  TokipayThirdPartyPhoneResponse
} from './types';
import {
  TokipayPaymentQr,
  TokipayPaymentSentUser,
  TokipayPaymentScanUser,
  TokipayPaymentStatus,
  TokipayPaymentCancel,
  TokipayRefund,
  TokipayDeeplink,
  TokipayPhoneRequest,
  TokipayTransactionStatus
} from './apis';
import { API } from '../types';
import { HttpErrorHandler, PaymentError, PaymentErrorCode } from '../common/errors';

const MAX_RETRIES = 3;
const TIMEOUT_MS = 30000; // 30 seconds
const RETRY_DELAY_MS = 1000; // 1 second

export class TokipayClient {
  private endpoint: string;
  private apiKey: string;
  private imApiKey: string;
  private authorization: string;
  private merchantId: string;
  private successUrl: string;
  private failureUrl: string;
  private appSchemaIos: string;

  constructor(config: TokipayConfig) {
    this.endpoint = config.endpoint;
    this.apiKey = config.apiKey;
    this.imApiKey = config.imApiKey;
    this.authorization = config.authorization;
    this.merchantId = config.merchantId;
    this.successUrl = config.successUrl;
    this.failureUrl = config.failureUrl;
    this.appSchemaIos = config.appSchemaIos;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest<T>(config: AxiosRequestConfig, provider: string): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[TokipayClient] Making ${config.method} request to ${config.url} (Attempt ${attempt}/${MAX_RETRIES})`);
        const response = await axios(config);
        const data = response.data;

        if (data.error) {
          const errorCode = data.error.toLowerCase().includes('unauthorized') || 
                          data.error.toLowerCase().includes('auth') ? 
                          PaymentErrorCode.UNAUTHORIZED : 
                          PaymentErrorCode.PAYMENT_FAILED;

          throw new PaymentError({
            code: errorCode,
            message: `${data.error}: ${data.message}`,
            provider,
            requestId: data.id || data.error
          });
        }

        console.log(`[TokipayClient] Successfully completed ${config.method} request to ${config.url}`);
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

        console.log(`[TokipayClient] Request failed, retrying in ${RETRY_DELAY_MS}ms... (Error: ${error.message})`);
        await this.sleep(RETRY_DELAY_MS * attempt); // Exponential backoff
      }
    }

    HttpErrorHandler.handleError(provider, lastError);
  }

  private async httpRequestPos<T>(body: any, api: API, urlExt: string = ''): Promise<T> {
    const config: AxiosRequestConfig = {
      method: api.method,
      url: this.endpoint + api.url + urlExt,
      headers: {
        'Authorization': this.authorization,
        'api_key': 'spos_pay_v4',
        'im_api_key': this.imApiKey,
        'Content-Type': 'application/json'
      },
      timeout: TIMEOUT_MS
    };

    if (body) {
      config.data = body;
    }

    return this.makeRequest<T>(config, 'tokipay');
  }

  private async httpRequestThirdParty<T>(body: any, api: API, urlExt: string = ''): Promise<T> {
    const config: AxiosRequestConfig = {
      method: api.method,
      url: this.endpoint + api.url + urlExt,
      headers: {
        'Authorization': this.authorization,
        'api_key': 'third_party_pay',
        'Content-Type': 'application/json'
      },
      timeout: TIMEOUT_MS
    };

    if (body) {
      config.data = body;
    }

    return this.makeRequest<T>(config, 'tokipay');
  }

  async paymentQr(input: TokipayPaymentInput): Promise<TokipayPaymentResponse> {
    const request: TokipayPaymentQrRequest = {
      successUrl: this.successUrl,
      failureUrl: this.failureUrl,
      orderId: input.orderId,
      merchantId: this.merchantId,
      amount: input.amount,
      notes: input.notes,
      authorization: this.authorization
    };

    return this.httpRequestPos<TokipayPaymentResponse>(request, TokipayPaymentQr);
  }

  async paymentSentUser(input: TokipayPaymentInput): Promise<TokipayPaymentResponse> {
    const request: TokipayPaymentSentUserRequest = {
      successUrl: this.successUrl,
      failureUrl: this.failureUrl,
      orderId: input.orderId,
      merchantId: this.merchantId,
      amount: input.amount,
      notes: input.notes,
      authorization: this.authorization,
      phoneNo: input.phoneNo || '',
      countryCode: input.countryCode || ''
    };

    return this.httpRequestPos<TokipayPaymentResponse>(request, TokipayPaymentSentUser);
  }

  async paymentScanUser(input: TokipayPaymentInput): Promise<TokipayPaymentResponse> {
    const request: TokipayPaymentScanUserRequest = {
      successUrl: this.successUrl,
      failureUrl: this.failureUrl,
      orderId: input.orderId,
      merchantId: this.merchantId,
      amount: input.amount,
      notes: input.notes,
      authorization: this.authorization,
      requestId: input.requestId || ''
    };

    return this.httpRequestPos<TokipayPaymentResponse>(request, TokipayPaymentScanUser);
  }

  async paymentStatus(requestId: string): Promise<TokipayPaymentStatusResponse> {
    return this.httpRequestPos<TokipayPaymentStatusResponse>(
      null,
      TokipayPaymentStatus,
      `?requestId=${requestId}`
    );
  }

  async paymentCancel(requestId: string): Promise<TokipayPaymentStatusResponse> {
    return this.httpRequestPos<TokipayPaymentStatusResponse>(
      null,
      TokipayPaymentCancel,
      `?requestId=${requestId}`
    );
  }

  async paymentRefund(input: TokipayRefundInput): Promise<TokipayPaymentResponseExt> {
    const request: TokipayRefundRequest = {
      requestId: input.requestId,
      refundAmount: input.refundAmount,
      merchantId: this.merchantId
    };

    return this.httpRequestPos<TokipayPaymentResponseExt>(request, TokipayRefund);
  }

  async paymentThirdPartyDeeplink(input: TokipayPaymentInput): Promise<TokipayDeeplinkResponse> {
    const request: TokipayDeeplinkRequest = {
      successUrl: input.successUrl || this.successUrl,
      failureUrl: this.failureUrl,
      orderId: input.orderId,
      merchantId: this.merchantId,
      amount: input.amount,
      notes: input.notes,
      appSchemaIos: this.appSchemaIos,
      authorization: this.authorization,
      tokiWebSuccessUrl: this.successUrl,
      tokiWebFailureUrl: this.failureUrl
    };

    return this.httpRequestThirdParty<TokipayDeeplinkResponse>(request, TokipayDeeplink);
  }

  async paymentThirdPartyPhoneRequest(input: TokipayPaymentInput): Promise<TokipayThirdPartyPhoneResponse> {
    const request: TokipayThirdPartyPhoneRequest = {
      successUrl: this.successUrl,
      failureUrl: this.failureUrl,
      orderId: input.orderId,
      merchantId: this.merchantId,
      amount: input.amount,
      notes: input.notes,
      phoneNo: input.phoneNo || '',
      countryCode: input.countryCode || '+976',
      authorization: this.authorization,
      tokiWebSuccessUrl: this.successUrl,
      tokiWebFailureUrl: this.failureUrl
    };

    return this.httpRequestThirdParty<TokipayThirdPartyPhoneResponse>(request, TokipayPhoneRequest);
  }

  async paymentThirdPartyStatus(requestId: string): Promise<TokipayPaymentStatusResponse> {
    return this.httpRequestThirdParty<TokipayPaymentStatusResponse>(
      null,
      TokipayTransactionStatus,
      `?requestId=${requestId}`
    );
  }
} 