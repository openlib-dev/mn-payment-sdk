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

  private async httpRequest<T>(body: any, api: { url: string; method: string }, urlExt: string = ''): Promise<T> {
    const authObj = await this.authQpayV2();
    this.loginObject = authObj;

    const config: AxiosRequestConfig = {
      method: api.method,
      url: this.endpoint + api.url + urlExt,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.loginObject.accessToken}`
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
        throw new Error(error.response.data.error || error.response.data);
      }
      throw error;
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

    const config: AxiosRequestConfig = {
      method: QPayAuthToken.method,
      url: this.endpoint + QPayAuthToken.url,
      headers: {
        'Content-Type': 'application/json'
      },
      auth: {
        username: this.username,
        password: this.password
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