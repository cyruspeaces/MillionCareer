import { fail, ok } from "@/server/http";
import { listJobs } from "@/server/job/service";

/** GET /api/v1/jobs */
export async function GET(request: Request) {
  try {
    const campaign = new URL(request.url).searchParams.get("campaign") ?? undefined;
    const jobs = await listJobs(campaign || undefined);
    return ok(jobs);
  } catch (e) {
    console.error("[GET /api/v1/jobs]", e);
    return fail("INTERNAL_ERROR", "获取岗位列表失败", 500);
  }
}
