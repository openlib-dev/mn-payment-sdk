export interface TokipayConfig {
  endpoint: string;
  apiKey: string;
  imApiKey: string;
  authorization: string;
  merchantId: string;
  successUrl: string;
  failureUrl: string;
  appSchemaIos: string;
}

export interface TokipayPaymentInput {
  orderId: string;
  amount: number;
  notes: string;
  phoneNo?: string;
  countryCode?: string;
  requestId?: string;
  successUrl?: string;
}

export interface TokipayPaymentQrRequest {
  successUrl: string;
  failureUrl: string;
  orderId: string;
  merchantId: string;
  amount: number;
  notes: string;
  authorization: string;
}

export interface TokipayPaymentRequestResponse {
  requestId: string;
}

export interface TokipayPaymentResponse {
  statusCode: number;
  error: string;
  message: string;
  data: TokipayPaymentRequestResponse;
  type: string;
}

export interface TokipayPaymentStatusDataResponse {
  status: string;
}

export interface TokipayPaymentStatusResponse {
  statusCode: number;
  error: string;
  message: string;
  data: TokipayPaymentStatusDataResponse;
  type: string;
}

export interface TokipayPaymentResponseExt {
  statusCode: number;
  error: string;
  message: string;
  responseType: string;
}

export interface TokipayPaymentSentUserRequest {
  successUrl: string;
  failureUrl: string;
  orderId: string;
  merchantId: string;
  amount: number;
  notes: string;
  authorization: string;
  phoneNo: string;
  countryCode: string;
}

export interface TokipayPaymentScanUserRequest {
  successUrl: string;
  failureUrl: string;
  orderId: string;
  merchantId: string;
  amount: number;
  notes: string;
  authorization: string;
  requestId: string;
}

export interface TokipayRefundRequest {
  requestId: string;
  refundAmount: number;
  merchantId: string;
}

export interface TokipayRefundInput {
  requestId: string;
  refundAmount: number;
}

export interface TokipayDeeplinkRequest {
  successUrl: string;
  failureUrl: string;
  orderId: string;
  merchantId: string;
  amount: number;
  notes: string;
  appSchemaIos: string;
  authorization: string;
  tokiWebSuccessUrl: string;
  tokiWebFailureUrl: string;
}

export interface TokipayDeeplinkDataResponse {
  deeplink: string;
}

export interface TokipayDeeplinkResponse {
  statusCode: number;
  error: string;
  message: string;
  data: TokipayDeeplinkDataResponse;
  type: string;
}

export interface TokipayThirdPartyPhoneRequest {
  successUrl: string;
  failureUrl: string;
  orderId: string;
  merchantId: string;
  amount: number;
  notes: string;
  phoneNo: string;
  countryCode: string;
  authorization: string;
  tokiWebSuccessUrl: string;
  tokiWebFailureUrl: string;
}

export interface TokipayThirdPartyPhoneResponse {
  statusCode: number;
  error: string;
  message: string;
  data: any;
  type: string;
} 