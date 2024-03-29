import { EbarimtBillType } from "./constants";

export interface CreateEbarimtRequest {
  amount: string;
  vat: string;
  cashAmount: string;
  nonCashAmount: string;
  cityTax: string;
  customerNo: string;
  billType: string;
  branchNo: string;
  districtCode: string;
  stocks: Stock[];
}

export interface CreateEbarimtInput {
  customerNo: string;
  branchNo: string;
  billType: EbarimtBillType;
  districtCode: string;
  stocks: StockInput[];
}

export interface Stock {
  code: string;
  name: string;
  measureUnit: string;
  qty: string;
  unitPrice: string;
  totalAmount: string;
  cityTax: string;
  vat: string;
  barCode: string;
}

export interface StockInput {
  code: string;
  name: string;
  measureUnit: string;
  qty: number;
  unitPrice: number;
  cityTax: number;
  vat: number;
  barCode: string;
}

export interface CreateEbarimtResponse {
  amount: string;
  vat: string;
  cashAmount: string;
  nonCashAmount: string;
  cityTax: string;
  customerNo: string;
  billType: string;
  branchNo: string;
  districtCode: string;
  stocks: Stock[];
  taxType: string;
  registerNo: string;
  billId: string;
  macAddress: string;
  date: string;
  lottery: string;
  internalCode: string;
  qrData: string;
  merchantId: string;
  success: boolean;
  message: string;
  errorCode: number;
}

export interface CheckAPIItem {
  message: string | null;
  success: boolean;
}

export interface CheckResponse {
  config: CheckAPIItem;
  database: CheckAPIItem;
  network: CheckAPIItem;
  success: boolean;
}

export interface ReturnBillResponse {
  success: boolean;
}

