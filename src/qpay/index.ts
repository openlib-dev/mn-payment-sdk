import { API } from "../types";
import {
  QPayInvoiceCreate,
  QPayInvoiceGet,
  QPayInvoiceCancel,
  QPayPaymentGet,
  QPayPaymentCheck,
  QPayPaymentCancel,
  QPayPaymentRefund,
  QPayAuthRefresh,
  QPayAuthToken,
} from "./apis";
import {
  QPayCreateInvoiceInput,
  QPayInvoiceGetResponse,
  QPayLoginResponse,
  QPayPaymentCancelRequest,
  QPayPaymentCheckRequest,
  QPayPaymentCheckResponse,
  QPaySimpleInvoiceRequest,
  QPaySimpleInvoiceResponse,
} from "./types";

export class QPay {
  private endpoint: string;
  private password: string;
  private username: string;
  private callback: string;
  private invoiceCode: string;
  private merchantId: string;
  private loginObject: QPayLoginResponse | null;

  constructor(
    username: string,
    password: string,
    endpoint: string,
    callback: string,
    invoiceCode: string,
    merchantId: string
  ) {
    this.endpoint = endpoint;
    this.password = password;
    this.username = username;
    this.callback = callback;
    this.invoiceCode = invoiceCode;
    this.merchantId = merchantId;
    this.loginObject = null;
  }

  public async createInvoice(
    input: QPayCreateInvoiceInput
  ): Promise<QPaySimpleInvoiceResponse> {
    const vals = new URLSearchParams();

    for (const [k, v] of Object.entries(input.callbackParam)) {
      vals.append(k, v);
    }

    const amountInt = input.amount;
    const request: QPaySimpleInvoiceRequest = {
      invoiceCode: this.invoiceCode,
      senderInvoiceCode: input.senderCode,
      senderBranchCode: input.senderBranchCode,
      invoiceReceiverCode: input.receiverCode,
      invoiceDescription: input.description,
      amount: amountInt,
      callbackUrl: `${this.callback}?${vals.toString()}`,
    };

    const response = await this.httpRequestQPay<QPaySimpleInvoiceResponse>(
      QPayInvoiceCreate,
      "",
      request
    );

    return response;
  }

  public async getInvoice(invoiceId: string): Promise<QPayInvoiceGetResponse> {
    const response = await this.httpRequestQPay<QPayInvoiceGetResponse>(
      QPayInvoiceGet,
      invoiceId
    );

    return response;
  }

  public async cancelInvoice(invoiceId: string): Promise<{}> {
    const response = await this.httpRequestQPay<{}>(
      QPayInvoiceCancel,
      invoiceId
    );

    return response;
  }

  public async getPayment(invoiceId: string): Promise<{}> {
    const response = await this.httpRequestQPay<{}>(QPayPaymentGet, invoiceId);

    return response;
  }

  public async checkPayment(
    invoiceId: string,
    pageLimit: number,
    pageNumber: number
  ): Promise<QPayPaymentCheckResponse> {
    const req: QPayPaymentCheckRequest = {
      objectID: invoiceId,
      objectType: "INVOICE",
      offset: {
        pageLimit: pageLimit,
        pageNumber: pageNumber,
      },
    };

    const response = await this.httpRequestQPay<QPayPaymentCheckResponse>(
      QPayPaymentCheck,
      "",
      req
    );

    return response;
  }

  public async cancelPayment(
    invoiceId: string,
    paymentUUID: string
  ): Promise<QPayPaymentCheckResponse> {
    const req: QPayPaymentCancelRequest = {
      callbackUrl: `${this.callback}${paymentUUID}`,
      note: `Cancel payment - ${invoiceId}`,
    };

    const response = await this.httpRequestQPay<QPayPaymentCheckResponse>(
      QPayPaymentCancel,
      invoiceId,
      req
    );

    return response;
  }

  public async refundPayment(
    invoiceId: string,
    paymentUUID: string
  ): Promise<{}> {
    const req: QPayPaymentCancelRequest = {
      callbackUrl: `${this.callback}${paymentUUID}`,
      note: `Cancel payment - ${invoiceId}`,
    };

    const response = await this.httpRequestQPay<{}>(
      QPayPaymentRefund,
      invoiceId,
      req
    );

    return response;
  }

  private async authQPayV2(): Promise<QPayLoginResponse> {
    if (this.loginObject) {
      const expireInA = new Date(this.loginObject?.expiresIn * 1000);
      const expireInB = new Date(expireInA.getTime() - 12 * 60 * 60 * 1000);
      const now = new Date();

      if (now < expireInB) {
        return this.loginObject;
      }
    }

    const url = `${this.endpoint}/${QPayAuthToken.url}`;
    const headers = {
      "Content-Type": "application/json",
    };
    const basicAuth = btoa(`${this.username}:${this.password}`);

    const requestOptions: RequestInit = {
      method: QPayAuthToken.method,
      headers: {
        ...headers,
        Authorization: `Basic ${basicAuth}`,
      },
    };

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `${new Date().toISOString()}-QPay auth response: ${errorMessage}`
      );
    }

    return response.json();
  }

  private async httpRequestQPay<T>(
    api: API,
    urlExt: string,
    body?: object
  ): Promise<T> {
    let authObj: QPayLoginResponse | undefined;

    authObj = await this.authQPayV2();
    this.loginObject = authObj;

    const requestBody = body ? JSON.stringify(body) : "";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.loginObject.accessToken}`,
    };

    const requestOptions: RequestInit = {
      method: api.method,
      headers,
      body: requestBody,
    };

    const response = await fetch(
      `${this.endpoint}${api.url}${urlExt}`,
      requestOptions
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    return response.json();
  }

  private async refreshToken(): Promise<QPayLoginResponse> {
    const url = `${this.endpoint}/${QPayAuthRefresh.url}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.loginObject?.refreshToken}`,
    };

    const requestOptions: RequestInit = {
      method: QPayAuthRefresh.method,
      headers,
    };

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `${new Date().toISOString()}-QPay token refresh response: ${errorMessage}`
      );
    }

    return response.json();
  }
}

export * from './types';
export * from './client';
export * from './apis';
