import type { ActivityTone, ActivityView } from "@/types/activity";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "草稿",
  OPEN: "进行中",
  JUDGING: "评审中",
  PUBLISHED: "已公示",
  CLOSED: "已结束",
};

const VALID_TONES = new Set<ActivityTone>(["primary", "accent", "mix"]);

export type ActivityRowForView = {
  id: string;
  title: string;
  summary: string | null;
  description: string;
  category: string | null;
  benefits: string | null;
  benefitItems: string[];
  rules: string | null;
  timeline: string[];
  howToJoin: string[];
  requirements: string[];
  judgingNote: string | null;
  status: string;
  tone: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
  quota: number | null;
  rewardSkillCodes: string[];
  _count?: { registrations: number };
};

function formatDate(d: Date | null): string {
  if (!d) return "待定";
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${m}-${day}`;
}

function deadlineHint(endsAt: Date | null, status: string): string {
  if (status !== "OPEN") {
    return STATUS_LABEL[status] ?? status;
  }
  if (!endsAt) return "进行中";
  const now = new Date();
  const ms = endsAt.getTime() - now.getTime();
  const days = Math.ceil(ms / (24 * 60 * 60 * 1000));
  if (days < 0) return "已截止";
  if (days === 0) return "今天截止";
  if (days === 1) return "距截止 1 天";
  return `距截止 ${days} 天`;
}

function formatQuota(quota: number | null, joined: number): string {
  if (quota == null) return "名额不限";
  const remain = Math.max(quota - joined, 0);
  return `余 ${remain} 名`;
}

function toTone(raw: string | null): ActivityTone {
  if (raw && VALID_TONES.has(raw as ActivityTone)) {
    return raw as ActivityTone;
  }
  return "primary";
}

function asStringArray(value: string[] | null | undefined): string[] {
  return Array.isArray(value) ? value : [];
}

export function toActivityView(row: ActivityRowForView): ActivityView {
  const joinedCount = row._count?.registrations ?? 0;
  const benefitItems = asStringArray(row.benefitItems);
  const timeline = asStringArray(row.timeline);
  const howToJoin = asStringArray(row.howToJoin);
  const requirements = asStringArray(row.requirements);
  const rewardSkillCodes = asStringArray(row.rewardSkillCodes);
  const benefitFromItems =
    benefitItems.length > 0 ? benefitItems.join(" · ") : "";
  const benefit = row.benefits?.trim() || benefitFromItems || "权益详见活动说明";
  const canRegister =
    row.status === "OPEN" &&
    (row.quota == null || joinedCount < row.quota);

  return {
    id: row.id,
    title: row.title,
    summary: row.summary ?? "",
    description: row.description,
    category: row.category ?? "活动",
    benefit,
    benefitItems,
    rules: row.rules ?? "",
    timeline,
    howToJoin,
    requirements,
    judgingNote: row.judgingNote ?? "",
    status: row.status,
    statusLabel: `${STATUS_LABEL[row.status] ?? row.status} · ${deadlineHint(row.endsAt, row.status)}`,
    tone: toTone(row.tone),
    startsAtLabel: formatDate(row.startsAt),
    endsAtLabel: formatDate(row.endsAt),
    deadlineHint: deadlineHint(row.endsAt, row.status),
    quota: formatQuota(row.quota, joinedCount),
    joinedCount,
    rewardSkillCodes,
    canRegister,
  };
}
