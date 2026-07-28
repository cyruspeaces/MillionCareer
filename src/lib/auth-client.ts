export type AuthUser = {
  id: string;
  phone: string | null;
  nickname: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
};

type ApiOk<T> = { data: T };
type ApiErr = { error: { code: string; message: string } };

async function parseJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

export async function fetchMe(): Promise<AuthUser | null> {
  const res = await fetch("/api/v1/auth/me", {
    credentials: "include",
    cache: "no-store",
  });
  if (res.status === 401) return null;
  if (!res.ok) return null;
  const body = await parseJson<ApiOk<{ user: AuthUser }>>(res);
  return body.data.user;
}

export async function sendSms(phone: string): Promise<{
  ok: boolean;
  message: string;
}> {
  const res = await fetch("/api/v1/auth/sms/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ phone }),
  });
  const body = await parseJson<ApiOk<{ ok: boolean; mockHint?: string }> | ApiErr>(
    res,
  );
  if (!res.ok || "error" in body) {
    return {
      ok: false,
      message:
        "error" in body ? body.error.message : "发送失败，请稍后重试",
    };
  }
  return {
    ok: true,
    message: body.data.mockHint ?? "验证码已发送",
  };
}

export async function loginWithSms(
  phone: string,
  code: string,
): Promise<{
  ok: boolean;
  message: string;
  user?: AuthUser;
  isNew?: boolean;
}> {
  const res = await fetch("/api/v1/auth/sms/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ phone, code }),
  });
  const body = await parseJson<
    ApiOk<{ user: AuthUser; isNew: boolean }> | ApiErr
  >(res);
  if (!res.ok || "error" in body) {
    return {
      ok: false,
      message: "error" in body ? body.error.message : "登录失败，请稍后重试",
    };
  }
  return {
    ok: true,
    message: body.data.isNew ? "注册并登录成功" : "登录成功",
    user: body.data.user,
    isNew: body.data.isNew,
  };
}

export async function logout(): Promise<void> {
  await fetch("/api/v1/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export async function updateNickname(nickname: string): Promise<{
  ok: boolean;
  message: string;
  user?: AuthUser;
}> {
  const res = await fetch("/api/v1/auth/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ nickname }),
  });
  const body = await parseJson<ApiOk<{ user: AuthUser }> | ApiErr>(res);
  if (!res.ok || "error" in body) {
    return {
      ok: false,
      message: "error" in body ? body.error.message : "保存失败，请稍后重试",
    };
  }
  return { ok: true, message: "已更新", user: body.data.user };
}

export function avatarInitials(nickname: string | null | undefined, phone: string | null | undefined) {
  if (nickname?.trim()) return nickname.trim().slice(0, 1);
  if (phone) return phone.slice(-2);
  return "?";
}

export function maskPhone(phone: string | null | undefined) {
  if (!phone || phone.length < 7) return phone ?? "";
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}
