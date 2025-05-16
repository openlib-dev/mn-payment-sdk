import axios, { AxiosRequestConfig } from 'axios';
import {
  PassConfig,
  CreateOrderInput,
  CreateOrderResponse,
  OrderInqueryInput,
  OrderInqueryResponse,
  OrderNotifyInput,
  OrderNotifyResponse,
  OrderCancelInput,
  OrderCancelResponse,
  OrderVoidInput,
  OrderVoidResponse
} from './types';
import {
  PassCreateOrder,
  PassInqueryOrder,
  PassNotifyOrder,
  PassCancelOrder,
  PassVoidOrder
} from './apis';

export class PassClient {
  private endpoint: string;
  private ecommerceToken: string;
  private callback: string;

  constructor(config: PassConfig) {
    this.endpoint = config.endpoint;
    this.ecommerceToken = config.ecommerceToken;
    this.callback = config.callback;
  }

  private async httpRequestPass<T>(body: any, api: { url: string; method: string }): Promise<T> {
    const config: AxiosRequestConfig = {
      method: api.method,
      url: this.endpoint + api.url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: body
    };

    try {
      const response = await axios(config);
      const data = response.data as any;
      if (data.msg?.code) {
        throw new Error(`[${data.msg.code}] (${data.msg.level}) ${data.msg.body}`);
      }
      return data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || error.message);
      }
      throw error;
    }
  }

  async createOrder(amount: number, callbackParams: Record<string, string>): Promise<CreateOrderResponse> {
    const params = new URLSearchParams(callbackParams);
    const request: CreateOrderInput = {
      ecommerceToken: this.ecommerceToken,
      amount: amount * 100, // Convert to cents
      callbackUrl: `${this.callback}?${params.toString()}`
    };

    return this.httpRequestPass<CreateOrderResponse>(request, PassCreateOrder);
  }

  async inqueryOrder(orderId: string): Promise<OrderInqueryResponse> {
    const request: OrderInqueryInput = {
      ecommerceToken: this.ecommerceToken,
      orderId
    };

    return this.httpRequestPass<OrderInqueryResponse>(request, PassInqueryOrder);
  }

  async notifyOrder(orderId: string, phone: string): Promise<OrderNotifyResponse> {
    const request: OrderNotifyInput = {
      ecommerceToken: this.ecommerceToken,
      orderId,
      phone
    };

    return this.httpRequestPass<OrderNotifyResponse>(request, PassNotifyOrder);
  }

  async cancelOrder(orderId: string): Promise<OrderCancelResponse> {
    const request: OrderCancelInput = {
      ecommerceToken: this.ecommerceToken,
      orderId
    };

    return this.httpRequestPass<OrderCancelResponse>(request, PassCancelOrder);
  }

  async voidOrder(orderId: string): Promise<OrderVoidResponse> {
    const request: OrderVoidInput = {
      ecommerceToken: this.ecommerceToken,
      orderId
    };

    return this.httpRequestPass<OrderVoidResponse>(request, PassVoidOrder);
  }
} 