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

  private async httpRequestPos<T>(body: any, api: { url: string; method: string }, urlExt: string = ''): Promise<T> {
    const config: AxiosRequestConfig = {
      method: api.method,
      url: this.endpoint + api.url + urlExt,
      headers: {
        'Authorization': this.authorization,
        'api_key': 'spos_pay_v4',
        'im_api_key': this.imApiKey,
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      config.data = body;
    }

    try {
      const response = await axios(config);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.error + ':' + error.response.data.message);
      }
      throw error;
    }
  }

  private async httpRequestThirdParty<T>(body: any, api: { url: string; method: string }, urlExt: string = ''): Promise<T> {
    const config: AxiosRequestConfig = {
      method: api.method,
      url: this.endpoint + api.url + urlExt,
      headers: {
        'Authorization': this.authorization,
        'api_key': 'third_party_pay',
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      config.data = body;
    }

    try {
      const response = await axios(config);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.error + ':' + error.response.data.message);
      }
      throw error;
    }
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