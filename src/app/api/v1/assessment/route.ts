import { fail, ok } from "@/server/http";
import { getSessionUserId } from "@/server/auth";
import {
  getLatestAssessment,
  submitAssessment,
} from "@/server/assessment/service";

/** 获取当前用户最近一次测评结果 */
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return fail("UNAUTHORIZED", "未登录", 401);

  try {
    const result = await getLatestAssessment(userId);
    return ok({ result });
  } catch (e) {
    console.error("[GET /api/v1/assessment]", e);
    return fail("INTERNAL_ERROR", "获取测评结果失败", 500);
  }
}

/** 提交测评答案并落库、点亮技能 */
export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return fail("UNAUTHORIZED", "未登录，请先登录后再提交测评", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("BAD_REQUEST", "请求体无效", 400);
  }

  const answers =
    body &&
    typeof body === "object" &&
    "answers" in body &&
    (body as { answers: unknown }).answers;

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return fail("BAD_REQUEST", "缺少 answers", 400);
  }

  const normalized: Record<string, string> = {};
  for (const [k, v] of Object.entries(answers as Record<string, unknown>)) {
    if (typeof v === "string") normalized[k] = v;
  }

  try {
    const result = await submitAssessment(userId, normalized);
    return ok({ result });
  } catch (e) {
    console.error("[POST /api/v1/assessment]", e);
    return fail("INTERNAL_ERROR", "提交测评失败", 500);
  }
}
