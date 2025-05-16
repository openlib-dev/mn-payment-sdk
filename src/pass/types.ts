export interface PassConfig {
  endpoint: string;
  ecommerceToken: string;
  callback: string;
}

export interface BaseError {
  code: string;
  level: string;
  body: string;
}

// Create Order
export interface CreateOrderInput {
  ecommerceToken: string;
  amount: number;
  callbackUrl: string;
}

export interface RetCreateOrder {
  shop: string;
  amount: string;
  orderId: string;
  orderTtl: number;
  dbRefNo: string;
}

export interface CreateOrderResponse {
  statusCode: string;
  ret?: RetCreateOrder;
  msg?: BaseError;
}

// Inquery Order
export interface OrderInqueryInput {
  ecommerceToken: string;
  orderId: string;
}

export interface CustomerData {
  userId: string;
  uniqueId: string;
}

export interface LoyaltyData {
  kbStatus: string;
  kbTxnId: string;
  kbCardId: string;
  kbUsableLp: string;
  kbLoyaltyPk: string;
  hasKbLoyalty: string;
  kbDescription: string;
  kbLimitValue: string;
  kbLoyaltyType: string;
  kbDatesOfWeek: string;
  kbNoTxnAmount: string;
  kbYesTxnAmount: string;
  kbLoyaltyProviderName: string;
}

export interface ExtraData {
  id: string;
  pan: string;
  rrn: string;
  amount: string;
  posId: string;
  orderId: string;
  respMsg: string;
  traceNo: string;
  dateTime: string;
  respCode: string;
  terminalId: string;
  approvedCode: string;
  currencyCode: string;
  paymentRequestId: string;
}

export interface RetInqueryOrder {
  respCode: string;
  respMsg: string;
  status: string;
  amount: string;
  customerData?: CustomerData;
  loyaltyData?: LoyaltyData;
  dbRefNo: string;
  extraData?: ExtraData;
  statusText: string;
}

export interface OrderInqueryResponse {
  statusCode: string;
  ret?: RetInqueryOrder;
  msg?: BaseError;
}

// Notify Order
export interface OrderNotifyInput {
  ecommerceToken: string;
  orderId: string;
  phone: string;
}

export interface Datum {
  success: boolean;
  messageId: string;
}

export interface RetNotifyOrder {
  respCode: string;
  respMsg: string;
  success: number;
  data: Datum[];
}

export interface OrderNotifyResponse {
  statusCode: string;
  ret?: RetNotifyOrder;
  msg?: BaseError;
}

// Cancel Order
export interface OrderCancelInput {
  ecommerceToken: string;
  orderId: string;
}

export interface RetOrderCancel {
  respCode: string;
  respMsg: string;
  status: string;
  amount: string;
  loyaltyData: any;
  dbRefNo: string;
}

export interface OrderCancelResponse {
  statusCode: string;
  ret?: RetOrderCancel;
  msg?: BaseError;
}

// Void Order
export interface OrderVoidInput {
  ecommerceToken: string;
  orderId: string;
}

export interface RetOrderVoid {
  respCode: string;
  respMsg: string;
  status: string;
  amount: string;
  loyaltyData: any;
  dbRefNo: string;
  serviceName: string;
  dateTime: string;
  traceNo: string;
  rrn: string;
  terminalId: string;
  merchantId: string;
}

export interface OrderVoidResponse {
  statusCode: string;
  ret?: RetOrderVoid;
  msg?: BaseError;
}

// Webhook
export interface WebhookCallbackResponse {
  orderId: string;
  paymentRequestId: string;
  posId: string;
  operation: string;
  isSuccess: boolean;
  amount: string;
  createdTime: string;
  customerData?: CustomerData;
  extraData?: Record<string, string>;
  dbRefNo: string;
} 