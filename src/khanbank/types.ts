export interface KhanConfig {
  endpoint: string;
  username: string;
  password: string;
  language: string;
}

export interface OrderRegisterInput {
  orderNumber: string;
  amount: number;
  successCallback: string;
  failCallback: string;
}

export interface OrderRequest {
  orderNumber: string;
  amount: string;
  returnUrl: string;
  failUrl: string;
  jsonParams: {
    orderNumber: string;
  };
  userName: string;
  Password: string;
  language: string;
}

export interface RegisterOrderResponse {
  ErrorCode?: string;
  ErrorMessage?: string;
  orderId?: string;
  redirectUrl?: string;
}

export interface OrderStatusRequest {
  userName: string;
  Password: string;
  language: string;
  orderId: string;
}

export interface OrderStatusResponse {
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
  orderNumber?: string;
  ip?: string;
} 