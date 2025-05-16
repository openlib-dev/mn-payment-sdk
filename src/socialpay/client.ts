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

export class SocialPayClient {
  private endpoint: string;

  constructor(config: SocialPayConfig) {
    this.endpoint = config.endpoint;
  }

  private async httpRequest<T>(body: any, api: { url: string; method: string }): Promise<T> {
    const response = await fetch(this.endpoint + api.url, {
      method: api.method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
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