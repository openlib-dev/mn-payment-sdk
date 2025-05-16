import {
  SocialPayConfig,
  SocialPayInvoicePhoneRequest,
  SocialPayInvoiceSimpleRequest,
  SocialPaySettlementRequest,
  SocialPaySimpleResponse,
  SocialPayTransactionResponse,
  SocialPayPaymentSettlementResponse
} from './types';
import {
  SocialPayInvoicePhone,
  SocialPayInvoiceQr,
  SocialPayInvoiceCancel,
  SocialPayInvoiceCheck,
  SocialPayPaymentCancel,
  SocialPayPaymentSettlement
} from './apis';
import { API } from '../types';

import { HttpErrorHandler, PaymentError, PaymentErrorCode } from '../common/errors';

export class SocialPayClient {
  private endpoint: string;

  constructor(config: SocialPayConfig) {
    this.endpoint = config.endpoint;
  }

  private async httpRequest<T>(body: any, api: API): Promise<T> {
    try {
      const response = await fetch(this.endpoint + api.url, {
        method: api.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new PaymentError({
          code: PaymentErrorCode.PROVIDER_ERROR,
          message: `HTTP error! status: ${response.status} - ${errorText}`,
          provider: 'socialpay'
        });
      }

      const data = await response.json();
      if (data.code && data.code !== 0) {
        throw new PaymentError({
          code: PaymentErrorCode.PAYMENT_FAILED,
          message: data.message || 'Payment failed',
          provider: 'socialpay',
          requestId: data.id
        });
      }
      return data;
    } catch (error) {
      HttpErrorHandler.handleError('socialpay', error);
    }
  }

  async createInvoicePhone(request: SocialPayInvoicePhoneRequest): Promise<SocialPayTransactionResponse> {
    return this.httpRequest<SocialPayTransactionResponse>(request, SocialPayInvoicePhone);
  }

  async createInvoiceQr(request: SocialPayInvoiceSimpleRequest): Promise<SocialPayTransactionResponse> {
    return this.httpRequest<SocialPayTransactionResponse>(request, SocialPayInvoiceQr);
  }

  async cancelInvoice(request: SocialPayInvoiceSimpleRequest): Promise<SocialPaySimpleResponse> {
    return this.httpRequest<SocialPaySimpleResponse>(request, SocialPayInvoiceCancel);
  }

  async checkInvoice(request: SocialPayInvoiceSimpleRequest): Promise<SocialPayTransactionResponse> {
    return this.httpRequest<SocialPayTransactionResponse>(request, SocialPayInvoiceCheck);
  }

  async cancelPayment(request: SocialPayInvoiceSimpleRequest): Promise<SocialPaySimpleResponse> {
    return this.httpRequest<SocialPaySimpleResponse>(request, SocialPayPaymentCancel);
  }

  async settlement(request: SocialPaySettlementRequest): Promise<SocialPayPaymentSettlementResponse> {
    return this.httpRequest<SocialPayPaymentSettlementResponse>(request, SocialPayPaymentSettlement);
  }
} 