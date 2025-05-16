export const HipayCheckout = {
  url: '/checkout',
  method: 'POST'
} as const;

export const HipayCheckoutGet = {
  url: '/checkout/get/',
  method: 'GET'
} as const;

export const HipayPaymentGet = {
  url: '/payment/get/',
  method: 'GET'
} as const;

export const HipayPaymentCorrection = {
  url: '/pos/correction',
  method: 'POST'
} as const;

export const HipayStatement = {
  url: '/pos/statement',
  method: 'POST'
} as const; 