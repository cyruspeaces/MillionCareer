import { prisma } from "@/server/db";
import { toTaskView, type TaskRowForView } from "@/server/task/mapper";
import type { TaskView } from "@/types/task";

const taskInclude = {
  taskSkills: {
    include: { skill: { select: { name: true, sortOrder: true } } },
  },
  applications: {
    take: 8,
    orderBy: { createdAt: "asc" as const },
    include: {
      user: { select: { nickname: true } },
    },
  },
  _count: { select: { applications: true } },
} as const;

function asRow(row: unknown): TaskRowForView {
  return row as TaskRowForView;
}

/** 列表：招募中优先，再按截止时间升序 */
export async function listTasks(options?: {
  category?: string;
}): Promise<TaskView[]> {
  const category = options?.category?.trim();
  const rows = await prisma.task.findMany({
    where: {
      status: { in: ["RECRUITING", "IN_PROGRESS"] },
      ...(category && category !== "全部" ? { category } : {}),
    },
    include: taskInclude,
    orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
  });
  return rows.map((row) => toTaskView(asRow(row)));
}

export async function getTaskById(id: string): Promise<TaskView | null> {
  const row = await prisma.task.findUnique({
    where: { id },
    include: taskInclude,
  });
  if (!row) return null;
  return toTaskView(asRow(row));
}

export type ApplyResult = {
  id: string;
  taskId: string;
  createdAt: string;
};

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

export class ApplyError extends Error {
  constructor(
    public code:
      | "NOT_FOUND"
      | "TASK_NOT_OPEN"
      | "QUOTA_FULL"
      | "SKILL_REQUIRED"
      | "ALREADY_APPLIED",
    message: string,
    public details?: { missingSkills?: string[] },
  ) {
    super(message);
    this.name = "ApplyError";
  }
}

/**
 * 报名领取任务（一期只写 TaskApplication；交付/验收/结算走私域）
 * 门槛：任务招募中 + 名额未满 + required TaskSkill 均已点亮
 */
export async function applyToTask(
  userId: string,
  taskId: string,
  note?: string,
): Promise<ApplyResult> {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      taskSkills: {
        where: { required: true },
        include: { skill: { select: { id: true, name: true } } },
      },
      _count: { select: { applications: true } },
    },
  });

  if (!task) {
    throw new ApplyError("NOT_FOUND", "任务不存在");
  }
  if (task.status !== "RECRUITING") {
    throw new ApplyError("TASK_NOT_OPEN", "当前任务不在招募中，暂不可报名");
  }
  if (task.quota != null && task._count.applications >= task.quota) {
    throw new ApplyError("QUOTA_FULL", "名额已满");
  }

  const existing = await prisma.taskApplication.findUnique({
    where: { taskId_userId: { taskId, userId } },
  });
  if (existing) {
    throw new ApplyError("ALREADY_APPLIED", "你已报名过该任务");
  }

  const required = task.taskSkills;
  if (required.length > 0) {
    const owned = await prisma.userSkill.findMany({
      where: {
        userId,
        skillId: { in: required.map((ts) => ts.skill.id) },
      },
      select: { skillId: true },
    });
    const ownedSet = new Set(owned.map((r) => r.skillId));
    const missingSkills = required
      .filter((ts) => !ownedSet.has(ts.skill.id))
      .map((ts) => ts.skill.name);
    if (missingSkills.length > 0) {
      throw new ApplyError(
        "SKILL_REQUIRED",
        `还需点亮：${missingSkills.join("、")}`,
        { missingSkills },
      );
    }
  }

  const created = await prisma.taskApplication.create({
    data: {
      taskId,
      userId,
      note: note?.trim() || null,
    },
  });

  return {
    id: created.id,
    taskId: created.taskId,
    createdAt: created.createdAt.toISOString(),
  };
}

/** 当前用户是否已报名某任务 */
export async function hasApplied(
  userId: string,
  taskId: string,
): Promise<boolean> {
  const row = await prisma.taskApplication.findUnique({
    where: { taskId_userId: { taskId, userId } },
    select: { id: true },
  });
  return Boolean(row);
}

/** 当前用户的报名列表（我的任务） */
export async function listMyApplications(
  userId: string,
): Promise<MyApplicationDto[]> {
  const rows = await prisma.taskApplication.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      task: {
        select: {
          title: true,
          category: true,
          rewardText: true,
          status: true,
        },
      },
    },
  });

  const statusLabel: Record<string, string> = {
    DRAFT: "草稿",
    RECRUITING: "招募中",
    IN_PROGRESS: "进行中",
    SUBMITTED: "待验收",
    ACCEPTED: "已通过",
    REJECTED: "未通过",
    SETTLED: "已结算",
    CLOSED: "已关闭",
  };

  return rows.map((r) => ({
    id: r.id,
    taskId: r.taskId,
    note: r.note,
    createdAt: r.createdAt.toISOString(),
    task: {
      title: r.task.title,
      category: r.task.category ?? "未分类",
      reward: r.task.rewardText ?? "报酬面议",
      status: statusLabel[r.task.status] ?? r.task.status,
    },
  }));
}
