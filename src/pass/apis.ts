export const PassCreateOrder = {
  url: '/create_order',
  method: 'POST'
} as const;

export const PassInqueryOrder = {
  url: '/order_inquiry',
  method: 'POST'
} as const;

export const PassNotifyOrder = {
  url: '/order_notify',
  method: 'POST'
} as const;

export const PassCancelOrder = {
  url: '/cancel_order',
  method: 'POST'
} as const;

export const PassVoidOrder = {
  url: '/void',
  method: 'POST'
} as const; 