import { utils } from "../utils"; // Adjust the import path based on your project structure
import { SocialPayPaymentSettlement, httpRequestSocialpay } from "./apis";
import {
  Response,
  SocialPayPaymentSettlementResponse,
  SocialPaySettlementRequest,
  SocialPaySimpleResponse,
} from "./types";

export class SocialPay {
  terminal: string;
  secret: string;
  endpoint: string;

  constructor(terminal: string, secret: string, endpoint: string) {
    this.terminal = terminal;
    this.secret = secret;
    this.endpoint = endpoint;
  }

  async transactionSettlement(
    settlementId: string
  ): Promise<SocialPayPaymentSettlementResponse> {
    const checksum = utils.generateHMAC(
      this.secret,
      `${this.terminal}${settlementId}`
    );
    const request: SocialPaySettlementRequest = {
      settlementId,
      checksum,
      terminal: this.terminal,
    };

    const res = await httpRequestSocialpay(
      request,
      SocialPayPaymentSettlement,
      this.endpoint
    );
    const resp: Response = JSON.parse(res);

    if (resp.header.code !== 200) {
      const errorResponse = utils.mapToErrorResponse(resp.body.error);
      throw new Error(errorResponse.errorDesc);
    } else {
      return utils.mapToSettlementResponse(resp.body.response);
    }
  }
}
