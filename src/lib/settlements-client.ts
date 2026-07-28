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
  earnedTotal: number;
  earnedMonth: number;
  pendingTotal: number;
  paidCount: number;
};

export type MySettlementsResult = {
  summary: SettlementSummary;
  items: SettlementDto[];
};

type ApiOk<T> = { data: T };

const empty: MySettlementsResult = {
  summary: {
    earnedTotal: 0,
    earnedMonth: 0,
    pendingTotal: 0,
    paidCount: 0,
  },
  items: [],
};

/** 我的结算；未登录返回空汇总 */
export async function fetchMySettlements(): Promise<MySettlementsResult> {
  const res = await fetch("/api/v1/settlements/me", { cache: "no-store" });
  if (res.status === 401) return empty;
  if (!res.ok) throw new Error("获取结算失败");
  const body = (await res.json()) as ApiOk<MySettlementsResult>;
  return body.data;
}

export function formatMoney(amount: number): string {
  const fixed = amount.toFixed(2);
  const [intPart, dec] = fixed.split(".");
  const withComma = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec === "00" ? `¥${withComma}` : `¥${withComma}.${dec}`;
}
