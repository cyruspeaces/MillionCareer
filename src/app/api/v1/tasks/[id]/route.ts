import { fail, ok } from "@/server/http";
import { getTaskById } from "@/server/task/service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const task = await getTaskById(id);
    if (!task) return fail("NOT_FOUND", "任务不存在", 404);
    return ok(task);
  } catch (e) {
    console.error("[GET /api/v1/tasks/:id]", e);
    return fail("INTERNAL_ERROR", "获取任务详情失败", 500);
  }
}
