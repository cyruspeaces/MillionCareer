import type { AssessmentResult } from "@/data/assessment";

type ApiOk<T> = { data: T };
type ApiErr = { error: { code: string; message: string } };

export type AssessmentDto = AssessmentResult & {
  id: string;
  litSkillCodes: string[];
};

export type UserSkillDto = {
  code: string;
  name: string;
  group: string;
  kind: string;
  tier: number;
  source: string;
  unlockedAt: string;
};

async function parseJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

/** 拉取当前用户最近一次测评；未登录返回 null */
export async function fetchLatestAssessment(): Promise<AssessmentDto | null> {
  const res = await fetch("/api/v1/assessment", { cache: "no-store" });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("获取测评结果失败");
  const body = await parseJson<ApiOk<{ result: AssessmentDto | null }>>(res);
  return body.data.result;
}

/** 提交测评；未登录抛出带 code 的错误 */
export async function submitAssessmentAnswers(
  answers: Record<string, string>,
): Promise<AssessmentDto> {
  const res = await fetch("/api/v1/assessment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  const body = await parseJson<
    ApiOk<{ result: AssessmentDto }> | ApiErr
  >(res);
  if (!res.ok) {
    const err = body as ApiErr;
    const error = new Error(err.error?.message ?? "提交测评失败") as Error & {
      code?: string;
    };
    error.code = err.error?.code;
    throw error;
  }
  return (body as ApiOk<{ result: AssessmentDto }>).data.result;
}

export async function fetchMySkills(): Promise<UserSkillDto[]> {
  const res = await fetch("/api/v1/skills/me", { cache: "no-store" });
  if (res.status === 401) return [];
  if (!res.ok) throw new Error("获取技能失败");
  const body = await parseJson<ApiOk<{ skills: UserSkillDto[] }>>(res);
  return body.data.skills;
}
