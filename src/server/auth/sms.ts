/** 短信验证码（一期 mock，后续可换成腾讯云短信） */

const CN_MOBILE = /^1[3-9]\d{9}$/;

export function normalizePhone(raw: string): string {
  return raw.replace(/\s+/g, "").trim();
}

export function isValidCnMobile(phone: string): boolean {
  return CN_MOBILE.test(phone);
}

export function getMockSmsCode(): string {
  return process.env.SMS_MOCK_CODE?.trim() || "111111";
}

/** 发送验证码：mock 阶段仅校验手机号，不真发短信 */
export function sendSmsCode(phoneRaw: string): {
  ok: true;
  phone: string;
} | {
  ok: false;
  code: string;
  message: string;
} {
  const phone = normalizePhone(phoneRaw);
  if (!isValidCnMobile(phone)) {
    return {
      ok: false,
      code: "INVALID_PHONE",
      message: "请输入正确的大陆手机号",
    };
  }
  // mock：不落库、不调用短信网关
  return { ok: true, phone };
}

export function verifySmsCode(
  phoneRaw: string,
  codeRaw: string,
): {
  ok: true;
  phone: string;
} | {
  ok: false;
  code: string;
  message: string;
} {
  const phone = normalizePhone(phoneRaw);
  if (!isValidCnMobile(phone)) {
    return {
      ok: false,
      code: "INVALID_PHONE",
      message: "请输入正确的大陆手机号",
    };
  }
  const code = codeRaw.trim();
  if (!code) {
    return {
      ok: false,
      code: "INVALID_CODE",
      message: "请输入验证码",
    };
  }
  if (code !== getMockSmsCode()) {
    return {
      ok: false,
      code: "INVALID_CODE",
      message: "验证码错误",
    };
  }
  return { ok: true, phone };
}
