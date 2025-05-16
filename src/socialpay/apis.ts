export const SocialPayInvoicePhone = {
  url: '/pos/invoice/phone',
  method: 'POST'
} as const;

export const SocialPayInvoiceQr = {
  url: '/pos/invoice/qr',
  method: 'POST'
} as const;

export const SocialPayInvoiceCancel = {
  url: '/pos/invoice/cancel',
  method: 'POST'
} as const;

export const SocialPayInvoiceCheck = {
  url: '/pos/invoice/check',
  method: 'POST'
} as const;

export const SocialPayPaymentCancel = {
  url: '/pos/payment/cancel',
  method: 'POST'
} as const;

export const SocialPayPaymentSettlement = {
  url: '/pos/settlement',
  method: 'POST'
} as const; 