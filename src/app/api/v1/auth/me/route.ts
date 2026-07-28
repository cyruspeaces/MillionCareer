import { fail, ok } from "@/server/http";
import { getSessionUserId, getUserById } from "@/server/auth";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return fail("UNAUTHORIZED", "未登录", 401);
  }

  const user = await getUserById(userId);
  if (!user) {
    return fail("UNAUTHORIZED", "会话无效", 401);
  }

  return ok({ user });
}
