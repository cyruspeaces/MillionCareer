import type { JobView } from "@/types/job";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "草稿",
  OPEN: "招聘中",
  CLOSED: "已停招",
};

const CAMPAIGN_LABEL: Record<string, string> = {
  tencent: "腾讯招聘",
};

export type JobRowForView = {
  id: string;
  campaign: string;
  title: string;
  summary: string | null;
  description: string;
  department: string | null;
  jobType: string | null;
  location: string | null;
  locationNote: string | null;
  headcount: number | null;
  salaryText: string | null;
  publisherName: string;
  publisherNote: string | null;
  requirements: string[];
  status: string;
};

function formatHeadcount(n: number | null): string {
  if (n == null) return "人数面议";
  if (n <= 0) return "名额待定";
  return `${n} 人`;
}

export function toJobView(row: JobRowForView): JobView {
  return {
    id: row.id,
    campaign: row.campaign,
    campaignLabel: CAMPAIGN_LABEL[row.campaign] ?? row.campaign,
    title: row.title,
    summary: row.summary ?? "",
    description: row.description,
    department: row.department ?? "",
    jobType: row.jobType ?? "其他",
    location: row.location ?? "地点待定",
    locationNote: row.locationNote ?? "",
    headcount: formatHeadcount(row.headcount),
    salaryText: row.salaryText?.trim() || "面议",
    publisherName: row.publisherName,
    publisherNote: row.publisherNote ?? "",
    requirements: Array.isArray(row.requirements) ? row.requirements : [],
    status: row.status,
    statusLabel: STATUS_LABEL[row.status] ?? row.status,
  };
}
