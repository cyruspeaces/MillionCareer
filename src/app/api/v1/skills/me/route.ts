import { fail, ok } from "@/server/http";
import { getSessionUserId } from "@/server/auth";
import { listUserSkills } from "@/server/assessment/service";

/** 当前用户已点亮的技能 */
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return fail("UNAUTHORIZED", "未登录", 401);

  try {
    const skills = await listUserSkills(userId);
    return ok({ skills });
  } catch (e) {
    console.error("[GET /api/v1/skills/me]", e);
    return fail("INTERNAL_ERROR", "获取技能失败", 500);
  }
}
