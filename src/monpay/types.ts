export interface MonpayConfig {
  endpoint: string;
  username: string;
  accountId: string;
  callbackUrl: string;
  clientId: string;
  clientSecret: string;
}

export interface MonpayQrInput {
  amount: number;
  branchId: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  title: string;
  subTitle?: string;
  noat?: string;
  nhat?: string;
  ttd?: string;
  referenceNumber?: string;
  expireTime?: number;
}

export interface MonpayQrRequest {
  amount: number;
  branchId: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  title: string;
  subTitle?: string;
  noat?: string;
  nhat?: string;
  ttd?: string;
  referenceNumber?: string;
  expireTime?: number;
}

export interface MonpayResultQr {
  qrcode: string;
  uuid: string;
}

export interface MonpayQrResponse {
  code: number;
  info: string;
  result: MonpayResultQr;
}

export interface MonpayResultCheck {
  uuid: string;
  usedAt: number;
  usedById: number;
  transactionId: string;
  amount: number;
  createdAt: number;
  userPhone: string;
  userAccountNo: string;
  userVatId: string;
  usedAtUI: string;
  createdAtUI: string;
  amountUI: string;
}

export interface MonpayCheckResponse {
  code: number;
  info: string;
  result: MonpayResultCheck;
}

export interface MonpayCallback {
  amount: number;
  uuid: string;
  status: string;
  tnxId: string;
}

export interface MonpayAccessToken {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  scope: string;
}

export enum InvoiceType {
  P2P = 'P2P', // User to User
  P2B = 'P2B', // User to Merchant
  B2B = 'B2B', // Person to MF & MF to organization
  PURCHASE = 'PURCHASE' // Purchase type
}

export enum Bank {
  KHAN = 'KHAN',
  GOLOMT = 'GOLOMT',
  STATE = 'STATE',
  ULAANBAATAR = 'ULAANBAATAR',
  XAC = 'XAC',
  CAPITRON = 'CAPITRON',
  ARIG = 'ARIG',
  CHINGGIS = 'CHINGGIS',
  BOGD = 'BOGD',
  CREDIT = 'CREDIT',
  HUGJIL = 'HUGJIL',
  TURIIN_SAN = 'TURIIN_SAN',
  KHANBANK = 'KHANBANK'
}

export interface DeeplinkConfig {
  endpoint: string;
  clientId: string;
  clientSecret: string;
  grantType: string;
}

export interface DeeplinkCreateRequest {
  redirectUri: string;      // Webhook URL for transaction result
  amount: number;           // Amount
  clientServiceUrl: string; // Webhook URL to call from backend after successful transaction
  receiver: string;         // Receiver information based on invoice type
  invoiceType: InvoiceType; // Type of invoice
  description: string;      // Description
}

export interface DeeplinkCreateResult {
  id: number;              // Unique invoice ID
  receiver: string;        // Receiver information based on invoice type
  amount: number;          // Amount
  userId: number;          // Payer user ID
  miniAppId: number;       // Mini app ID
  createDate: Date;        // Invoice creation date
  updateDate: Date;        // Invoice update date
  status: string;          // Invoice status
  description: string;     // Invoice description
  redirectUri: string;     // Return URL for web browser
  invoiceType: InvoiceType; // Type of invoice
}

export interface DeeplinkCreateResponse {
  code: string;            // Status description code
  intCode: number;         // Status code
  info: string;            // Status information
  result: DeeplinkCreateResult;
}

export interface DeeplinkCheckResult extends DeeplinkCreateResult {
  statusInfo: string;      // Printable information
  bankName?: Bank;         // Bank name (Only B2B connections)
  bankAccount?: string;    // Bank account number (Only B2B connections)
  bankAccountName?: string; // Account holder name (Only B2B connections)
}

export interface DeeplinkCheckResponse {
  code: string;            // Status description code
  intCode: number;         // Status code
  info: string;            // Status information
  result: DeeplinkCheckResult;
}

export interface DeeplinkCallback {
  amount: number;          // Requested amount
  invoiceId: string;       // Paid invoice ID
  status: string;          // PAID, FAILED
  tnxId: string;           // Transaction ID if successful
  info: string;            // Human-readable transaction result
} 