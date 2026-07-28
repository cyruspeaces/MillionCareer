import { fail, ok } from "@/server/http";
import { listTasks } from "@/server/task/service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const tasks = await listTasks({ category });
    return ok(tasks, { total: tasks.length });
  } catch (e) {
    console.error("[GET /api/v1/tasks]", e);
    return fail("INTERNAL_ERROR", "获取任务列表失败", 500);
  }
}
