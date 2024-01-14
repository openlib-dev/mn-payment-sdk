import { API } from "../types";

export const QPayAuthToken: API = {
  url: "/auth/token",
  method: "POST",
};

export const QPayAuthRefresh: API = {
  url: "/auth/refresh",
  method: "POST",
};

export const QPayPaymentGet: API = {
  url: "/payment/get/",
  method: "GET",
};

export const QPayPaymentCheck: API = {
  url: "/payment/check",
  method: "POST",
};

export const QPayPaymentCancel: API = {
  url: "/payment/cancel",
  method: "DELETE",
};

export const QPayPaymentRefund: API = {
  url: "/payment/refund/",
  method: "DELETE",
};

export const QPayPaymentList: API = {
  url: "/payment/url",
  method: "POST",
};

export const QPayInvoiceCreate: API = {
  url: "/invoice",
  method: "POST",
};

export const QPayInvoiceGet: API = {
  url: "/invoice/",
  method: "GET",
};

export const QPayInvoiceCancel: API = {
  url: "/invoice/",
  method: "DELETE",
};
