export const TokipayPaymentQr = {
  url: '/jump/v4/spose/payment/request',
  method: 'POST'
} as const;

export const TokipayPaymentSentUser = {
  url: '/jump/v4/spose/payment/user-request',
  method: 'POST'
} as const;

export const TokipayPaymentScanUser = {
  url: '/jump/v4/spose/payment/scan/user-request',
  method: 'POST'
} as const;

export const TokipayPaymentStatus = {
  url: '/jump/v4/spose/payment/status',
  method: 'GET'
} as const;

export const TokipayPaymentCancel = {
  url: '/jump/v4/spose/payment/request',
  method: 'DELETE'
} as const;

export const TokipayRefund = {
  url: '/jump/v4/spose/payment/refund',
  method: 'PUT'
} as const;

export const TokipayDeeplink = {
  url: '/jump/v1/third-party/payment/deeplink',
  method: 'POST'
} as const;

export const TokipayPhoneRequest = {
  url: '/jump/v1/third-party/payment/request',
  method: 'POST'
} as const;

export const TokipayTransactionStatus = {
  url: '/jump/v1/third-party/payment/status',
  method: 'GET'
} as const; 