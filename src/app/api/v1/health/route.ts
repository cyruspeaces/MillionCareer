import { ok } from "@/server/http";

export async function GET() {
  return ok({
    service: "million-career",
    status: "ok",
    version: "0.1.0",
    timestamp: new Date().toISOString(),
  });
}
