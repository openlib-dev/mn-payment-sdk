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
  url: '/payment/check/',
  method: 'GET'
} as const;

export const QPayInvoiceCreate = {
  url: '/bill/create',
  method: 'POST'
} as const;

export const QPayInvoiceGet = {
  url: '/invoice/',
  method: 'GET'
} as const; 