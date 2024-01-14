import { API } from "../../types";

export const ECommerceInvoiceCreate: API = {
  url: "/api/invoice",
  method: "POST",
};

export const ECommerceInquiry: API = {
  url: "/api/inquiry",
  method: "POST",
};

export const ECommercePayByToken: API = {
  url: "/api/pay",
  method: "POST",
};
