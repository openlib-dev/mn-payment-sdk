import axios from 'axios';
import crypto from 'crypto';
import {
  GolomtConfig,
  CreateInvoiceInput,
  CreateInvoiceResponse,
  CreateInvoiceRequest,
  InquiryResponse,
  InquiryRequest,
  ByTokenRequest,
  ByTokenResponse,
  Lang,
  PaymentMethod
} from './types';
import {
  ECommerceInvoiceCreate,
  ECommerceInquiry,
  ECommercePayByToken
} from './apis';
import { API } from '../types';
import { HttpErrorHandler, PaymentError, PaymentErrorCode } from '../common/errors';

export class GolomtClient {
  private endpoint: string;
  private secret: string;
  private bearerToken: string;

  constructor(config: GolomtConfig) {
    this.endpoint = config.endpoint;
    this.secret = config.secret;
    this.bearerToken = config.bearerToken;
  }

  private boolToString(v: boolean): string {
    return v ? 'Y' : 'N';
  }

  private generateHMAC(secret: string, data: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('hex');
  }

  private appendAsString(...args: any[]): string {
    return args.join('');
  }

  getUrlByInvoiceId(invoice: string, lang: Lang, paymentMethod: PaymentMethod): string {
    return `${this.endpoint}/${paymentMethod}/${lang}/${invoice}`;
  }

  async payByToken(amount: number, token: string, transactionId: string, lang: string): Promise<ByTokenResponse> {
    const checksum = this.generateHMAC(
      this.secret,
      this.appendAsString(amount, transactionId, token)
    );

    const request: ByTokenRequest = {
      amount: amount.toString(),
      checksum,
      token,
      transactionId,
      lang,
      invoice: '' // This will be set by the server
    };

    const response = await this.httpRequestGolomtEcommerce<ByTokenResponse>(request, ECommercePayByToken);
    
    if (response.errorCode !== '000') {
      throw new PaymentError({
        code: PaymentErrorCode.PAYMENT_FAILED,
        message: response.errorDesc,
        provider: 'golomt',
        requestId: transactionId
      });
    }

    return response;
  }

  async createInvoice(input: CreateInvoiceInput): Promise<CreateInvoiceResponse> {
    const amount = input.amount.toFixed(2);
    const checksum = this.generateHMAC(
      this.secret,
      this.appendAsString(
        input.transactionId,
        amount,
        input.returnType,
        input.callback
      )
    );

    const request: CreateInvoiceRequest = {
      amount,
      checksum,
      transactionId: input.transactionId,
      returnType: input.returnType,
      callback: input.callback,
      genToken: this.boolToString(input.getToken),
      socialDeeplink: this.boolToString(input.socialDeeplink)
    };

    return this.httpRequestGolomtEcommerce<CreateInvoiceResponse>(request, ECommerceInvoiceCreate);
  }

  async inquiry(transactionId: string): Promise<InquiryResponse> {
    const checksum = this.generateHMAC(
      this.secret,
      this.appendAsString(transactionId, transactionId)
    );

    const request: InquiryRequest = {
      checksum,
      transactionId
    };

    const response = await this.httpRequestGolomtEcommerce<InquiryResponse>(request, ECommerceInquiry);
    
    if (response.errorCode !== '000') {
      throw new PaymentError({
        code: PaymentErrorCode.PAYMENT_FAILED,
        message: response.errorDesc,
        provider: 'golomt',
        requestId: transactionId
      });
    }

    return response;
  }

  private async httpRequestGolomtEcommerce<T>(body: any, api: API): Promise<T> {
    try {
      const response = await axios({
        method: api.method,
        url: `${this.endpoint}${api.url}`,
        data: body,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.bearerToken}`
        }
      });

      return response.data;
    } catch (error) {
      HttpErrorHandler.handleError('golomt', error);
    }
  }
} 