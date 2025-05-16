export interface TdbCgConfig {
  endpoint: string;
  loginId: string;
  clientSecret: string;
  password: string;
  certPass: string;
  certPathPfx: string;
  certPathCer: string;
  anyBic: string;
  roleId: string;
}

export interface TdbCgAuthTokenRequest {
  grantType: string;
  clientId: string;
  clientSecret: string;
}

export interface TdbCgAuthTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
}

export interface TdbCgAuthRefreshRequest {
  refreshToken: string;
}

export interface TdbCgPaymentGetRequest {
  paymentId: string;
}

export interface TdbCgPaymentGetResponse {
  paymentId: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface TdbCgPaymentCheckRequest {
  paymentId: string;
}

export interface TdbCgPaymentCheckResponse {
  paymentId: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface TdbCgInvoiceCreateRequest {
  amount: number;
  currency: string;
  description: string;
  callbackUrl: string;
  successUrl: string;
  failureUrl: string;
}

export interface TdbCgInvoiceCreateResponse {
  invoiceId: string;
  qrData: string;
  urls: {
    callback: string;
    success: string;
    failure: string;
  };
  amount: number;
  currency: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface TdbCgInvoiceGetRequest {
  invoiceId: string;
}

export interface TdbCgInvoiceGetResponse {
  invoiceId: string;
  qrData: string;
  urls: {
    callback: string;
    success: string;
    failure: string;
  };
  amount: number;
  currency: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
} 