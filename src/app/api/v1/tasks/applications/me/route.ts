import { fail, ok } from "@/server/http";
import { getSessionUserId } from "@/server/auth";
import { listMyApplications } from "@/server/task/service";

/** GET /api/v1/tasks/applications/me — 我的报名列表 */
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return fail("UNAUTHORIZED", "未登录", 401);

  try {
    const applications = await listMyApplications(userId);
    return ok({ applications });
  } catch (e) {
    console.error("[GET /api/v1/tasks/applications/me]", e);
    return fail("INTERNAL_ERROR", "获取报名列表失败", 500);
  }
}
