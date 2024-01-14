import crypto from "crypto";
import {
  SocialPayErrorResponse,
  SocialPayPaymentSettlementResponse,
  SocialPaySimpleResponse,
  SocialPayTransactionResponse,
} from "./socialpay/types";

export namespace utils {
  const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const letterIdxBits = 6;
  const letterIdxMask = (1 << letterIdxBits) - 1;
  const letterIdxMax = 63 / letterIdxBits;

  export const generateHMAC = (secret: string, data: string): string => {
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(data);
    return hmac.digest("hex");
  };
  export const randStringBytesMaskImprSrcS = (n: number): string => {
    let src = new Uint32Array(1);
    const sb: string[] = [];
    sb.length = n;
    let i = n - 1;
    let cache = src[0];
    let remain = letterIdxMax;

    while (i >= 0) {
      if (remain === 0) {
        src = new Uint32Array(1);
        crypto.getRandomValues(src);
        cache = src[0];
        remain = letterIdxMax;
      }

      const idx = cache & letterIdxMask;
      if (idx < letterBytes.length) {
        sb[i] = letterBytes[idx];
        i--;
      }

      cache >>= letterIdxBits;
      remain--;
    }

    return sb.join("");
  };

  const getValidString = (val: any) => {
    return `${val}`;
  };

  const getValidFloat = (val: any) => {
    return parseFloat(val);
  };

  export function mapToSimpleResponse(
    resp: Record<string, unknown>
  ): SocialPaySimpleResponse {
    return {
      desc: getValidString(resp["desc"]),
      status: getValidString(resp["status"]),
    };
  }

  export function mapToTransactionInfo(
    resp: Record<string, unknown>
  ): SocialPayTransactionResponse {
    return {
      approval_code: getValidString(resp["approval_code"]),
      amount: getValidFloat(resp["amount"]),
      card_number: getValidString(resp["card_number"]),
      resp_desc: getValidString(resp["resp_desc"]),
      resp_code: getValidString(resp["resp_code"]),
      terminal: getValidString(resp["terminal"]),
      invoice: getValidString(resp["invoice"]),
      checksum: getValidString(resp["checksum"]),
    };
  }

  export function mapToSettlementResponse(
    resp: Record<string, unknown>
  ): SocialPayPaymentSettlementResponse {
    return {
      amount: getValidFloat(resp["amount"]),
      count: resp["count"] as number,
      status: getValidString(resp["status"]),
    };
  }

  export function mapToErrorResponse(
    resp: Record<string, unknown>
  ): SocialPayErrorResponse {
    return {
      errorDesc: getValidString(resp["errorDesc"]),
      errorType: getValidString(resp["errorType"]),
    };
  }
}
