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
  invoiceID: string;
  qpayShortUrl: string;
  qrText: string;
  qrImage: string;
  urls: Deeplink[];
}

export interface QPayInvoiceGetResponse {
  allowExceed: boolean;
  allowPartial: boolean;
  callbackUrl: string;
  discountAmount: number;
  enableExpiry: boolean;
  expiryDate: string;
  grossAmount: number;
  inputs: QPayInput[];
  invoiceDescription: string;
  invoiceDueDate: null;
  invoiceID: string;
  invoiceStatus: string;
  lines: QPayLine[];
  maximumAmount: number;
  minimumAmount: number;
  note: string;
  senderBranchCode: string;
  senderBranchData: string;
  senderInvoiceNo: string;
  surchargeAmount: number;
  taxAmount: number;
  totalAmount: number;
  transactions: QPayTransaction[];
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
  offset: QPayOffset;
}

export interface QPayOffset {
  pageNumber: number;
  pageLimit: number;
}

export interface QPayPaymentCheckResponse {
  count: number;
  paidAmount: number;
  rows: QPayRow[];
}

export interface QPayRow {
  paymentID: string;
  paymentStatus: string;
  paymentDate: null;
  paymentFee: string;
  paymentAmount: string;
  paymentCurrency: string;
  paymentWallet: string;
  transactionType: string;
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
  offset: QPayOffset;
}
