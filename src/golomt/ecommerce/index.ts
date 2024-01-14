import { utils } from "../../../utils/key";
import { API } from "../../types";
import { ECommerceInvoiceCreate, ECommercePayByToken } from "./apis";
import { Lang, PaymentMethod } from "./constants";
import {
  ByTokenResponse,
  CreateInvoiceInput,
  CreateInvoiceResponse,
  InquiryResponse,
} from "./types";

export class Golomt {
  private endpoint: string;
  private secret: string;
  private bearerToken: string;

  constructor(endpoint: string, secret: string, token: string) {
    this.endpoint = endpoint;
    this.secret = secret;
    this.bearerToken = token;
  }

  private boolToString(v: boolean): string {
    return v ? "Y" : "N";
  }

  public getUrlByInvoiceId(
    invoice: string,
    lang: Lang,
    paymentMethod: PaymentMethod
  ): string {
    return `${this.endpoint}/${paymentMethod}/${lang}/${invoice}`;
  }

  private async httpRequestGolomtEcommerce<T>(
    body: T,
    api: API,
    endpoint: string
  ): Promise<any> {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.bearerToken}`,
    };

    const requestOptions: RequestInit = {
      method: api.method,
      headers: new Headers(headers),
      body: JSON.stringify(body),
    };

    try {
      const response = await fetch(`${endpoint}${api.url}`, requestOptions);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      return response.json();
    } catch (error: any) {
      throw new Error(error.message || "Error processing the request.");
    }
  }

  public async payByToken(
    amount: number,
    token: string,
    transactionId: string,
    lang: string
  ): Promise<ByTokenResponse> {
    const checksum = utils.generateHMAC(
      this.secret,
      `${amount}${transactionId}${token}`
    );
    const request = {
      amount: amount.toString(),
      checksum: checksum,
      token: token,
      transactionId: transactionId,
      lang: lang,
    };

    const response = await this.httpRequestGolomtEcommerce(
      request,
      ECommercePayByToken,
      this.endpoint
    );

    const responseData: ByTokenResponse = response.data;

    if (responseData.errorCode !== "000") {
      throw new Error(responseData.errorDesc);
    }

    return responseData;
  }

  public async createInvoice(
    input: CreateInvoiceInput
  ): Promise<CreateInvoiceResponse> {
    const amount = input.amount.toFixed(2);
    const checksum = utils.generateHMAC(
      this.secret,
      `${input.transactionId}${amount}${input.returnType}${input.callback}`
    );

    const request = {
      Amount: amount,
      Checksum: checksum,
      GenerateToken: this.boolToString(input.getToken),
      Callback: input.callback,
      TransactionID: input.transactionId,
      ReturnType: input.returnType,
      SocialDeeplink: this.boolToString(input.socialDeeplink),
    };

    const response = await this.httpRequestGolomtEcommerce(
      request,
      ECommerceInvoiceCreate,
      this.endpoint
    );

    const responseData: CreateInvoiceResponse = response.data;

    if (responseData.errorCode !== "000") {
      throw new Error(responseData.errorDesc);
    }

    return responseData;
  }

  public async inquiry(transactionId: string): Promise<InquiryResponse> {
    const checksum = utils.GenerateHMAC(
      this.secret,
      utils.AppendAsString(transactionId, transactionId)
    );
    const request = { Checksum: checksum, TransactionID: transactionId };

    const response = await this.httpRequestGolomtEcommerce(
      request,
      ECommerceInquiry,
      this.endpoint
    );

    const responseData: InquiryResponse = response.data;

    if (responseData.errorCode !== "000") {
      throw new Error(responseData.errorDesc);
    }

    return responseData;
  }
}
