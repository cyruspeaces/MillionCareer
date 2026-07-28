import type { ActivityView } from "@/types/activity";

type ApiSuccess<T> = { data: T };
type ApiErr = { error: { code: string; message: string } };

export type RegisterError = Error & { code?: string };

async function parseJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

export async function fetchActivities(): Promise<ActivityView[]> {
  const res = await fetch("/api/v1/activities", { cache: "no-store" });
  if (!res.ok) throw new Error("获取活动列表失败");
  const body = (await res.json()) as ApiSuccess<ActivityView[]>;
  return body.data;
}

export async function fetchActivityById(
  id: string,
): Promise<ActivityView | null> {
  const res = await fetch(`/api/v1/activities/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("获取活动详情失败");
  const body = (await res.json()) as ApiSuccess<ActivityView>;
  return body.data;
}

export async function registerActivity(
  activityId: string,
): Promise<{ id: string; activityId: string; createdAt: string }> {
  const res = await fetch(`/api/v1/activities/${activityId}/register`, {
    method: "POST",
  });
  const body = await parseJson<
    | ApiSuccess<{
        registration: { id: string; activityId: string; createdAt: string };
      }>
    | ApiErr
  >(res);
  if (!res.ok) {
    const err = body as ApiErr;
    const error = new Error(err.error?.message ?? "报名失败") as RegisterError;
    error.code = err.error?.code;
    throw error;
  }
  return (
    body as ApiSuccess<{
      registration: { id: string; activityId: string; createdAt: string };
    }>
  ).data.registration;
}

export async function fetchActivityRegistered(
  activityId: string,
): Promise<boolean> {
  const res = await fetch(`/api/v1/activities/${activityId}/registration`, {
    cache: "no-store",
  });
  if (res.status === 401) return false;
  if (!res.ok) throw new Error("查询报名状态失败");
  const body = await parseJson<ApiSuccess<{ registered: boolean }>>(res);
  return body.data.registered;
}
