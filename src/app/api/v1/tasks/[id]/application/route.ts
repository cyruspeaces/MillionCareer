import { fail, ok } from "@/server/http";
import { getSessionUserId } from "@/server/auth";
import { getTaskById, hasApplied } from "@/server/task/service";

type Params = { params: Promise<{ id: string }> };

/** GET /api/v1/tasks/:id/application — 当前用户是否已报名 */
export async function GET(_request: Request, { params }: Params) {
  const userId = await getSessionUserId();
  if (!userId) return fail("UNAUTHORIZED", "未登录", 401);

  try {
    const { id } = await params;
    const task = await getTaskById(id);
    if (!task) return fail("NOT_FOUND", "任务不存在", 404);

    const applied = await hasApplied(userId, id);
    return ok({ applied });
  } catch (e) {
    console.error("[GET /api/v1/tasks/:id/application]", e);
    return fail("INTERNAL_ERROR", "查询报名状态失败", 500);
  }
}
