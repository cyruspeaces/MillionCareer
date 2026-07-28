import { prisma } from "@/server/db";
import {
  toActivityView,
  type ActivityRowForView,
} from "@/server/activity/mapper";
import type { ActivityView } from "@/types/activity";

const activityInclude = {
  _count: { select: { registrations: true } },
} as const;

function asRow(row: unknown): ActivityRowForView {
  return row as ActivityRowForView;
}

/** 列表：默认仅 OPEN，按截止时间升序 */
export async function listActivities(): Promise<ActivityView[]> {
  const rows = await prisma.activity.findMany({
    where: { status: "OPEN" },
    include: activityInclude,
    orderBy: [{ endsAt: "asc" }, { createdAt: "desc" }],
  });
  return rows.map((row) => toActivityView(asRow(row)));
}

export async function getActivityById(
  id: string,
): Promise<ActivityView | null> {
  const row = await prisma.activity.findUnique({
    where: { id },
    include: activityInclude,
  });
  if (!row) return null;
  return toActivityView(asRow(row));
}

export type RegisterResult = {
  id: string;
  activityId: string;
  createdAt: string;
};

export class RegisterError extends Error {
  constructor(
    public code:
      | "NOT_FOUND"
      | "ACTIVITY_NOT_OPEN"
      | "QUOTA_FULL"
      | "ALREADY_REGISTERED",
    message: string,
  ) {
    super(message);
    this.name = "RegisterError";
  }
}

/** 报名活动（一期只写 Registration；作品提交走私域） */
export async function registerActivity(
  userId: string,
  activityId: string,
): Promise<RegisterResult> {
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    include: { _count: { select: { registrations: true } } },
  });

  if (!activity) {
    throw new RegisterError("NOT_FOUND", "活动不存在");
  }
  if (activity.status !== "OPEN") {
    throw new RegisterError("ACTIVITY_NOT_OPEN", "当前活动不在报名期");
  }
  if (
    activity.quota != null &&
    activity._count.registrations >= activity.quota
  ) {
    throw new RegisterError("QUOTA_FULL", "名额已满");
  }

  const existing = await prisma.activityRegistration.findUnique({
    where: {
      activityId_userId: { activityId, userId },
    },
  });
  if (existing) {
    throw new RegisterError("ALREADY_REGISTERED", "你已报名过该活动");
  }

  const created = await prisma.activityRegistration.create({
    data: {
      activityId,
      userId,
      approved: true,
    },
  });

  return {
    id: created.id,
    activityId: created.activityId,
    createdAt: created.createdAt.toISOString(),
  };
}

export async function hasRegistered(
  userId: string,
  activityId: string,
): Promise<boolean> {
  const row = await prisma.activityRegistration.findUnique({
    where: {
      activityId_userId: { activityId, userId },
    },
    select: { id: true },
  });
  return Boolean(row);
}
