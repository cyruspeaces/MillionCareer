export type BankCardView = {
  holderName: string;
  idCardMask: string;
  cardMask: string;
  mobileMask: string;
  bankName: string | null;
  cardType: string | null;
  cardName: string | null;
  verifiedAt: string;
};

type ApiOk<T> = { data: T };
type ApiErr = { error: { code: string; message: string } };

export async function fetchMyBankCard(): Promise<BankCardView | null> {
  const res = await fetch("/api/v1/me/bank-card", {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return null;
  const body = (await res.json()) as ApiOk<{ bankCard: BankCardView | null }>;
  return body.data.bankCard;
}

export async function bindMyBankCard(input: {
  name: string;
  idCard: string;
  accountNo: string;
  mobile: string;
  agreed: boolean;
}): Promise<{ ok: boolean; message: string; bankCard?: BankCardView }> {
  const res = await fetch("/api/v1/me/bank-card", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });
  const body = (await res.json()) as
    | ApiOk<{ bankCard: BankCardView }>
    | ApiErr;
  if (!res.ok || "error" in body) {
    return {
      ok: false,
      message: "error" in body ? body.error.message : "绑定失败，请稍后重试",
    };
  }
  return { ok: true, message: "银行卡已绑定", bankCard: body.data.bankCard };
}

export function bankCardTagLabel(card: BankCardView) {
  const last4 = card.cardMask.replace(/\D/g, "").slice(-4);
  const bank = card.bankName ? `${card.bankName} ` : "";
  return `已绑定 · ${bank}${last4}`;
}
