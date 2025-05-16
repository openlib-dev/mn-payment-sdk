import axios, { AxiosRequestConfig } from 'axios';
import {
  MongolchatConfig,
  MchatOnlineQrGenerateRequest,
  MchatOnlineQrGenerateResponse,
  MchatOnlineQrCheckResponse
} from './types';
import {
  MchatOnlineQrGenerate,
  MchatOnlineQrcheck
} from './apis';

export class MongolchatClient {
  private endpoint: string;
  private apiKey: string;
  private workerKey: string;
  private appSecret: string;
  private branchNo: string;

  constructor(config: MongolchatConfig) {
    this.endpoint = config.endpoint;
    this.apiKey = config.apiKey;
    this.workerKey = config.workerKey;
    this.appSecret = config.appSecret;
    this.branchNo = config.branchNo;
  }

  private async httpRequest<T>(body: any, api: { url: string; method: string }): Promise<T> {
    const config: AxiosRequestConfig = {
      method: api.method,
      url: this.endpoint + api.url,
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.apiKey,
        'Authorization': `WorkerKey ${this.workerKey}`
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

  async generateQR(input: MchatOnlineQrGenerateRequest): Promise<MchatOnlineQrGenerateResponse> {
    const response = await this.httpRequest<MchatOnlineQrGenerateResponse>(
      input,
      MchatOnlineQrGenerate
    );

    if (response.code !== 1000) {
      throw new Error(response.message);
    }

    return response;
  }

  async checkQR(qr: string): Promise<MchatOnlineQrCheckResponse> {
    const response = await this.httpRequest<MchatOnlineQrCheckResponse>(
      { qr },
      MchatOnlineQrcheck
    );

    if (response.code !== 1000) {
      throw new Error(response.message);
    }

    return response;
  }
} 