import { fail, ok } from "@/server/http";
import { getSessionUserId } from "@/server/auth";
import { listMySettlements } from "@/server/settlement/service";

/** GET /api/v1/settlements/me — 我的结算汇总与流水 */
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return fail("UNAUTHORIZED", "未登录", 401);

  try {
    const data = await listMySettlements(userId);
    return ok(data);
  } catch (e) {
    console.error("[GET /api/v1/settlements/me]", e);
    return fail("INTERNAL_ERROR", "获取结算失败", 500);
  }
}
