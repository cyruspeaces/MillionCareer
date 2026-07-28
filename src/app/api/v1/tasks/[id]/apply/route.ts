import { fail, ok } from "@/server/http";
import { getSessionUserId } from "@/server/auth";
import { ApplyError, applyToTask } from "@/server/task/service";

type Params = { params: Promise<{ id: string }> };

/** POST /api/v1/tasks/:id/apply — 报名（技能门槛校验；交付走私域） */
export async function POST(request: Request, { params }: Params) {
  const userId = await getSessionUserId();
  if (!userId) return fail("UNAUTHORIZED", "未登录", 401);

  try {
    const { id } = await params;
    let note: string | undefined;
    try {
      const body = (await request.json()) as { note?: unknown };
      if (typeof body?.note === "string") note = body.note;
    } catch {
      // 无 body 亦可
    }

    const application = await applyToTask(userId, id, note);
    return ok({ application }, undefined, { status: 201 });
  } catch (e) {
    if (e instanceof ApplyError) {
      const status =
        e.code === "NOT_FOUND"
          ? 404
          : e.code === "ALREADY_APPLIED"
            ? 409
            : 400;
      return fail(e.code, e.message, status);
    }
    console.error("[POST /api/v1/tasks/:id/apply]", e);
    return fail("INTERNAL_ERROR", "报名失败", 500);
  }
}
