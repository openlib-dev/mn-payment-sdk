export const QPayAuthToken = {
  url: '/auth/token',
  method: 'POST'
} as const;

export const QPayAuthRefresh = {
  url: '/auth/refresh',
  method: 'POST'
} as const;

export const QPayCreateCompany = {
  url: '/merchant/company',
  method: 'POST'
} as const;

export const QPayCreatePerson = {
  url: '/merchant/person',
  method: 'POST'
} as const;

export const QPayGetMerchant = {
  url: '/merchant/',
  method: 'GET'
} as const;

export const QPayMerchantList = {
  url: '/merchant/list',
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

export const QPayPaymentCheck = {
  url: '/payment/check',
  method: 'POST'
} as const; 