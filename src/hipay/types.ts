export interface HipayConfig {
  endpoint: string;
  token: string;
  entityId: string;
}

export interface CheckoutItem {
  itemNo: string;
  names: string;
  price: number;
  quantity: number;
  brand: string;
  measure: string;
  vat: number;
  citytax: number;
}

export interface HipayCheckoutRequest {
  entityId: string;
  amount: number;
  currency: string;
  qrData: boolean;
  signal: boolean;
  ipaddress?: string;
  items?: CheckoutItem[];
}

export interface Signal {
  subscribeKey: string;
  channel: string;
  uuid: string;
}

export interface Details {
  field: string;
  issue: string;
}

export interface HipayCheckoutResponse {
  code: number;
  description: string;
  requestId: string;
  checkoutId: string;
  expires: string;
  signal?: Signal;
  qrData: string;
  details?: Details[];
}

export interface HipayCheckoutGetResponse {
  code: number;
  description: string;
  amount?: number;
  currency?: string;
  discount_amount?: number;
  status?: string;
  status_date?: string;
  paymentId?: string;
  details?: Details[];
}

export interface HipayPaymentGetResponse {
  code: number;
  description: string;
  id?: string;
  amount?: string;
  currency?: string;
  entityId?: string;
  checkoutId?: string;
  paymentId?: string;
  paymentType?: string;
  paymentBrand?: string;
  paymentDate?: string;
  paymentDesc?: string;
  result_desc?: string;
  result_code?: string;
  details?: Details[];
}

export interface HipayPaymentCorrectionRequest {
  entityId: string;
  paymentId: string;
}

export interface HipayPaymentCorrectionResponse {
  code: number;
  description: string;
  paymentId?: string;
  correction_paymentId?: string;
  details?: Details[];
}

export interface HipayStatementRequest {
  entityId: string;
  date: string; // Format: "2023-02-09"
}

export interface List {
  paymentDate: string;
  checkoutId: string;
  paymentId: string;
  amount: number;
  currency: string;
  feeAmount: number;
  feePrc: number;
  paymentDesc: string;
  returnAmount: number;
}

export interface Data {
  list: List[];
  entityId: string;
  date: string;
  page: number;
  perPage: number;
  totalCount: number;
  totalPage: number;
}

export interface HipayStatementResponse {
  code: number;
  description: string;
  details?: Details[];
  data?: Data;
} 