import crypto from "node:crypto";

function encryptionKey(): Buffer {
  const raw =
    process.env.BANK_CARD_ENC_KEY?.trim() ||
    process.env.JWT_SECRET?.trim() ||
    "";
  if (!raw) {
    throw new Error("缺少 JWT_SECRET，无法加密银行卡信息");
  }
  return crypto.createHash("sha256").update(raw, "utf8").digest();
}

/** AES-256-GCM。格式：iv.tag.ciphertext（均为 base64） */
export function encryptSecret(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const data = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [
    iv.toString("base64"),
    tag.toString("base64"),
    data.toString("base64"),
  ].join(".");
}

export function decryptSecret(payload: string): string {
  const [ivB64, tagB64, dataB64] = payload.split(".");
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error("密文格式无效");
  }
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    Buffer.from(ivB64, "base64"),
  );
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64")),
    decipher.final(),
  ]).toString("utf8");
}
