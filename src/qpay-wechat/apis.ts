export const QPayAuthToken = {
  url: '/auth/token',
  method: 'POST'
} as const;

export const QPayAuthRefresh = {
  url: '/auth/refresh',
  method: 'POST'
} as const;

export const QPayPaymentGet = {
  url: '/payment/get/',
  method: 'GET'
} as const;

export const QPayPaymentCheck = {
  url: '/payment/check',
  method: 'POST'
} as const;

export const QPayPaymentCancel = {
  url: '/payment/cancel',
  method: 'DELETE'
} as const;

export const QPayPaymentRefund = {
  url: '/payment/refund/',
  method: 'DELETE'
} as const;

export const QPayPaymentList = {
  url: '/payment/url',
  method: 'POST'
} as const;

export const QPayInvoiceCreate = {
  url: '/invoice',
  method: 'POST'
} as const;

export const QPayInvoiceGet = {
  url: '/invoice/',
  method: 'GET'
} as const;

export const QPayInvoiceCancel = {
  url: '/invoice/',
  method: 'DELETE'
} as const; 