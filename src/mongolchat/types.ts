export interface MongolchatConfig {
  endpoint: string;
  apiKey: string;
  workerKey: string;
  appSecret: string;
  branchNo: string;
}

export interface MchatProduct {
  productName: string;
  quantity: string;
  price: number;
  tag: string;
}

export interface MchatQrGenerateInput {
  amount: number;
  paymentUUID: string;
  products: MchatProduct[];
}

export interface MchatWebookInput {
  type: string;
  data: any;
}

export interface MchatWebookScanQR {
  referenceNumber: string;
  whoPaid: string;
  userRefId: string;
  transactionId: string;
  generatedQRcode: string;
  amount: number;
  date: string;
  products: MchatProduct[];
}

export interface MchatWebookQuickpay {
  referenceNumber: string;
  whoPaid: string;
  userRefId: string;
  transactionId: string;
  amount: number;
  date: string;
  products: MchatProduct[];
}

export interface MchatWebookOrder {
  referenceNumber: string;
  whoPaid: string;
  userRefId: string;
  transactionId: string;
  orderId: string;
  amount: number;
  date: string;
  products: MchatProduct[];
}

export interface MchatOnlineQrGenerateRequest {
  amount: number;
  branchId?: string;
  products: MchatProduct[];
  title: string;
  subTitle: string;
  noat: string;
  nhat: string;
  ttd: string;
  referenceNumber: string;
  expireTime: string;
}

export interface MchatOnlineQrGenerateResponse {
  qr: string;
  code: number;
  message: string;
}

export interface MchatOnlineQrCheckResponse {
  status: string;
  code: number;
  message: string;
  id?: string;        // if status is paid this field filled with transaction id
  whoPaid?: string;   // if status is paid this field filled with who_paid
  userRefId?: string; // if status is paid this field filled with user_ref_id
} 