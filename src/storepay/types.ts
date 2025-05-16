export interface StorepayConfig {
  appUsername: string;
  appPassword: string;
  username: string;
  password: string;
  authUrl: string;
  baseUrl: string;
  storeId: string;
  callbackUrl: string;
}

export interface StorepayLoginResponse {
  token_type: string;
  refresh_token: string;
  access_token: string;
  expires_in: number;
  scope: string;
  current_store_id: number;
  user_id: number;
  role_id: RoleStruct;
  jti: string;
}

export interface RoleStruct {
  id: number;
  code: string;
  description: string;
  authority: string;
}

export interface StorepayLoanInput {
  description: string;
  mobileNumber: string;
  amount: number;
}

export interface StorepayLoanRequest {
  storeId: string;
  mobileNumber: string;
  description: string;
  amount: string;
  callbackUrl: string;
}

export interface MsgStruct {
  code: string;
  text: string;
  params: string;
}

export interface StorepayLoanResponse {
  value: number;
  msgList: MsgStruct[];
  attrs: any;
  status: string;
}

export interface StorepayCheckResponse {
  value: boolean;
  msgList: MsgStruct[];
  attrs: any;
  status: string;
}

export interface StorepayUserCheckRequest {
  mobileNumber: string;
}

export interface StorepayUserCheckResponse {
  value: number;
  msgList: MsgStruct[];
  attrs: any;
  status: string;
} 