import { fail, ok } from "@/server/http";
import { getJobById } from "@/server/job/service";

type Params = { params: Promise<{ id: string }> };

/** GET /api/v1/jobs/:id */
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const job = await getJobById(id);
    if (!job) return fail("NOT_FOUND", "岗位不存在或已下架", 404);
    return ok(job);
  } catch (e) {
    console.error("[GET /api/v1/jobs/:id]", e);
    return fail("INTERNAL_ERROR", "获取岗位详情失败", 500);
  }
}
