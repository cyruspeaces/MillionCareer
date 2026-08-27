import type { JobView } from "@/types/job";

type ApiSuccess<T> = { data: T };

export async function fetchJobs(campaign?: string): Promise<JobView[]> {
  const qs = campaign ? `?campaign=${encodeURIComponent(campaign)}` : "";
  const res = await fetch(`/api/v1/jobs${qs}`, { cache: "no-store" });
  if (!res.ok) throw new Error("获取岗位列表失败");
  const body = (await res.json()) as ApiSuccess<JobView[]>;
  return body.data;
}

export async function fetchJobById(id: string): Promise<JobView | null> {
  const res = await fetch(`/api/v1/jobs/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("获取岗位详情失败");
  const body = (await res.json()) as ApiSuccess<JobView>;
  return body.data;
}
