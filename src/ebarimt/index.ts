import { f2s, fetchWithJson } from "../../utils";
import { EbarimtBillType } from "./constants";
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
    const data: CreateEbarimtResponse = await fetchWithJson(
      `${this.endpoint}/put`,
      "POST",
      body
    );

    return data;
  }

  async sendData(): Promise<void> {
    await fetchWithJson(`${this.endpoint}/sendData`, "GET");
  }

  async returnBill(billId: string, date: string): Promise<boolean> {
    const data: ReturnBillResponse = await fetchWithJson(
      `${this.endpoint}/returnBill`,
      "POST",
      { returnBillId: billId, date }
    );

    return data.success;
  }

  async checkApi(): Promise<CheckResponse> {
		const data: CheckResponse = await fetchWithJson(`${this.endpoint}/checkApi`, 'GET')
    return data;
  }
}
