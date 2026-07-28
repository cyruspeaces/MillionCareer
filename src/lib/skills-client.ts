import type { SkillCatalogItem } from "@/types/skill";

type ApiOk<T> = { data: T };

let catalogCache: SkillCatalogItem[] | null = null;
let catalogPromise: Promise<SkillCatalogItem[]> | null = null;

/** 拉取技能目录（带内存缓存） */
export async function fetchSkillCatalog(): Promise<SkillCatalogItem[]> {
  if (catalogCache) return catalogCache;
  if (catalogPromise) return catalogPromise;

  catalogPromise = (async () => {
    const res = await fetch("/api/v1/skills", { cache: "no-store" });
    if (!res.ok) throw new Error("获取技能目录失败");
    const body = (await res.json()) as ApiOk<{ skills: SkillCatalogItem[] }>;
    catalogCache = body.data.skills;
    return catalogCache;
  })();

  try {
    return await catalogPromise;
  } finally {
    catalogPromise = null;
  }
}

export function getCachedSkillCatalog(): SkillCatalogItem[] {
  return catalogCache ?? [];
}
