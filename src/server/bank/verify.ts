import crypto from "node:crypto";
import https from "node:https";

const DEFAULT_API_URL =
  "https://ap-beijing.cloudmarket-apigw.com/service-lq1dzayt/v2/bcheck";

export type BankVerifyInput = {
  name: string;
  idCard: string;
  accountNo: string;
  mobile: string;
};

export type BankVerifySuccess = {
  ok: true;
  bankName: string | null;
  cardType: string | null;
  cardName: string | null;
};

export type BankVerifyResult =
  | BankVerifySuccess
  | { ok: false; message: string };

type BCheckBody = {
  error_code?: number | string;
  reason?: string;
  message?: string;
  result?: {
    respCode?: string;
    respMsg?: string;
    detailCode?: string | number;
    bancardInfor?: {
      bankName?: string;
      type?: string;
      cardname?: string;
    };
  };
};

/** 云市场网关签名：HMAC-SHA1("x-date: <GMT>") */
function cloudMarketAuthorization(secretId: string, secretKey: string): string {
  const xDate = new Date().toUTCString();
  const signature = crypto
    .createHmac("sha1", secretKey)
    .update(`x-date: ${xDate}`, "utf8")
    .digest("base64");
  return JSON.stringify({
    id: secretId,
    "x-date": xDate,
    signature,
  });
}

function postForm(url: URL, headers: Record<string, string>, body: string) {
  return new Promise<{ statusCode: number; text: string }>((resolve, reject) => {
    const req = https.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: 443,
        path: `${url.pathname}${url.search}`,
        method: "POST",
        headers: {
          ...headers,
          "Content-Length": Buffer.byteLength(body, "utf8"),
        },
        agent: false,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode ?? 0,
            text: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );
    req.setTimeout(15_000, () => {
      req.destroy(new Error("银行卡校验请求超时"));
    });
    req.on("error", reject);
    req.write(body, "utf8");
    req.end();
  });
}

export async function verifyBankCard4(
  input: BankVerifyInput,
): Promise<BankVerifyResult> {
  const secretId = process.env.TENCENT_BANK_SECRET_ID?.trim();
  const secretKey = process.env.TENCENT_BANK_SECRET_KEY?.trim();
  const endpoint = process.env.TENCENT_BANK_API_URL?.trim() || DEFAULT_API_URL;
  if (!secretId || !secretKey) {
    return { ok: false, message: "银行卡校验未配置，请联系管理员" };
  }

  const body = new URLSearchParams({
    accountNo: input.accountNo,
    bankPreMobile: input.mobile,
    idCardCode: input.idCard,
    name: input.name,
  }).toString();

  let statusCode = 0;
  let text = "";
  try {
    const response = await postForm(
      new URL(endpoint),
      {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: cloudMarketAuthorization(secretId, secretKey),
        "request-id": crypto.randomUUID(),
        "X-Requested-With": "XMLHttpRequest",
      },
      body,
    );
    statusCode = response.statusCode;
    text = response.text;
  } catch (error) {
    console.error("[bank-card] request failed", error);
    return { ok: false, message: "银行卡校验服务暂不可用，请稍后重试" };
  }

  let data: BCheckBody;
  try {
    data = JSON.parse(text) as BCheckBody;
  } catch {
    console.error("[bank-card] non-json", statusCode);
    return { ok: false, message: "银行卡校验服务暂不可用，请稍后重试" };
  }

  if (statusCode >= 300) {
    console.error("[bank-card] http", statusCode, data.reason || data.message);
    return {
      ok: false,
      message: data.reason || data.message || "银行卡校验服务暂不可用",
    };
  }

  const errorCode = Number(data.error_code);
  const result = data.result;
  const respCode = result?.respCode;
  if (errorCode !== 0 || respCode !== "T") {
    console.error("[bank-card] rejected", errorCode, respCode, result?.detailCode);
    return {
      ok: false,
      message:
        result?.respMsg ||
        data.reason ||
        "银行卡信息校验未通过，请核对后再试",
    };
  }

  const info = result?.bancardInfor;
  return {
    ok: true,
    bankName: info?.bankName?.trim() || null,
    cardType: info?.type?.trim() || null,
    cardName: info?.cardname?.trim() || null,
  };
}
