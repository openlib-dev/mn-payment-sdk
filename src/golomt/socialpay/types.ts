export interface SocialPayInvoicePhoneRequest {
  phone: string;
  amount: string;
  invoice: string;
  terminal: string;
  checksum: string;
}

export interface SocialPayInvoiceSimpleRequest {
  amount: string;
  invoice: string;
  terminal: string;
  checksum: string;
}

export interface SocialPaySettlementRequest {
  settlementId: string;
  checksum: string;
  terminal: string;
}

export interface SocialPaySimpleResponse {
  desc: string;
  status: string;
}

export interface SocialPayTransactionResponse {
  approval_code: string;
  amount: number;
  card_number: string;
  resp_desc: string;
  resp_code: string;
  terminal: string;
  invoice: string;
  checksum: string;
}

export interface SocialPayPaymentSettlementResponse {
  amount: number;
  count: number;
  status: string;
}

export interface SocialPayErrorResponse {
  errorDesc: string;
  errorType: string;
}

export interface Header {
  status: string;
  code: number;
}

export interface Body {
  response: Record<string, unknown>;
  error: Record<string, unknown>;
}

export interface Response {
  header: Header;
  body: Body;
}
