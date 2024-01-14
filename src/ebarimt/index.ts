import { API } from "../types";
import { EbarimtBillType } from "./constants";
import {
  EbarimtCheckAPI,
  EbarimtPut,
  EbarimtReturnBill,
  EbarimtSendData,
} from "./apis";
import {
  Stock,
  StockInput,
  CreateEbarimtInput,
  CreateEbarimtRequest,
  CreateEbarimtResponse,
  ReturnBillResponse,
  CheckResponse,
} from "./types";

export class Ebarimt {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  private stockInputToStock(input: StockInput[]): {
    stocks: Stock[];
    amount: number;
    vat: number;
    cityTax: number;
  } {
    let amount = 0;
    let vat = 0;
    let cityTax = 0;
    const stocks: Stock[] = [];

    for (const v of input) {
      amount += v.unitPrice * v.qty;
      vat += v.vat;
      cityTax += v.cityTax;

      stocks.push({
        code: v.code,
        name: v.name,
        qty: f2s(v.qty),
        measureUnit: v.measureUnit,
        unitPrice: f2s(v.unitPrice),
        cityTax: f2s(v.cityTax),
        vat: f2s(v.vat),
        barCode: v.barCode,
        totalAmount: f2s(v.unitPrice * v.qty),
      });
    }

    return { stocks, amount, vat, cityTax };
  }

  private createInputToRequestBody(
    input: CreateEbarimtInput
  ): CreateEbarimtRequest {
    if (!input.districtCode) {
      input.districtCode = "34";
    }
    if (!input.branchNo) {
      input.branchNo = "001";
    }

    const { stocks, amount, vat, cityTax } = this.stockInputToStock(
      input.stocks
    );

    return {
      amount: f2s(amount),
      vat: f2s(vat),
      cashAmount: f2s(0),
      nonCashAmount: f2s(amount),
      cityTax: f2s(cityTax),
      customerNo: input.customerNo,
      billType: input.billType,
      branchNo: input.branchNo,
      districtCode: input.districtCode,
      stocks,
    };
  }

  async getNewEBarimt(
    bodyRaw: CreateEbarimtInput
  ): Promise<CreateEbarimtResponse> {
    const body = this.createInputToRequestBody(bodyRaw);

    if (bodyRaw.billType === EbarimtBillType.Organization && !body.customerNo) {
      throw new Error("CustomerNo is required");
    }
    const data: CreateEbarimtResponse = await httpRequestEbarimt(
      EbarimtPut,
      body
    );

    return data;
  }

  async sendData(): Promise<void> {
    await httpRequestEbarimt(EbarimtSendData);
  }

  async returnBill(billId: string, date: string): Promise<boolean> {
    const data: ReturnBillResponse = await httpRequestEbarimt(
      EbarimtReturnBill,
      { returnBillId: billId, date }
    );

    return data.success;
  }

  async checkApi(): Promise<CheckResponse> {
    const data: CheckResponse = await httpRequestEbarimt(EbarimtCheckAPI);
    return data;
  }
}

export async function httpRequestEbarimt<T>(
  api: API,
  body?: object
): Promise<T> {
  const response = await fetch(api.url, {
    method: api.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}

export const f2s = (f: number): string => {
  return f.toFixed(2);
};
