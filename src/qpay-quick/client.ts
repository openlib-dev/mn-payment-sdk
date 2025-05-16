import axios, { AxiosRequestConfig } from 'axios';
import {
  QpayQuickConfig,
  QpayLoginResponse,
  QpayCompanyCreateRequest,
  QpayCompanyCreateResponse,
  QpayPersonCreateRequest,
  QpayPersonCreateResponse,
  QpayMerchantListRequest,
  QpayMerchantListResponse,
  QpayMerchantGetResponse,
  QpayInvoiceRequest,
  QpayInvoiceResponse,
  QpayInvoiceGetResponse,
  QpayPaymentCheckRequest,
  QpayPaymentCheckResponse
} from './types';
import {
  QPayAuthToken,
  QPayAuthRefresh,
  QPayCreateCompany,
  QPayCreatePerson,
  QPayGetMerchant,
  QPayMerchantList,
  QPayInvoiceCreate,
  QPayInvoiceGet,
  QPayPaymentCheck
} from './apis';

export class QpayQuickClient {
  private endpoint: string;
  private username: string;
  private password: string;
  private terminalId: string;
  private loginObject: QpayLoginResponse | null;

  constructor(config: QpayQuickConfig) {
    this.endpoint = config.endpoint;
    this.username = config.username;
    this.password = config.password;
    this.terminalId = config.terminalId;
    this.loginObject = null;
  }

  private async httpRequest<T>(body: any, api: { url: string; method: string }, urlExt: string = ''): Promise<T> {
    const authObj = await this.authQPayV2();
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

  private async authQPayV2(): Promise<QpayLoginResponse> {
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
      },
      data: {
        terminal_id: this.terminalId
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

  async createCompany(request: QpayCompanyCreateRequest): Promise<QpayCompanyCreateResponse> {
    return this.httpRequest<QpayCompanyCreateResponse>(request, QPayCreateCompany);
  }

  async createPerson(request: QpayPersonCreateRequest): Promise<QpayPersonCreateResponse> {
    return this.httpRequest<QpayPersonCreateResponse>(request, QPayCreatePerson);
  }

  async getMerchant(merchantId: string): Promise<QpayMerchantGetResponse> {
    return this.httpRequest<QpayMerchantGetResponse>(null, QPayGetMerchant, merchantId);
  }

  async listMerchants(request: QpayMerchantListRequest): Promise<QpayMerchantListResponse> {
    return this.httpRequest<QpayMerchantListResponse>(request, QPayMerchantList);
  }

  async createInvoice(request: QpayInvoiceRequest): Promise<QpayInvoiceResponse> {
    return this.httpRequest<QpayInvoiceResponse>(request, QPayInvoiceCreate);
  }

  async getInvoice(invoiceId: string): Promise<QpayInvoiceGetResponse> {
    return this.httpRequest<QpayInvoiceGetResponse>(null, QPayInvoiceGet, invoiceId);
  }

  async checkPayment(request: QpayPaymentCheckRequest): Promise<QpayPaymentCheckResponse> {
    return this.httpRequest<QpayPaymentCheckResponse>(request, QPayPaymentCheck);
  }
} 