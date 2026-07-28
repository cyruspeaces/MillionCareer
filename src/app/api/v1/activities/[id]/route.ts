import { fail, ok } from "@/server/http";
import { getActivityById } from "@/server/activity/service";

type Params = { params: Promise<{ id: string }> };

/** GET /api/v1/activities/:id */
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const activity = await getActivityById(id);
    if (!activity) return fail("NOT_FOUND", "活动不存在", 404);
    return ok(activity);
  } catch (e) {
    console.error("[GET /api/v1/activities/:id]", e);
    return fail("INTERNAL_ERROR", "获取活动详情失败", 500);
  }
}
