import { prisma } from "@/server/db";
import { decryptSecret, encryptSecret } from "@/server/bank/crypto";
import { verifyBankCard4 } from "@/server/bank/verify";

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

export type BindBankCardInput = {
  name: string;
  idCard: string;
  accountNo: string;
  mobile: string;
};

const ID_WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
const ID_CHECK_CODES = "10X98765432";

export function normalizeHolderName(raw: string) {
  return raw.replace(/\s+/g, "").trim();
}

export function isValidHolderName(name: string) {
  return /^[\u4e00-\u9fa5·]{2,20}$/.test(name);
}

export function isValidChineseId(raw: string) {
  const id = raw.trim().toUpperCase();
  if (!/^\d{17}[\dX]$/.test(id)) return false;
  let sum = 0;
  for (let i = 0; i < 17; i += 1) {
    sum += Number(id[i]) * ID_WEIGHTS[i];
  }
  return ID_CHECK_CODES[sum % 11] === id[17];
}

export function isValidBankCard(raw: string) {
  if (!/^\d{16,19}$/.test(raw)) return false;
  let sum = 0;
  let doubleIt = false;
  for (let i = raw.length - 1; i >= 0; i -= 1) {
    let digit = Number(raw[i]);
    if (doubleIt) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleIt = !doubleIt;
  }
  return sum % 10 === 0;
}

export function isValidMobile(raw: string) {
  return /^1[3-9]\d{9}$/.test(raw);
}

export function maskIdCard(id: string) {
  return `${id.slice(0, 3)}***********${id.slice(-4)}`;
}

export function maskBankCard(accountNo: string) {
  return `**** **** **** ${accountNo.slice(-4)}`;
}

export function maskMobile(mobile: string) {
  return `${mobile.slice(0, 3)}****${mobile.slice(-4)}`;
}

function toView(row: {
  holderName: string;
  idCardMask: string;
  cardMask: string;
  mobileMask: string;
  bankName: string | null;
  cardType: string | null;
  cardName: string | null;
  verifiedAt: Date;
}): BankCardView {
  return {
    holderName: row.holderName,
    idCardMask: row.idCardMask,
    cardMask: row.cardMask,
    mobileMask: row.mobileMask,
    bankName: row.bankName,
    cardType: row.cardType,
    cardName: row.cardName,
    verifiedAt: row.verifiedAt.toISOString(),
  };
}

export async function getBankCard(userId: string): Promise<BankCardView | null> {
  const row = await prisma.bankCardBinding.findUnique({ where: { userId } });
  return row ? toView(row) : null;
}

export async function bindBankCard(
  userId: string,
  input: BindBankCardInput,
): Promise<{ ok: true; bankCard: BankCardView } | { ok: false; message: string }> {
  const name = normalizeHolderName(input.name);
  const idCard = input.idCard.trim().toUpperCase();
  const accountNo = input.accountNo.replace(/\s+/g, "");
  const mobile = input.mobile.trim();

  if (!isValidHolderName(name)) {
    return { ok: false, message: "请填写持卡人真实姓名" };
  }
  if (!isValidChineseId(idCard)) {
    return { ok: false, message: "身份证号格式不正确" };
  }
  if (!isValidBankCard(accountNo)) {
    return { ok: false, message: "银行卡号格式不正确" };
  }
  if (!isValidMobile(mobile)) {
    return { ok: false, message: "请填写银行预留手机号" };
  }

  const existing = await prisma.bankCardBinding.findUnique({
    where: { userId },
  });
  if (existing) {
    try {
      const same =
        decryptSecret(existing.accountNoEnc) === accountNo &&
        decryptSecret(existing.idCardEnc) === idCard &&
        decryptSecret(existing.mobileEnc) === mobile &&
        existing.holderName === name;
      if (same) return { ok: true, bankCard: toView(existing) };
    } catch (error) {
      console.error("[bank-card] decrypt existing failed", error);
    }
  }

  const verified = await verifyBankCard4({ name, idCard, accountNo, mobile });
  if (!verified.ok) return verified;

  const saved = await prisma.bankCardBinding.upsert({
    where: { userId },
    create: {
      userId,
      holderName: name,
      idCardEnc: encryptSecret(idCard),
      accountNoEnc: encryptSecret(accountNo),
      mobileEnc: encryptSecret(mobile),
      idCardMask: maskIdCard(idCard),
      cardMask: maskBankCard(accountNo),
      mobileMask: maskMobile(mobile),
      bankName: verified.bankName,
      cardType: verified.cardType,
      cardName: verified.cardName,
    },
    update: {
      holderName: name,
      idCardEnc: encryptSecret(idCard),
      accountNoEnc: encryptSecret(accountNo),
      mobileEnc: encryptSecret(mobile),
      idCardMask: maskIdCard(idCard),
      cardMask: maskBankCard(accountNo),
      mobileMask: maskMobile(mobile),
      bankName: verified.bankName,
      cardType: verified.cardType,
      cardName: verified.cardName,
      verifiedAt: new Date(),
    },
  });

  return { ok: true, bankCard: toView(saved) };
}
