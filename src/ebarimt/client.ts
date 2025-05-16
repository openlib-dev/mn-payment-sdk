import axios from 'axios';
import {
  EbarimtConfig,
  CreateEbarimtInput,
  CreateEbarimtResponse,
  CreateEbarimtRequest,
  Stock,
  StockInput,
  CheckResponse,
  ReturnBillResponse,
} from './types';

export class EbarimtClient {
  private endpoint: string;

  constructor(config: EbarimtConfig) {
    this.endpoint = config.endpoint;
  }

  private float64ToString(f: number): string {
    return f.toFixed(2);
  }

  private stockInputToStock(input: StockInput[]): { stocks: Stock[]; amount: number; vat: number; citytax: number } {
    let amount = 0;
    let vat = 0;
    let citytax = 0;
    const stocks: Stock[] = [];

    for (const v of input) {
      amount += v.unitPrice * v.qty;
      vat += v.vat;
      citytax += v.cityTax;
      stocks.push({
        code: v.code,
        name: v.name,
        qty: this.float64ToString(v.qty),
        measureUnit: v.measureUnit,
        unitPrice: this.float64ToString(v.unitPrice),
        cityTax: this.float64ToString(v.cityTax),
        vat: this.float64ToString(v.vat),
        barCode: v.barCode,
        totalAmount: this.float64ToString(v.unitPrice * v.qty)
      });
    }

    return { stocks, amount, vat, citytax };
  }

  private createInputToRequestBody(input: CreateEbarimtInput): CreateEbarimtRequest {
    const districtCode = input.districtCode || '34';
    const branchNo = input.branchNo || '001';
    const { stocks, amount, vat, citytax } = this.stockInputToStock(input.stocks);

    return {
      amount: this.float64ToString(amount),
      vat: this.float64ToString(vat),
      cashAmount: this.float64ToString(0),
      nonCashAmount: this.float64ToString(amount),
      cityTax: this.float64ToString(citytax),
      customerNo: input.customerNo,
      billType: input.billType,
      branchNo,
      districtCode,
      billIdSuffix: input.billIdSuffix,
      stocks
    };
  }

  async getNewEbarimt(input: CreateEbarimtInput): Promise<CreateEbarimtResponse> {
    const body = this.createInputToRequestBody(input);

    if (input.billType === '3' && !body.customerNo) {
      throw new Error('CustomerNo is required for organization type bills');
    }

    const response = await axios.post<CreateEbarimtResponse>(`${this.endpoint}/put`, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  }

  async sendData(): Promise<void> {
    await axios.get(`${this.endpoint}/sendData`);
  }

  async returnBill(billId: string, date: string): Promise<boolean> {
    const response = await axios.post<ReturnBillResponse>(
      `${this.endpoint}/returnBill`,
      {
        returnBillId: billId,
        date
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.success;
  }

  async checkApi(): Promise<CheckResponse> {
    const response = await axios.get<CheckResponse>(`${this.endpoint}/checkApi`);
    return response.data;
  }
} 