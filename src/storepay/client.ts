import {
  StorepayConfig,
  StorepayLoginResponse,
  StorepayLoanInput,
  StorepayLoanRequest,
  StorepayLoanResponse,
  StorepayCheckResponse,
  StorepayUserCheckRequest,
  StorepayUserCheckResponse
} from './types';
import {
  StorepayAuth,
  StorepayLoan,
  StorepayLoanCheck,
  StorepayUserPossibleAmount
} from './apis';

export class StorepayClient {
  private appUsername: string;
  private appPassword: string;
  private username: string;
  private password: string;
  private authUrl: string;
  private baseUrl: string;
  private storeId: string;
  private callbackUrl: string;
  private expireIn: number | null;
  private loginObject: StorepayLoginResponse | null;

  constructor(config: StorepayConfig) {
    this.appUsername = config.appUsername;
    this.appPassword = config.appPassword;
    this.username = config.username;
    this.password = config.password;
    this.authUrl = config.authUrl;
    this.baseUrl = config.baseUrl;
    this.storeId = config.storeId;
    this.callbackUrl = config.callbackUrl;
    this.expireIn = null;
    this.loginObject = null;
  }

  private async httpRequest<T>(body: any, api: { url: string; method: string }, urlExt: string = ''): Promise<T> {
    const authObj = await this.authStorepay();
    this.loginObject = authObj;

    const response = await fetch(this.baseUrl + api.url + urlExt, {
      method: api.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.loginObject.access_token}`
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.status !== 'Success') {
      throw new Error(`${data.status}: ${data.msgList[0].code} - ${data.msgList[0].text}`);
    }

    return data;
  }

  private async authStorepay(): Promise<StorepayLoginResponse> {
    if (this.loginObject && this.expireIn && Date.now() < this.expireIn) {
      return this.loginObject;
    }

    const url = `${this.authUrl}${StorepayAuth.url}?grant_type=password&username=${this.appUsername}&password=${this.appPassword}`;
    const response = await fetch(url, {
      method: StorepayAuth.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`
      }
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`);
    }

    const data = await response.json();
    this.expireIn = Date.now() + (data.expires_in * 1000);
    return data;
  }

  async loan(input: StorepayLoanInput): Promise<number> {
    const request: StorepayLoanRequest = {
      storeId: this.storeId,
      mobileNumber: input.mobileNumber,
      description: input.description,
      amount: input.amount.toString(),
      callbackUrl: this.callbackUrl
    };

    const response = await this.httpRequest<StorepayLoanResponse>(request, StorepayLoan);
    return response.value;
  }

  async loanCheck(id: string): Promise<boolean> {
    const response = await this.httpRequest<StorepayCheckResponse>(null, StorepayLoanCheck, id);
    return response.value;
  }

  async userPossibleAmount(mobileNumber: string): Promise<number> {
    const request: StorepayUserCheckRequest = {
      mobileNumber
    };

    const response = await this.httpRequest<StorepayUserCheckResponse>(request, StorepayUserPossibleAmount);
    return response.value;
  }

  close(): void {
    this.expireIn = null;
    this.loginObject = null;
  }
} 