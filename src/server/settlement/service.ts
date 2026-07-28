import { prisma } from "@/server/db";

export type SettlementDto = {
  id: string;
  taskId: string | null;
  taskTitle: string | null;
  amount: number | null;
  note: string | null;
  status: "PENDING" | "PAID" | "CANCELLED";
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
};

export type SettlementSummary = {
  /** 已打款合计 */
  earnedTotal: number;
  /** 本月已打款（按 updatedAt，运营改成 PAID 的时间） */
  earnedMonth: number;
  /** 待结算合计 */
  pendingTotal: number;
  /** 已打款笔数（视作完成任务数） */
  paidCount: number;
};

export type MySettlementsResult = {
  summary: SettlementSummary;
  items: SettlementDto[];
};

const STATUS_LABEL: Record<SettlementDto["status"], string> = {
  PENDING: "待结算",
  PAID: "已打款",
  CANCELLED: "已取消",
};

function toAmount(value: { toString(): string } | null): number | null {
  if (value == null) return null;
  const n = Number(value.toString());
  return Number.isFinite(n) ? n : null;
}

function startOfMonth(d = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** 当前用户结算汇总 + 流水（运营可在库里增改 Settlement） */
export async function listMySettlements(
  userId: string,
): Promise<MySettlementsResult> {
  const rows = await prisma.settlement.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      task: { select: { title: true } },
    },
  });

  const monthStart = startOfMonth();
  let earnedTotal = 0;
  let earnedMonth = 0;
  let pendingTotal = 0;
  let paidCount = 0;

  const items: SettlementDto[] = rows.map((r) => {
    const amount = toAmount(r.amount);
    const status = r.status as SettlementDto["status"];

    if (status === "PAID" && amount != null) {
      earnedTotal += amount;
      paidCount += 1;
      if (r.updatedAt >= monthStart) {
        earnedMonth += amount;
      }
    } else if (status === "PENDING" && amount != null) {
      pendingTotal += amount;
    }

    return {
      id: r.id,
      taskId: r.taskId,
      taskTitle: r.task?.title ?? null,
      amount,
      note: r.note,
      status,
      statusLabel: STATUS_LABEL[status] ?? r.status,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  });

  return {
    summary: {
      earnedTotal,
      earnedMonth,
      pendingTotal,
      paidCount,
    },
    items,
  };
}
