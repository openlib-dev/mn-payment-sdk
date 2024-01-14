import { API } from "../../types";

export const SocialPayInvoicePhone: API = {
  url: "/pos/invoice/phone",
  method: "POST",
};

export const SocialPayInvoiceQr: API = {
  url: "/pos/invoice/qr",
  method: "POST",
};

export const SocialPayInvoiceCancel: API = {
  url: "/pos/invoice/cancel",
  method: "POST",
};

export const SocialPayInvoiceCheck: API = {
  url: "/pos/invoice/check",
  method: "POST",
};

export const SocialPayPaymentCancel: API = {
  url: "/pos/payment/cancel",
  method: "POST",
};

export const SocialPayPaymentSettlement: API = {
  url: "/pos/settlement",
  method: "POST",
};

export const httpRequestSocialpay = async (
  body: any,
  api: API,
  endpoint: string
): Promise<any> => {
  try {
    const requestBody = body ? JSON.stringify(body) : undefined;

    const response = await fetch(endpoint + api.url, {
      method: api.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    if (!response.ok) {
      throw new Error(`HTTP request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw new Error(`Error in httpRequestSocialpay: ${error}`);
  }
};
