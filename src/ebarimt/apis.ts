import { API } from "../types";

export const EbarimtSendData = {
  url: "/sendData",
  method: "GET"
} as const;

export const EbarimtPut = {
  url: "/put",
  method: "POST"
} as const;

export const EbarimtReturnBill = {
  url: "/returnBill",
  method: "POST"
} as const;

export const EbarimtCheckApi = {
  url: "/checkApi",
  method: "GET"
} as const;
