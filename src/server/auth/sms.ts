/** 短信验证码：腾讯云发送 + 数据库校验；可切 mock */

import { prisma } from "@/server/db";
import { sendTencentSms } from "@/server/auth/tencent-sms";

const CN_MOBILE = /^1[3-9]\d{9}$/;
const RESEND_INTERVAL_MS = 60_000;
const MAX_ATTEMPTS_HINT = "验证码错误或已过期";

type SmsResult =
  | { ok: true; phone: string }
  | { ok: false; code: string; message: string };

export function normalizePhone(raw: string): string {
  return raw.replace(/\s+/g, "").trim();
}

export function isValidCnMobile(phone: string): boolean {
  return CN_MOBILE.test(phone);
}

export function getMockSmsCode(): string {
  return process.env.SMS_MOCK_CODE?.trim() || "111111";
}

function useMockSms(): boolean {
  if (process.env.SMS_USE_MOCK === "true") return true;
  const id = process.env.TENCENT_SMS_SECRET_ID?.trim();
  const key = process.env.TENCENT_SMS_SECRET_KEY?.trim();
  return !id || !key;
}

function codeTtlMinutes(): number {
  const n = Number(process.env.TENCENT_SMS_CODE_TTL_MINUTES ?? "5");
  return Number.isFinite(n) && n > 0 ? Math.min(Math.floor(n), 30) : 5;
}

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function friendlySmsError(detail: string): string {
  const lower = detail.toLowerCase();
  if (
    lower.includes("daily sending limit") ||
    lower.includes("limitexceeded.phoneNumberdaily") ||
    lower.includes("sdkappid level")
  ) {
    return "验证码发送过于频繁，请稍后再试";
  }
  if (lower.includes("insufficient") || lower.includes("balance")) {
    return "验证码暂时无法发送，请稍后再试";
  }
  // 详细错误只打日志，不直接展示给用户
  return "验证码发送失败，请稍后重试";
}

async function sendViaTencent(phone: string, code: string, minutes: number) {
  const secretId = process.env.TENCENT_SMS_SECRET_ID!.trim();
  const secretKey = process.env.TENCENT_SMS_SECRET_KEY!.trim();
  const sdkAppId = process.env.TENCENT_SMS_SDK_APP_ID?.trim();
  const signName = process.env.TENCENT_SMS_SIGN_NAME?.trim();
  const templateId = process.env.TENCENT_SMS_TEMPLATE_ID?.trim();
  const region = process.env.TENCENT_SMS_REGION?.trim() || "ap-guangzhou";

  if (!sdkAppId || !signName || !templateId) {
    throw new Error("腾讯云短信配置不完整（SDKAppID / 签名 / 模板 ID）");
  }

  await sendTencentSms({
    secretId,
    secretKey,
    sdkAppId,
    signName,
    templateId,
    region,
    phone,
    code,
    minutes,
  });
}

/** 发送验证码 */
export async function sendSmsCode(phoneRaw: string): Promise<SmsResult> {
  const phone = normalizePhone(phoneRaw);
  if (!isValidCnMobile(phone)) {
    return {
      ok: false,
      code: "INVALID_PHONE",
      message: "请输入正确的大陆手机号",
    };
  }

  const latest = await prisma.smsCode.findFirst({
    where: { phone },
    orderBy: { createdAt: "desc" },
  });
  if (
    latest &&
    Date.now() - latest.createdAt.getTime() < RESEND_INTERVAL_MS
  ) {
    const wait = Math.ceil(
      (RESEND_INTERVAL_MS - (Date.now() - latest.createdAt.getTime())) / 1000,
    );
    return {
      ok: false,
      code: "RATE_LIMITED",
      message: `请 ${wait} 秒后再获取验证码`,
    };
  }

  const minutes = codeTtlMinutes();
  const code = useMockSms() ? getMockSmsCode() : generateCode();
  const expiresAt = new Date(Date.now() + minutes * 60_000);

  if (!useMockSms()) {
    try {
      await sendViaTencent(phone, code, minutes);
    } catch (e) {
      const detail = e instanceof Error ? e.message : String(e);
      console.error("[auth/sms/send] tencent", detail);
      return {
        ok: false,
        code: "SMS_SEND_FAILED",
        message: friendlySmsError(detail),
      };
    }
  } else {
    console.info(`[auth/sms/send] mock phone=${phone} code=${code}`);
  }

  await prisma.smsCode.create({
    data: { phone, code, expiresAt },
  });

  return { ok: true, phone };
}

/** 校验验证码（成功则标记已用） */
export async function verifySmsCode(
  phoneRaw: string,
  codeRaw: string,
): Promise<SmsResult> {
  const phone = normalizePhone(phoneRaw);
  if (!isValidCnMobile(phone)) {
    return {
      ok: false,
      code: "INVALID_PHONE",
      message: "请输入正确的大陆手机号",
    };
  }
  const code = codeRaw.trim();
  if (!/^\d{4,8}$/.test(code)) {
    return {
      ok: false,
      code: "INVALID_CODE",
      message: "请输入验证码",
    };
  }

  const record = await prisma.smsCode.findFirst({
    where: {
      phone,
      code,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return {
      ok: false,
      code: "INVALID_CODE",
      message: MAX_ATTEMPTS_HINT,
    };
  }

  await prisma.smsCode.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return { ok: true, phone };
}
