export const MonpayGenerateQr = {
  url: '/rest/branch/qrpurchase/generate',
  method: 'POST'
} as const;

export const MonpayCheckQr = {
  url: '/rest/branch/qrpurchase/check',
  method: 'GET'
} as const;

export const MonpayDeeplinkCreate = {
  url: '/api/oauth/invoice',
  method: 'POST'
} as const;

export const MonpayDeeplinkCheck = {
  url: '/api/oauth/invoice/',
  method: 'GET'
} as const;

export const MonpayDeeplinkAuth = {
  url: '/oauth/token',
  method: 'POST'
} as const; 