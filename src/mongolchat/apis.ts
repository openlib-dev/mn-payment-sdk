export const MchatAuth = {
  url: '/application/auth',
  method: 'GET'
} as const;

export const MchatOnlineQrGenerate = {
  url: '/worker/onlineqr/generate',
  method: 'POST'
} as const;

export const MchatOnlineQrcheck = {
  url: '/worker/onlineqr/status',
  method: 'POST'
} as const;

export const MchatTransactionSettlement = {
  url: '/worker/settle/upload',
  method: 'POST'
} as const; 