import axios from 'axios';
import {
  HipayConfig,
  HipayCheckoutRequest,
  HipayCheckoutResponse,
  HipayCheckoutGetResponse,
  HipayPaymentGetResponse,
  HipayPaymentCorrectionRequest,
  HipayPaymentCorrectionResponse,
  HipayStatementRequest,
  HipayStatementResponse
} from './types';
import {
  HipayCheckout,
  HipayCheckoutGet,
  HipayPaymentGet,
  HipayPaymentCorrection,
  HipayStatement
} from './apis';

export class HipayClient {
  private endpoint: string;
  private token: string;
  private entityId: string;

  constructor(config: HipayConfig) {
    this.endpoint = config.endpoint;
    this.token = config.token;
    this.entityId = config.entityId;
  }

  private async httpRequestHipay<T>(body: any, api: { url: string; method: string }, ext: string = ''): Promise<T> {
    try {
      const url = `${this.endpoint}${api.url}${ext}`;
      const response = await axios({
        method: api.method,
        url,
        data: body,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        }
      });

      const data = response.data as any;
      if (data.code !== 1) {
        throw new Error(
          `${data.description}: ${data.details?.[0]?.field || ''} - ${data.details?.[0]?.issue || ''}`
        );
      }

      return data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || error.message);
      }
      throw error;
    }
  }

  async checkout(amount: number): Promise<HipayCheckoutResponse> {
    const request: HipayCheckoutRequest = {
      entityId: this.entityId,
      amount,
      currency: 'MNT',
      qrData: true,
      signal: false
    };

    return this.httpRequestHipay<HipayCheckoutResponse>(request, HipayCheckout);
  }

  async checkoutGet(checkoutId: string): Promise<HipayCheckoutGetResponse> {
    const ext = `${checkoutId}?entityId=${this.entityId}`;
    return this.httpRequestHipay<HipayCheckoutGetResponse>(null, HipayCheckoutGet, ext);
  }

  async paymentGet(paymentId: string): Promise<HipayPaymentGetResponse> {
    const ext = `${paymentId}?entityId=${this.entityId}`;
    return this.httpRequestHipay<HipayPaymentGetResponse>(null, HipayPaymentGet, ext);
  }

  async paymentCorrection(paymentId: string): Promise<HipayPaymentCorrectionResponse> {
    const request: HipayPaymentCorrectionRequest = {
      entityId: this.entityId,
      paymentId
    };

    return this.httpRequestHipay<HipayPaymentCorrectionResponse>(request, HipayPaymentCorrection);
  }

  async statement(date: string): Promise<HipayStatementResponse> {
    const request: HipayStatementRequest = {
      entityId: this.entityId,
      date
    };

    return this.httpRequestHipay<HipayStatementResponse>(request, HipayStatement);
  }
} 