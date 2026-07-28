import { fail, ok } from "@/server/http";
import { sendSmsCode } from "@/server/auth";

export async function POST(request: Request) {
  let body: { phone?: string };
  try {
    body = (await request.json()) as { phone?: string };
  } catch {
    return fail("BAD_REQUEST", "请求体无效");
  }

  const result = sendSmsCode(body.phone ?? "");
  if (!result.ok) {
    return fail(result.code, result.message);
  }

  return ok({
    ok: true as const,
    /** 开发提示：真短信接入后移除此字段 */
    mockHint: "模拟短信已「发送」，验证码为 111111",
  });
}
