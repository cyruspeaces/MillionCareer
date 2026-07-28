import { fail, ok } from "@/server/http";
import { loginOrRegister, setSessionCookie, verifySmsCode } from "@/server/auth";

export async function POST(request: Request) {
  let body: { phone?: string; code?: string };
  try {
    body = (await request.json()) as { phone?: string; code?: string };
  } catch {
    return fail("BAD_REQUEST", "请求体无效");
  }

  const verified = verifySmsCode(body.phone ?? "", body.code ?? "");
  if (!verified.ok) {
    return fail(verified.code, verified.message);
  }

  try {
    const { user, isNew } = await loginOrRegister(verified.phone);
    await setSessionCookie(user.id);
    return ok({ user, isNew });
  } catch (error) {
    console.error("[auth/sms/login]", error);
    return fail("LOGIN_FAILED", "登录失败，请稍后重试", 500);
  }
}
