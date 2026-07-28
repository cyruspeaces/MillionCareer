import { fail, ok } from "@/server/http";
import { getSessionUserId, getUserById } from "@/server/auth";
import { prisma } from "@/server/db";

function normalizeNickname(raw: string) {
  return raw.replace(/\s+/g, " ").trim();
}

export async function PATCH(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return fail("UNAUTHORIZED", "未登录", 401);
  }

  let body: { nickname?: string };
  try {
    body = (await request.json()) as { nickname?: string };
  } catch {
    return fail("BAD_REQUEST", "请求体无效");
  }

  const nickname = normalizeNickname(body.nickname ?? "");
  if (nickname.length < 2 || nickname.length > 20) {
    return fail("INVALID_NICKNAME", "用户名需为 2～20 个字符");
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { nickname },
    });
    const user = await getUserById(userId);
    if (!user) {
      return fail("UNAUTHORIZED", "会话无效", 401);
    }
    return ok({ user });
  } catch (error) {
    console.error("[auth/profile]", error);
    return fail("UPDATE_FAILED", "保存失败，请稍后重试", 500);
  }
}
