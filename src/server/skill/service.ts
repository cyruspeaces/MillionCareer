import { prisma } from "@/server/db";
import type { SkillCatalogItem } from "@/types/skill";

/** 全站技能目录（活跃节点，按 sortOrder） */
export async function listSkillCatalog(): Promise<SkillCatalogItem[]> {
  const rows = await prisma.skill.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      code: true,
      name: true,
      desc: true,
      group: true,
      kind: true,
      tier: true,
      canGateTask: true,
      sortOrder: true,
    },
  });

  return rows.map((r) => ({
    code: r.code,
    name: r.name,
    desc: r.desc ?? "",
    group: r.group,
    kind: r.kind,
    tier: r.tier,
    canGateTask: r.canGateTask,
    sortOrder: r.sortOrder,
  }));
}
