import { ok } from "@/server/http";
import { clearSessionCookie } from "@/server/auth";

export async function POST() {
  await clearSessionCookie();
  return ok({ ok: true as const });
}
