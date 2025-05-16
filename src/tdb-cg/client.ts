import axios, { AxiosRequestConfig } from 'axios';
import https from 'https';
import fs from 'fs';
import {
  TdbCgConfig,
  TdbCgAuthTokenRequest,
  TdbCgAuthTokenResponse,
  TdbCgAuthRefreshRequest,
  TdbCgPaymentGetRequest,
  TdbCgPaymentGetResponse,
  TdbCgPaymentCheckRequest,
  TdbCgPaymentCheckResponse,
  TdbCgInvoiceCreateRequest,
  TdbCgInvoiceCreateResponse,
  TdbCgInvoiceGetRequest,
  TdbCgInvoiceGetResponse
} from './types';

export class TdbCgClient {
  private endpoint: string;
  private loginId: string;
  private clientSecret: string;
  private password: string;
  private certPass: string;
  private certPathPfx: string;
  private certPathCer: string;
  private anyBic: string;
  private roleId: string;

  constructor(config: TdbCgConfig) {
    this.endpoint = config.endpoint;
    this.loginId = config.loginId;
    this.clientSecret = config.clientSecret;
    this.password = config.password;
    this.certPass = config.certPass;
    this.certPathPfx = config.certPathPfx;
    this.certPathCer = config.certPathCer;
    this.anyBic = config.anyBic;
    this.roleId = config.roleId;
  }

  private async httpRequest<T>(body: any, url: string, method: string, urlExt: string = ''): Promise<T> {
    // Read certificate files
    const pfxData = fs.readFileSync(this.certPathPfx);
    const cerData = fs.readFileSync(this.certPathCer);

    // Create HTTPS agent with certificates
    const httpsAgent = new https.Agent({
      pfx: pfxData,
      passphrase: this.certPass,
      ca: cerData
    });

    const config: AxiosRequestConfig = {
      method,
      url: this.endpoint + url + urlExt,
      httpsAgent,
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': `Basic ${Buffer.from(`${this.loginId}:${this.password}`).toString('base64')}`
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

  async getAuthToken(request: TdbCgAuthTokenRequest): Promise<TdbCgAuthTokenResponse> {
    return this.httpRequest<TdbCgAuthTokenResponse>(
      request,
      '/auth/token',
      'POST'
    );
  }

  async refreshAuthToken(request: TdbCgAuthRefreshRequest): Promise<TdbCgAuthTokenResponse> {
    return this.httpRequest<TdbCgAuthTokenResponse>(
      request,
      '/auth/refresh',
      'POST'
    );
  }

  async getPayment(request: TdbCgPaymentGetRequest): Promise<TdbCgPaymentGetResponse> {
    return this.httpRequest<TdbCgPaymentGetResponse>(
      null,
      '/payment/get/',
      'GET',
      request.paymentId
    );
  }

  async checkPayment(request: TdbCgPaymentCheckRequest): Promise<TdbCgPaymentCheckResponse> {
    return this.httpRequest<TdbCgPaymentCheckResponse>(
      null,
      '/payment/check/',
      'GET',
      request.paymentId
    );
  }

  async createInvoice(request: TdbCgInvoiceCreateRequest): Promise<TdbCgInvoiceCreateResponse> {
    return this.httpRequest<TdbCgInvoiceCreateResponse>(
      request,
      '/bill/create',
      'POST'
    );
  }

  async getInvoice(request: TdbCgInvoiceGetRequest): Promise<TdbCgInvoiceGetResponse> {
    return this.httpRequest<TdbCgInvoiceGetResponse>(
      null,
      '/invoice/',
      'GET',
      request.invoiceId
    );
  }
} 