export interface QPayConfig {
  username: string;
  password: string;
  endpoint: string;
  callback: string;
  invoiceCode: string;
  merchantId: string;
}

export interface QPayLoginResponse {
  tokenType: string;
  refreshToken: string;
  refreshExpiresIn: number;
  accessToken: string;
  expiresIn: number;
  scope: string;
  notBeforePolicy: string;
  sessionState: string;
}

export interface QPayCreateInvoiceInput {
  senderCode: string;
  senderBranchCode: string;
  receiverCode: string;
  description: string;
  amount: number;
  callbackParam: Record<string, string>;
}

export interface QPaySimpleInvoiceRequest {
  invoiceCode: string;
  senderInvoiceCode: string;
  senderBranchCode: string;
  invoiceReceiverCode: string;
  invoiceDescription: string;
  amount: number;
  callbackUrl: string;
}

export interface Deeplink {
  name: string;
  description: string;
  logo: string;
  link: string;
}

export interface QPaySimpleInvoiceResponse {
  invoiceId: string;
  qrData: string;
  qrImage: string;
  urls: {
    web: string;
    deeplink: string;
  };
}

export interface QPayInvoiceGetResponse {
  invoiceId: string;
  status: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface QPayInput {}

export interface QPayTransaction {}

export interface QPayLine {
  discounts: any[];
  lineDescription: string;
  lineQuantity: string;
  lineUnitPrice: string;
  note: string;
  surcharges: any[];
  taxProductCode: null;
  taxes: any[];
}

export interface QPayPaymentCheckRequest {
  objectID: string;
  objectType: string;
  offset: {
    pageLimit: number;
    pageNumber: number;
  };
}

export interface QPayPaymentCheckResponse {
  rows: Array<{
    paymentId: string;
    status: string;
    amount: number;
    createdAt: string;
  }>;
  count: number;
}

export interface QPayPaymentCancelRequest {
  callbackUrl: string;
  note: string;
}

export interface QPayPaymentListRequest {
  merchantID: string;
  merchantBranchCode: string;
  merchantTerminalCode: string;
  merchantStaffCode: string;
  offset: {
    pageLimit: number;
    pageNumber: number;
  };
}
