import { fail, ok } from "@/server/http";
import { sendSmsCode } from "@/server/auth";

export async function POST(request: Request) {
  let body: { phone?: string };
  try {
    body = (await request.json()) as { phone?: string };
  } catch {
    return fail("BAD_REQUEST", "请求体无效");
  }

  const result = await sendSmsCode(body.phone ?? "");
  if (!result.ok) {
    return fail(result.code, result.message);
  }

  const mock = process.env.SMS_USE_MOCK === "true";

  return ok({
    ok: true as const,
    ...(mock
      ? {
          mockHint: `模拟短信已发送，验证码为 ${process.env.SMS_MOCK_CODE?.trim() || "111111"}`,
        }
      : {}),
  });
}
