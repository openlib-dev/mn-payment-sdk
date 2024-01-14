import { fetchWithJson } from "../../utils";
import {
  Stock,
  StockInput,
  CreateEbarimtInput,
  CreateEbarimtRequest,
  CreateEbarimtResponse,
  ReturnBillResponse,
  CheckResponse,
} from "./types";

export function float64ToString(f: number): string {
  return f.toFixed(2);
}

export function stockInputToStock(input: StockInput[]): {
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
      qty: float64ToString(v.qty),
      measureUnit: v.measureUnit,
      unitPrice: float64ToString(v.unitPrice),
      cityTax: float64ToString(v.cityTax),
      vat: float64ToString(v.vat),
      barCode: v.barCode,
      totalAmount: float64ToString(v.unitPrice * v.qty),
    });
  }

  return { stocks, amount, vat, cityTax };
}

export function createInputToRequestBody(
  input: CreateEbarimtInput
): CreateEbarimtRequest {
  if (input.districtCode === "") {
    input.districtCode = "34";
  }
  if (input.branchNo === "") {
    input.branchNo = "001";
  }

  const { stocks, amount, vat, cityTax } = stockInputToStock(input.stocks);

  return {
    amount: float64ToString(amount),
    vat: float64ToString(vat),
    cashAmount: float64ToString(0),
    nonCashAmount: float64ToString(amount),
    cityTax: float64ToString(cityTax),
    customerNo: input.customerNo,
    billType: input.billType,
    branchNo: input.branchNo,
    districtCode: input.districtCode,
    stocks: stocks,
  };
}

export async function getNewEBarimt(endpoint: string, bodyraw: CreateEbarimtInput): Promise<CreateEbarimtResponse> {
	const body = createInputToRequestBody(bodyraw);

	if (bodyraw.billType === 'EBarimtOrganizationType' && body.customerNo === '') {
		throw new Error('CustomerNo is required');
	}

	try {
		return await fetchWithJson<CreateEbarimtResponse>(`${endpoint}/put`, 'POST', body);
	} catch (error) {
		throw error;
	}
}

export async function sendData(endpoint: string): Promise<void> {
	try {
		await fetchWithJson<void>(`${endpoint}/sendData`, 'GET');
	} catch (error) {
		throw error;
	}
}

export async function returnBill(endpoint: string, billId: string, date: string): Promise<boolean> {
	try {
		const response = await fetchWithJson<ReturnBillResponse>(`${endpoint}/returnBill`, 'POST', {
			returnBillId: billId,
			date: date,
		});

		return response.success;
	} catch (error) {
		throw error;
	}
}

export async function checkApi(endpoint: string): Promise<CheckResponse> {
	try {
		return await fetchWithJson<CheckResponse>(`${endpoint}/checkApi`, 'GET');
	} catch (error) {
		throw error;
	}
}
