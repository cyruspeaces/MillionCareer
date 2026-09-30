import type {
  TaskParticipant,
  TaskReference,
  TaskStep,
  TaskView,
} from "@/types/task";

const AVATAR_COLORS = [
  "#2F318B",
  "#F08519",
  "#5B6ABF",
  "#C96A10",
  "#3A3C9A",
  "#E8A04A",
  "#7A82C9",
  "#D67410",
  "#B86A20",
  "#25276F",
  "#4A3A7A",
  "#E08A2E",
];

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "草稿",
  RECRUITING: "招募中",
  IN_PROGRESS: "进行中",
  SUBMITTED: "待验收",
  ACCEPTED: "已通过",
  REJECTED: "未通过",
  SETTLED: "已结算",
  CLOSED: "已关闭",
};

export type TaskRowForView = {
  id: string;
  title: string;
  summary: string | null;
  description: string;
  category: string | null;
  rewardText: string | null;
  quota: number | null;
  deadline: Date | null;
  workType: string | null;
  location: string | null;
  suitFor: string | null;
  publisherName: string | null;
  publisherNote: string | null;
  deliverables: string[];
  acceptance: string[];
  specs: string[];
  requirements: string[];
  enrollSteps: string[];
  references: unknown;
  status: string;
  displayJoinedCount?: number;
  taskSkills: {
    skill: { name: string; sortOrder?: number };
    required: boolean;
  }[];
  applications: {
    user: { nickname: string | null };
  }[];
  _count: { applications: number };
};

function formatDeadline(deadline: Date | null): string {
  if (!deadline) return "截止时间待定";
  const m = String(deadline.getMonth() + 1).padStart(2, "0");
  const d = String(deadline.getDate()).padStart(2, "0");
  return `${m}-${d} 截止`;
}

function formatQuota(quota: number | null, realJoined: number): string {
  if (quota == null) return "名额不限";
  const remain = Math.max(quota - realJoined, 0);
  return `余 ${remain} 名`;
}

const PLACEHOLDER_PARTICIPANTS: TaskParticipant[] = [
  { initials: "林", color: AVATAR_COLORS[0] },
  { initials: "周", color: AVATAR_COLORS[1] },
  { initials: "陈", color: AVATAR_COLORS[2] },
  { initials: "黄", color: AVATAR_COLORS[3] },
  { initials: "刘", color: AVATAR_COLORS[4] },
  { initials: "吴", color: AVATAR_COLORS[5] },
];

function parseReferences(raw: unknown): TaskReference[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item): item is { label: string; href: string } =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as { label?: unknown }).label === "string" &&
        typeof (item as { href?: unknown }).href === "string",
    )
    .map((item) => ({ label: item.label, href: item.href }));
}

function toParticipants(
  applications: TaskRowForView["applications"],
  virtualJoined: number,
): TaskParticipant[] {
  const real = applications.slice(0, 8).map((app, i) => {
    const name = app.user.nickname?.trim() || "创";
    return {
      initials: name.slice(0, 1),
      color: AVATAR_COLORS[i % AVATAR_COLORS.length],
    };
  });
  if (real.length > 0 || virtualJoined <= 0) return real;
  return PLACEHOLDER_PARTICIPANTS;
}

/** 报名步骤：label 来自 enrollSteps；done 暂统一 false（报名状态机后按用户状态派生） */
function toSteps(enrollSteps: string[]): TaskStep[] {
  const labels =
    enrollSteps.length > 0
      ? enrollSteps
      : ["完善接单资料", "确认领取并开工"];

  return labels.map((label, index) => {
    const step: TaskStep = { label, done: false };
    if (index === 1 && labels.length >= 3) {
      if (label.includes("试标") || label.includes("试评")) step.tag = "必做";
      else if (label.includes("阅读") || label.includes("规范")) step.tag = "必读";
      else if (label.includes("小样") || label.includes("筛选")) step.tag = "筛选";
    }
    return step;
  });
}

export function toTaskView(row: TaskRowForView): TaskView {
  const realJoined = row._count.applications;
  const virtualJoined = row.displayJoinedCount ?? 0;
  const joinedCount = realJoined + virtualJoined;
  return {
    id: row.id,
    category: row.category ?? "未分类",
    title: row.title,
    summary: row.summary ?? "",
    reward: row.rewardText ?? "报酬面议",
    status: STATUS_LABEL[row.status] ?? row.status,
    deadline: formatDeadline(row.deadline),
    quota: formatQuota(row.quota, realJoined),
    joinedCount,
    participants: toParticipants(row.applications, virtualJoined),
    workType: row.workType ?? "远程",
    location: row.location ?? "不限地区",
    about: row.description,
    acceptance: row.acceptance,
    deliverables: row.deliverables,
    skills: [...row.taskSkills]
      .sort(
        (a, b) => (a.skill.sortOrder ?? 0) - (b.skill.sortOrder ?? 0),
      )
      .map((ts) => ts.skill.name),
    suitFor: row.suitFor ?? "",
    publisher: row.publisherName ?? "平台合作方",
    publisherNote: row.publisherNote ?? "",
    steps: toSteps(row.enrollSteps),
    specs: row.specs,
    requirements: row.requirements,
    references: parseReferences(row.references),
  };
}
