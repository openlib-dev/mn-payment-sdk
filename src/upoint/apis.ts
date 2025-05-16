export const UpointCheckUserInfo = {
  url: '/transaction/thirdparty/check_info/',
  method: 'POST'
} as const;

export const UpointProcessTransaction = {
  url: '/transaction/thirdparty/process_transaction/',
  method: 'POST'
} as const;

export const UpointReturnTransaction = {
  url: '/transaction/thirdparty/return_transaction/',
  method: 'POST'
} as const;

export const UpointCheckTransaction = {
  url: '/transaction/thirdparty/check_transaction/',
  method: 'POST'
} as const;

export const UpointCancelTransaction = {
  url: '/transaction/thirdparty/cancel_transaction/',
  method: 'POST'
} as const;

export const UpointProduct = {
  url: '/product/product/',
  method: 'GET'
} as const;

export const UpointQr = {
  url: '/transaction/thirdparty/get_qr/',
  method: 'POST'
} as const;

export const UpointCheckQr = {
  url: '/transaction/thirdparty/check_qr/',
  method: 'POST'
} as const;

export const UpointCheckQrInfo = {
  url: '/transaction/thirdparty/check_info_qr/',
  method: 'POST'
} as const;

export const UpointTransactionQr = {
  url: '/transaction/thirdparty/process_transaction_qr/',
  method: 'POST'
} as const; 