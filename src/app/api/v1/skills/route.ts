import { fail, ok } from "@/server/http";
import { listSkillCatalog } from "@/server/skill/service";

/** GET /api/v1/skills — 技能树目录（公开） */
export async function GET() {
  try {
    const skills = await listSkillCatalog();
    return ok({ skills });
  } catch (e) {
    console.error("[GET /api/v1/skills]", e);
    return fail("INTERNAL_ERROR", "获取技能目录失败", 500);
  }
}
