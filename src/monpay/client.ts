import axios, { AxiosRequestConfig } from 'axios';
import {
  MonpayConfig,
  MonpayQrInput,
  MonpayQrRequest,
  MonpayQrResponse,
  MonpayResultQr,
  MonpayResultCheck,
  MonpayCheckResponse,
  MonpayAccessToken,
  InvoiceType,
  Bank
} from './types';
import {
  MonpayGenerateQr,
  MonpayCheckQr,
  MonpayDeeplinkCreate,
  MonpayDeeplinkCheck,
  MonpayDeeplinkAuth
} from './apis';

export class MonpayClient {
  private endpoint: string;
  private username: string;
  private accountId: string;

  constructor(config: MonpayConfig) {
    this.endpoint = config.endpoint;
    this.username = config.username;
    this.accountId = config.accountId;
  }

  private async httpRequest<T>(body: any, api: { url: string; method: string }, urlExt: string = ''): Promise<T> {
    const config: AxiosRequestConfig = {
      method: api.method,
      url: this.endpoint + api.url + urlExt,
      headers: {
        'Content-Type': 'application/json'
      },
      auth: {
        username: this.username,
        password: this.accountId
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

  async generateQr(input: MonpayQrInput): Promise<MonpayQrResponse> {
    const request: MonpayQrRequest = {
      amount: input.amount,
      branchId: input.branchId,
      products: input.products,
      title: input.title,
      subTitle: input.subTitle,
      noat: input.noat,
      nhat: input.nhat,
      ttd: input.ttd,
      referenceNumber: input.referenceNumber,
      expireTime: input.expireTime
    };

    return this.httpRequest<MonpayQrResponse>(
      request,
      MonpayGenerateQr
    );
  }

  async checkQr(uuid: string): Promise<MonpayResultQr> {
    return this.httpRequest<MonpayResultQr>(
      null,
      MonpayCheckQr,
      `?uuid=${uuid}`
    );
  }
}

export class MonpayDeeplinkClient {
  private endpoint: string;
  private clientId: string;
  private clientSecret: string;
  private grantType: string;
  private accessToken: MonpayAccessToken | null;

  constructor(config: MonpayConfig) {
    this.endpoint = config.endpoint;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.grantType = 'client_credentials';
    this.accessToken = null;
  }

  private async getAccessToken(): Promise<MonpayAccessToken> {
    if (this.accessToken) {
      return this.accessToken;
    }

    const formData = new URLSearchParams();
    formData.append('client_id', this.clientId);
    formData.append('client_secret', this.clientSecret);
    formData.append('grant_type', this.grantType);

    const config: AxiosRequestConfig = {
      method: MonpayDeeplinkAuth.method,
      url: this.endpoint + MonpayDeeplinkAuth.url,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData
    };

    try {
      const response = await axios(config);
      const token = response.data as MonpayAccessToken;
      this.accessToken = token;
      return token;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.error || error.response.data);
      }
      throw error;
    }
  }

  private async httpRequest<T>(body: any, api: { url: string; method: string }, urlExt: string = ''): Promise<T> {
    const auth = await this.getAccessToken();

    const config: AxiosRequestConfig = {
      method: api.method,
      url: this.endpoint + api.url + urlExt,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.accessToken}`
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

  async createInvoice(
    amount: number,
    description: string,
    type: InvoiceType = InvoiceType.PURCHASE,
    bank: Bank = Bank.KHANBANK
  ): Promise<MonpayResultCheck> {
    const request = {
      amount,
      description,
      type,
      bank
    };

    return this.httpRequest<MonpayResultCheck>(
      request,
      MonpayDeeplinkCreate
    );
  }

  async checkInvoice(invoiceId: string): Promise<MonpayCheckResponse> {
    return this.httpRequest<MonpayCheckResponse>(
      null,
      MonpayDeeplinkCheck,
      invoiceId
    );
  }
} 