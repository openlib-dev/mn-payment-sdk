export interface QpayAuthConfig {
  endpoint: string;
  password: string;
  username: string;
  callback: string;
  invoiceCode: string;
  merchantId: string;
}

export interface QpayLoginResponse {
  tokenType: string;
  refreshToken: string;
  refreshExpiresIn: number;
  accessToken: string;
  expiresIn: number;
  scope: string;
  notBeforePolicy: string;
  sessionState: string;
}

export interface QpayCreateInvoiceInput {
  senderCode: string;
  senderBranchCode: string;
  receiverCode: string;
  description: string;
  amount: number;
  callbackParam: Record<string, string>;
}

export interface QpaySimpleInvoiceRequest {
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

export interface QpaySimpleInvoiceResponse {
  invoiceId: string;
  qpayShortUrl: string;
  qrText: string;
  qrImage: string;
  urls: Deeplink[];
}

export interface QpayLine {
  discounts: any[];
  lineDescription: string;
  lineQuantity: string;
  lineUnitPrice: string;
  note: string;
  surcharges: any[];
  taxProductCode: any;
  taxes: any[];
}

export interface QpayTransaction {
  // Add transaction fields as needed
}

export interface QpayInput {
  // Add input fields as needed
}

export interface QpayInvoiceGetResponse {
  allowExceed: boolean;
  allowPartial: boolean;
  callbackUrl: string;
  discountAmount: number;
  enableExpiry: boolean;
  expiryDate: string;
  grossAmount: number;
  inputs: QpayInput[];
  invoiceDescription: string;
  invoiceDueDate: any;
  invoiceId: string;
  invoiceStatus: string;
  lines: QpayLine[];
  maximumAmount: number;
  minimumAmount: number;
  note: string;
  senderBranchCode: string;
  senderBranchData: string;
  senderInvoiceNo: string;
  surchargeAmount: number;
  taxAmount: number;
  totalAmount: number;
  transactions: QpayTransaction[];
}

export interface QpayOffset {
  pageNumber: number;
  pageLimit: number;
}

export interface QpayPaymentCheckRequest {
  objectId: string;
  objectType: string;
  offset: QpayOffset;
}

export interface QpayRow {
  paymentId: string;
  paymentStatus: string;
  paymentDate: any;
  paymentFee: string;
  paymentAmount: string;
  paymentCurrency: string;
  paymentWallet: string;
  transactionType: string;
}

export interface QpayPaymentCheckResponse {
  count: number;
  paidAmount: number;
  rows: QpayRow[];
}

export interface QpayPaymentCancelRequest {
  callbackUrl: string;
  note: string;
}

export interface QpayPaymentListRequest {
  merchantId: string;
  merchantBranchCode: string;
  merchantTerminalCode: string;
  merchantStaffCode: string;
  offset: QpayOffset;
} 