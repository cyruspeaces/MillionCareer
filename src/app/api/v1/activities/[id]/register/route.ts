import { fail, ok } from "@/server/http";
import { getSessionUserId } from "@/server/auth";
import {
  RegisterError,
  registerActivity,
} from "@/server/activity/service";

type Params = { params: Promise<{ id: string }> };

/** POST /api/v1/activities/:id/register */
export async function POST(_request: Request, { params }: Params) {
  const userId = await getSessionUserId();
  if (!userId) return fail("UNAUTHORIZED", "未登录", 401);

  try {
    const { id } = await params;
    const registration = await registerActivity(userId, id);
    return ok({ registration }, undefined, { status: 201 });
  } catch (e) {
    if (e instanceof RegisterError) {
      const status =
        e.code === "NOT_FOUND"
          ? 404
          : e.code === "ALREADY_REGISTERED"
            ? 409
            : 400;
      return fail(e.code, e.message, status);
    }
    console.error("[POST /api/v1/activities/:id/register]", e);
    return fail("INTERNAL_ERROR", "报名失败", 500);
  }
}
