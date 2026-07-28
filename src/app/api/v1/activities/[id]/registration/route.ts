import { fail, ok } from "@/server/http";
import { getSessionUserId } from "@/server/auth";
import {
  getActivityById,
  hasRegistered,
} from "@/server/activity/service";

type Params = { params: Promise<{ id: string }> };

/** GET /api/v1/activities/:id/registration */
export async function GET(_request: Request, { params }: Params) {
  const userId = await getSessionUserId();
  if (!userId) return fail("UNAUTHORIZED", "未登录", 401);

  try {
    const { id } = await params;
    const activity = await getActivityById(id);
    if (!activity) return fail("NOT_FOUND", "活动不存在", 404);

    const registered = await hasRegistered(userId, id);
    return ok({ registered });
  } catch (e) {
    console.error("[GET /api/v1/activities/:id/registration]", e);
    return fail("INTERNAL_ERROR", "查询报名状态失败", 500);
  }
}
