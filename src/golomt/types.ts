export type Lang = 'MN' | 'EN';
export type PaymentMethod = 'payment' | 'socialpay';
export type ReturnType = 'POST' | 'GET' | 'MOBILE';

export interface GolomtConfig {
  endpoint: string;
  secret: string;
  bearerToken: string;
}

export interface CreateInvoiceInput {
  amount: number;
  transactionId: string;
  returnType: ReturnType;
  callback: string;
  getToken: boolean;
  socialDeeplink: boolean;
}

export interface CreateInvoiceResponse {
  invoice: string;
  checksum: string;
  transactionId: string;
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  socialDeeplink: string;
}

export interface CreateInvoiceRequest {
  amount: string;
  checksum: string;
  transactionId: string;
  returnType: string;
  callback: string;
  genToken: string;
  socialDeeplink: string;
}

export interface InquiryResponse {
  amount: string;
  bank: string;
  status: string;
  errorDesc: string;
  errorCode: string;
  cardHolder: string;
  cardNumber: string;
  transactionId: string;
  token: string;
}

export interface InquiryRequest {
  checksum: string;
  transactionId: string;
}

export interface ByTokenRequest {
  amount: string;
  invoice: string;
  checksum: string;
  transactionId: string;
  token: string;
  lang: string;
}

export interface ByTokenResponse {
  amount: string;
  errorDesc: string;
  errorCode: string;
  transactionId: string;
  checksum: string;
  cardNumber: string;
}

export interface GolomtError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
} 