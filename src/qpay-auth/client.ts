import axios, { AxiosRequestConfig } from 'axios';
import {
  QpayAuthConfig,
  QpayLoginResponse,
  QpayCreateInvoiceInput,
  QpaySimpleInvoiceRequest,
  QpaySimpleInvoiceResponse,
  QpayInvoiceGetResponse,
  QpayPaymentCheckRequest,
  QpayPaymentCheckResponse,
  QpayPaymentCancelRequest,
  QpayPaymentListRequest
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

export class QpayAuthClient {
  private endpoint: string;
  private password: string;
  private username: string;
  private callback: string;
  private invoiceCode: string;
  private merchantId: string;
  private loginObject: QpayLoginResponse | null;

  constructor(config: QpayAuthConfig) {
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

  private async authQpayV2(): Promise<QpayLoginResponse> {
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

  private async refreshToken(): Promise<QpayLoginResponse> {
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

  async createInvoice(input: QpayCreateInvoiceInput): Promise<QpaySimpleInvoiceResponse> {
    const vals = new URLSearchParams();
    for (const [key, value] of Object.entries(input.callbackParam)) {
      vals.append(key, value);
    }

    const request: QpaySimpleInvoiceRequest = {
      invoiceCode: this.invoiceCode,
      senderInvoiceCode: input.senderCode,
      senderBranchCode: input.senderBranchCode,
      invoiceReceiverCode: input.receiverCode,
      invoiceDescription: input.description,
      amount: input.amount,
      callbackUrl: `${this.callback}?${vals.toString()}`
    };

    return this.httpRequest<QpaySimpleInvoiceResponse>(request, QPayInvoiceCreate);
  }

  async getInvoice(invoiceId: string): Promise<QpayInvoiceGetResponse> {
    return this.httpRequest<QpayInvoiceGetResponse>(null, QPayInvoiceGet, invoiceId);
  }

  async cancelInvoice(invoiceId: string): Promise<any> {
    return this.httpRequest<any>(null, QPayInvoiceCancel, invoiceId);
  }

  async getPayment(invoiceId: string): Promise<any> {
    return this.httpRequest<any>(null, QPayPaymentGet, invoiceId);
  }

  async checkPayment(invoiceId: string, pageLimit: number, pageNumber: number): Promise<QpayPaymentCheckResponse> {
    const request: QpayPaymentCheckRequest = {
      objectId: invoiceId,
      objectType: 'INVOICE',
      offset: {
        pageLimit,
        pageNumber
      }
    };

    return this.httpRequest<QpayPaymentCheckResponse>(request, QPayPaymentCheck);
  }

  async cancelPayment(invoiceId: string, paymentUUID: string): Promise<QpayPaymentCheckResponse> {
    const request: QpayPaymentCancelRequest = {
      callbackUrl: this.callback + paymentUUID,
      note: `Cancel payment - ${invoiceId}`
    };

    return this.httpRequest<QpayPaymentCheckResponse>(request, QPayPaymentCancel, invoiceId);
  }

  async refundPayment(invoiceId: string, paymentUUID: string): Promise<any> {
    const request: QpayPaymentCancelRequest = {
      callbackUrl: this.callback + paymentUUID,
      note: `Cancel payment - ${invoiceId}`
    };

    return this.httpRequest<any>(request, QPayPaymentRefund, `${invoiceId}/${paymentUUID}`);
  }

  async listPayments(request: QpayPaymentListRequest): Promise<any> {
    return this.httpRequest<any>(request, QPayPaymentList);
  }
} 