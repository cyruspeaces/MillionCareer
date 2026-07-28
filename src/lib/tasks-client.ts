import type { TaskView } from "@/types/task";

type ApiSuccess<T> = { data: T };
type ApiErr = { error: { code: string; message: string } };

export type MyApplicationDto = {
  id: string;
  taskId: string;
  note: string | null;
  createdAt: string;
  task: {
    title: string;
    category: string;
    reward: string;
    status: string;
  };
};

export type ApplyError = Error & {
  code?: string;
};

async function parseJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

export async function fetchTasks(category?: string): Promise<TaskView[]> {
  const qs =
    category && category !== "全部"
      ? `?category=${encodeURIComponent(category)}`
      : "";
  const res = await fetch(`/api/v1/tasks${qs}`, { cache: "no-store" });
  if (!res.ok) throw new Error("获取任务列表失败");
  const body = (await res.json()) as ApiSuccess<TaskView[]>;
  return body.data;
}

export async function fetchTaskById(id: string): Promise<TaskView | null> {
  const res = await fetch(`/api/v1/tasks/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("获取任务详情失败");
  const body = (await res.json()) as ApiSuccess<TaskView>;
  return body.data;
}

/** 报名任务；未登录 / 门槛不足等抛出带 code 的错误 */
export async function applyToTask(
  taskId: string,
  note?: string,
): Promise<{ id: string; taskId: string; createdAt: string }> {
  const res = await fetch(`/api/v1/tasks/${taskId}/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note ? { note } : {}),
  });
  const body = await parseJson<
    ApiSuccess<{ application: { id: string; taskId: string; createdAt: string } }> | ApiErr
  >(res);
  if (!res.ok) {
    const err = body as ApiErr;
    const error = new Error(err.error?.message ?? "报名失败") as ApplyError;
    error.code = err.error?.code;
    throw error;
  }
  return (body as ApiSuccess<{ application: { id: string; taskId: string; createdAt: string } }>)
    .data.application;
}

/** 当前用户是否已报名；未登录返回 false */
export async function fetchTaskApplied(taskId: string): Promise<boolean> {
  const res = await fetch(`/api/v1/tasks/${taskId}/application`, {
    cache: "no-store",
  });
  if (res.status === 401) return false;
  if (!res.ok) throw new Error("查询报名状态失败");
  const body = await parseJson<ApiSuccess<{ applied: boolean }>>(res);
  return body.data.applied;
}

/** 我的报名列表；未登录返回 [] */
export async function fetchMyApplications(): Promise<MyApplicationDto[]> {
  const res = await fetch("/api/v1/tasks/applications/me", {
    cache: "no-store",
  });
  if (res.status === 401) return [];
  if (!res.ok) throw new Error("获取报名列表失败");
  const body = await parseJson<ApiSuccess<{ applications: MyApplicationDto[] }>>(
    res,
  );
  return body.data.applications;
}
