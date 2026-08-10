/** 腾讯云短信 SendSms（原生 https，避免 SDK 走坏掉的本地代理） */

import crypto from "node:crypto";
import https from "node:https";

type SendSmsParams = {
  secretId: string;
  secretKey: string;
  sdkAppId: string;
  signName: string;
  templateId: string;
  region: string;
  phone: string;
  code: string;
  minutes: number;
};

type SendSmsApiResponse = {
  Response?: {
    SendStatusSet?: Array<{
      Code?: string;
      Message?: string;
      PhoneNumber?: string;
    }>;
    Error?: { Code?: string; Message?: string };
    RequestId?: string;
  };
};

function sha256Hex(message: string): string {
  return crypto.createHash("sha256").update(message, "utf8").digest("hex");
}

function hmacSha256(message: string, key: Buffer | string): Buffer {
  return crypto.createHmac("sha256", key).update(message, "utf8").digest();
}

function tc3Authorization(opts: {
  secretId: string;
  secretKey: string;
  service: string;
  host: string;
  action: string;
  payload: string;
  timestamp: number;
}): string {
  const { secretId, secretKey, service, host, action, payload, timestamp } =
    opts;
  const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
  const contentType = "application/json; charset=utf-8";

  const hashedPayload = sha256Hex(payload);
  const canonicalHeaders =
    `content-type:${contentType}\n` +
    `host:${host}\n` +
    `x-tc-action:${action.toLowerCase()}\n`;
  const signedHeaders = "content-type;host;x-tc-action";
  const canonicalRequest = [
    "POST",
    "/",
    "",
    canonicalHeaders,
    signedHeaders,
    hashedPayload,
  ].join("\n");

  const credentialScope = `${date}/${service}/tc3_request`;
  const stringToSign = [
    "TC3-HMAC-SHA256",
    String(timestamp),
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const secretDate = hmacSha256(date, `TC3${secretKey}`);
  const secretService = hmacSha256(service, secretDate);
  const secretSigning = hmacSha256("tc3_request", secretService);
  const signature = crypto
    .createHmac("sha256", secretSigning)
    .update(stringToSign, "utf8")
    .digest("hex");

  return `TC3-HMAC-SHA256 Credential=${secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

function httpsPostJson(opts: {
  host: string;
  headers: Record<string, string>;
  body: string;
}): Promise<{ statusCode: number; text: string }> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        protocol: "https:",
        hostname: opts.host,
        port: 443,
        path: "/",
        method: "POST",
        headers: {
          ...opts.headers,
          "Content-Length": Buffer.byteLength(opts.body, "utf8"),
        },
        // 不走 HTTP_PROXY / 本地代理
        agent: false,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode ?? 0,
            text: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );
    req.setTimeout(15_000, () => {
      req.destroy(new Error("腾讯云短信请求超时"));
    });
    req.on("error", reject);
    req.write(opts.body, "utf8");
    req.end();
  });
}

export async function sendTencentSms(params: SendSmsParams): Promise<void> {
  const host = "sms.tencentcloudapi.com";
  const service = "sms";
  const action = "SendSms";
  const version = "2021-01-11";
  const timestamp = Math.floor(Date.now() / 1000);
  const contentType = "application/json; charset=utf-8";

  const payload = JSON.stringify({
    SmsSdkAppId: params.sdkAppId,
    SignName: params.signName,
    TemplateId: params.templateId,
    TemplateParamSet: [params.code, String(params.minutes)],
    PhoneNumberSet: [`+86${params.phone}`],
  });

  const authorization = tc3Authorization({
    secretId: params.secretId,
    secretKey: params.secretKey,
    service,
    host,
    action,
    payload,
    timestamp,
  });

  const { statusCode, text } = await httpsPostJson({
    host,
    body: payload,
    headers: {
      Authorization: authorization,
      "Content-Type": contentType,
      Host: host,
      "X-TC-Action": action,
      "X-TC-Timestamp": String(timestamp),
      "X-TC-Version": version,
      "X-TC-Region": params.region,
    },
  });

  let data: SendSmsApiResponse;
  try {
    data = JSON.parse(text) as SendSmsApiResponse;
  } catch {
    throw new Error(`短信接口返回异常 HTTP ${statusCode}`);
  }

  if (data.Response?.Error) {
    throw new Error(
      data.Response.Error.Message ||
        data.Response.Error.Code ||
        "短信发送失败",
    );
  }

  const status = data.Response?.SendStatusSet?.[0];
  if (!status || status.Code !== "Ok") {
    throw new Error(status?.Message || status?.Code || "短信发送失败");
  }
}
