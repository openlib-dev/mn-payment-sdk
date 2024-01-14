import crypto from "crypto";

export namespace utils {
  const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const letterIdxBits = 6;
  const letterIdxMask = (1 << letterIdxBits) - 1;
  const letterIdxMax = 63 / letterIdxBits;
  let src = new Uint32Array(1);

  export const generateHMAC = (secret: string, data: string): string => {
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(data);
    return hmac.digest("hex");
  };
  export const randStringBytesMaskImprSrcS = (n: number): string => {
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
}
