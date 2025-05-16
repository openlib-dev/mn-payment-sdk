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
  Bank,
  DeeplinkCreateResponse,
  DeeplinkCheckResponse
} from './types';
import {
  MonpayGenerateQr,
  MonpayCheckQr,
  MonpayDeeplinkCreate,
  MonpayDeeplinkCheck,
  MonpayDeeplinkAuth
} from './apis';
import { HttpErrorHandler, PaymentError, PaymentErrorCode } from '../common/errors';
import { API } from '../types';

export class MonpayClient {
  private endpoint: string;
  private username: string;
  private accountId: string;

  constructor(config: MonpayConfig) {
    this.endpoint = config.endpoint;
    this.username = config.username;
    this.accountId = config.accountId;
  }

  private async httpRequest<T>(body: any, api: API, urlExt: string = ''): Promise<T> {
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
    } catch (error) {
      HttpErrorHandler.handleError('monpay', error);
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

    const response = await this.httpRequest<MonpayQrResponse>(
      request,
      MonpayGenerateQr
    );

    if (response.code !== 0) {
      throw new PaymentError({
        code: PaymentErrorCode.PAYMENT_FAILED,
        message: response.info || 'Failed to generate QR',
        provider: 'monpay',
        requestId: input.referenceNumber
      });
    }

    return response;
  }

  async checkQr(uuid: string): Promise<MonpayResultCheck> {
    const response = await this.httpRequest<MonpayCheckResponse>(
      null,
      MonpayCheckQr,
      `?uuid=${uuid}`
    );

    if (response.code !== 0) {
      throw new PaymentError({
        code: PaymentErrorCode.PAYMENT_FAILED,
        message: response.info || 'Failed to check QR',
        provider: 'monpay',
        requestId: uuid
      });
    }

    return response.result;
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
    } catch (error) {
      HttpErrorHandler.handleError('monpay', error);
    }
  }

  private async httpRequest<T>(body: any, api: API, urlExt: string = ''): Promise<T> {
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
    } catch (error) {
      HttpErrorHandler.handleError('monpay', error);
    }
  }

  async createInvoice(
    amount: number,
    description: string,
    type: InvoiceType = InvoiceType.PURCHASE,
    bank: Bank = Bank.KHANBANK
  ): Promise<DeeplinkCreateResponse> {
    const request = {
      amount,
      description,
      type,
      bank
    };

    const response = await this.httpRequest<DeeplinkCreateResponse>(
      request,
      MonpayDeeplinkCreate
    );

    if (response.intCode !== 0) {
      throw new PaymentError({
        code: PaymentErrorCode.PAYMENT_FAILED,
        message: response.info || 'Failed to create invoice',
        provider: 'monpay',
        requestId: response.result.id.toString()
      });
    }

    return response;
  }

  async checkInvoice(invoiceId: string): Promise<DeeplinkCheckResponse> {
    const response = await this.httpRequest<DeeplinkCheckResponse>(
      null,
      MonpayDeeplinkCheck,
      invoiceId
    );

    if (response.intCode !== 0) {
      throw new PaymentError({
        code: PaymentErrorCode.PAYMENT_FAILED,
        message: response.info || 'Failed to check invoice',
        provider: 'monpay',
        requestId: invoiceId
      });
    }

    return response;
  }
} 