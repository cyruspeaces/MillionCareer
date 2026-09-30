import { fail, ok } from "@/server/http";
import { getSessionUserId } from "@/server/auth";
import { bindBankCard, getBankCard } from "@/server/bank/service";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return fail("UNAUTHORIZED", "未登录", 401);

  try {
    const bankCard = await getBankCard(userId);
    return ok({ bankCard });
  } catch (error) {
    console.error("[me/bank-card] get", error);
    return fail("BANK_CARD_FAILED", "读取银行卡信息失败", 500);
  }
}

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return fail("UNAUTHORIZED", "未登录", 401);

  let body: {
    name?: string;
    idCard?: string;
    accountNo?: string;
    mobile?: string;
    agreed?: boolean;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return fail("BAD_REQUEST", "请求体无效");
  }

  if (body.agreed !== true) {
    return fail("AGREEMENT_REQUIRED", "请先阅读并勾选协议");
  }

  try {
    const result = await bindBankCard(userId, {
      name: body.name ?? "",
      idCard: body.idCard ?? "",
      accountNo: body.accountNo ?? "",
      mobile: body.mobile ?? "",
    });
    if (!result.ok) {
      return fail("BANK_CARD_REJECTED", result.message);
    }
    return ok({ bankCard: result.bankCard });
  } catch (error) {
    console.error("[me/bank-card] bind", error);
    return fail("BANK_CARD_FAILED", "绑定失败，请稍后重试", 500);
  }
}
