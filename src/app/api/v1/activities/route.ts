import { fail, ok } from "@/server/http";
import { listActivities } from "@/server/activity/service";

/** GET /api/v1/activities */
export async function GET() {
  try {
    const activities = await listActivities();
    return ok(activities);
  } catch (e) {
    console.error("[GET /api/v1/activities]", e);
    return fail("INTERNAL_ERROR", "获取活动列表失败", 500);
  }
}
