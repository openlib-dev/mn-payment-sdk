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

export interface QpayCompanyCreateRequest {
  ownerRegNo: string;
  ownerFirstName: string;
  ownerLastName: string;
  locationLat: string;
  locationLng: string;
  registerNo: string;
  name: string;
  mccCode: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  email: string;
}

export interface QpayCompanyCreateResponse {
  id: string;
  vendorId: string;
  type: string;
  registerNo: string;
  name: string;
  ownerRegNo: string;
  ownerFirstName: string;
  ownerLastName: string;
  mccCode: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  email: string;
  locationLat: string;
  locationLng: string;
}

export interface QpayPersonCreateRequest {
  registerNo: string;
  firstName: string;
  lastName: string;
  mccCode: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  email: string;
}

export interface QpayPersonCreateResponse {
  id: string;
  vendorId: string;
  type: string;
  registerNo: string;
  firstName: string;
  lastName: string;
  mccCode: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  email: string;
}

export interface QpayMerchantListRequest {
  offset: QpayOffset;
}

export interface QpayMerchantListResponse {
  count: number;
  items: QpayMerchantGetResponse[];
}

export interface QpayMerchantGetResponse {
  createDate: string;
  id: string;
  type: string;
  registerNo: string;
  name: string;
  firstName: string;
  lastName: string;
  mccCode: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  email: string;
}

export interface QpayInvoiceRequest {
  merchantId: string;
  branchCode: string;
  amount: number;
  currency: string;
  customerName: string;
  customerLogo: string;
  callbackUrl: string;
  description: string;
  mccCode: string;
  bankAccounts: QpayBankAccountRequest[];
}

export interface QpayInvoiceResponse {
  id: string;
  terminalId: string;
  amount: string;
  qrCode: string;
  description: string;
  invoiceStatus: string;
  invoiceStatusDate: string;
  callbackUrl: string;
  customerName: string;
  customerLogo: string;
  currency: string;
  mccCode: string;
  legacyId: string;
  vendorId: string;
  processCodeId: string;
  qrImage: string;
  invoiceBankAccounts: QpayBankAccountResponse[];
  urls: QpayUrls[];
}

export interface QpayUrls {
  name: string;
  description: string;
  logo: string;
  link: string;
}

export interface QpayBankAccountRequest {
  accountBankCode: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

export interface QpayInvoiceGetResponse {
  id: string;
  terminalId: string;
  amount: string;
  qrCode: string;
  description: string;
  invoiceStatus: string;
  invoiceStatusDate: string;
  callbackUrl: string;
  customerName: string;
  customerLogo: string;
  currency: string;
  mccCode: string;
  legacyId: string;
  vendorId: string;
  processCodeId: string;
  qrImage: string;
  invoiceBankAccounts: QpayBankAccountResponse[];
}

export interface QpayBankAccountResponse {
  id: string;
  accountBankCode: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
  invoiceId: string;
}

export interface QpayPaymentCheckRequest {
  invoiceId: string;
}

export interface QpayPaymentCheckResponse {
  id: string;
  invoiceStatus: string;
  invoiceStatusDate: string;
  payments: QpayPayment[];
}

export interface QpayPayment {
  id: string;
  terminalId: string;
  walletCustomerId: string;
  amount: string;
  currency: string;
  paymentName: string;
  paymentDescription: string;
  paidBy: string;
  note: string;
  paymentStatus: string;
  paymentStatusDate: string;
  transactions: QpayTransactions[];
}

export interface QpayTransactions {
  id: string;
  description: string;
  transactionBankCode: string;
  accountBankCode: string;
  accountBankName: string;
  accountNumber: string;
  status: string;
  amount: string;
  currency: string;
}

export interface QpayOffset {
  pageNumber: number;
  pageLimit: number;
}

export interface QpayQuickConfig {
  endpoint: string;
  username: string;
  password: string;
  terminalId: string;
} 