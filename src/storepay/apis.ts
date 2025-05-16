export const StorepayAuth = {
  url: '/oauth/token',
  method: 'POST'
} as const;

export const StorepayLoan = {
  url: '/merchant/loan',
  method: 'POST'
} as const;

export const StorepayLoanCheck = {
  url: '/merchant/loan/check/',
  method: 'GET'
} as const;

export const StorepayUserPossibleAmount = {
  url: '/user/possibleAmount',
  method: 'POST'
} as const; 