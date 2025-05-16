import {
  UpointConfig,
  UpointCheckInfoRequest,
  UpointCheckInfoResponse,
  UpointTransactionRequest,
  UpointTransactionResponse,
  UpointReturnTransactionRequest,
  UpointReturnTransactionResponse,
  UpointCheckTransactionRequest,
  UpointCheckTransactionResponse,
  UpointProductRequest,
  UpointProductResponse,
  UpointCancelTransactionRequest,
  UpointCancelTransactionResponse,
  UpointQrResponse,
  UpointQrCheckResponse,
  UpointQrCheckInfoResponse,
  UpointTransactionQrRequest,
  UpointTransactionQrResponse
} from './types';
import {
  UpointCheckUserInfo,
  UpointProcessTransaction,
  UpointReturnTransaction,
  UpointCheckTransaction,
  UpointCancelTransaction,
  UpointProduct,
  UpointQr,
  UpointCheckQr,
  UpointCheckQrInfo,
  UpointTransactionQr
} from './apis';

export class UpointClient {
  private endpoint: string;
  private token: string;

  constructor(config: UpointConfig) {
    this.endpoint = config.endpoint;
    this.token = config.token;
  }

  private async httpRequest<T>(body: any, api: { url: string; method: string }): Promise<T> {
    const response = await fetch(this.endpoint + api.url, {
      method: api.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.token}`
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async checkUserInfo(request: UpointCheckInfoRequest): Promise<UpointCheckInfoResponse> {
    return this.httpRequest<UpointCheckInfoResponse>(request, UpointCheckUserInfo);
  }

  async processTransaction(request: UpointTransactionRequest): Promise<UpointTransactionResponse> {
    return this.httpRequest<UpointTransactionResponse>(request, UpointProcessTransaction);
  }

  async returnTransaction(request: UpointReturnTransactionRequest): Promise<UpointReturnTransactionResponse> {
    return this.httpRequest<UpointReturnTransactionResponse>(request, UpointReturnTransaction);
  }

  async checkTransaction(request: UpointCheckTransactionRequest): Promise<UpointCheckTransactionResponse> {
    return this.httpRequest<UpointCheckTransactionResponse>(request, UpointCheckTransaction);
  }

  async cancelTransaction(request: UpointCancelTransactionRequest): Promise<UpointCancelTransactionResponse> {
    return this.httpRequest<UpointCancelTransactionResponse>(request, UpointCancelTransaction);
  }

  async getProduct(request: UpointProductRequest): Promise<UpointProductResponse> {
    return this.httpRequest<UpointProductResponse>(request, UpointProduct);
  }

  async generateQr(): Promise<UpointQrResponse> {
    return this.httpRequest<UpointQrResponse>(null, UpointQr);
  }

  async checkQr(qrString: string): Promise<UpointQrCheckResponse> {
    return this.httpRequest<UpointQrCheckResponse>({ qr_string: qrString }, UpointCheckQr);
  }

  async checkQrInfo(qrString: string): Promise<UpointQrCheckInfoResponse> {
    return this.httpRequest<UpointQrCheckInfoResponse>({ qr_string: qrString }, UpointCheckQrInfo);
  }

  async processTransactionQr(request: UpointTransactionQrRequest): Promise<UpointTransactionQrResponse> {
    return this.httpRequest<UpointTransactionQrResponse>(request, UpointTransactionQr);
  }
} 