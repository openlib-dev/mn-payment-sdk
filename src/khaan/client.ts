import axios, { AxiosRequestConfig } from 'axios';
import {
  KhaanConfig,
  OrderRegisterInput,
  RegisterOrderResponse,
  OrderStatusResponse,
  OrderRequest,
  OrderStatusRequest
} from './types';
import {
  KhaanOrderRegister,
  KhaanOrderStatus
} from './apis';

export class KhaanClient {
  private endpoint: string;
  private username: string;
  private password: string;
  private language: string;

  constructor(config: KhaanConfig) {
    this.endpoint = config.endpoint;
    this.username = config.username;
    this.password = config.password;
    this.language = config.language;
  }

  private async httpRequest<T>(body: any, api: { url: string; method: string }): Promise<T> {
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
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || error.message);
      }
      throw error;
    }
  }

  async registerOrder(input: OrderRegisterInput): Promise<RegisterOrderResponse> {
    const request: OrderRequest = {
      orderNumber: input.orderNumber,
      amount: input.amount.toFixed(2),
      returnUrl: input.successCallback,
      failUrl: input.failCallback,
      jsonParams: {
        orderNumber: input.orderNumber
      },
      userName: this.username,
      Password: this.password,
      language: this.language
    };

    return this.httpRequest<RegisterOrderResponse>(request, KhaanOrderRegister);
  }

  async checkOrder(orderId: string): Promise<OrderStatusResponse> {
    const request: OrderStatusRequest = {
      userName: this.username,
      Password: this.password,
      language: this.language,
      orderId
    };

    const response = await this.httpRequest<any>(request, KhaanOrderStatus);
    
    return {
      success: response.orderStatus === '2',
      errorCode: response.ErrorCode,
      errorMessage: response.ErrorMessage,
      orderNumber: response.OrderNumber,
      ip: response.Ip
    };
  }
} 