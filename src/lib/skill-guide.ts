import type { SkillCatalogItem } from "@/types/skill";
import { getCachedSkillCatalog } from "@/lib/skills-client";

export type SkillGuideInfo = {
  name: string;
  desc: string;
  source: string;
  group: string;
  tier: number;
  actionHint?: string;
};

export type SkillGuideAction = {
  href: string;
  label: string;
};

/** 按 kind/tier 推导点亮途径文案（目录表无独立 source 字段） */
export function deriveSkillSource(kind: string, tier: number): string {
  const k = kind.toUpperCase();
  if (k === "MILESTONE") return "赚钱里程碑";
  if (tier >= 3) return "课程考核 / 履约";
  if (tier === 2) return "课程 / 任务";
  if (k === "QUALIFICATION") return "测评通过";
  return "测评 / 任务履约";
}

export function deriveSkillActionHint(kind: string, tier: number): string {
  const k = kind.toUpperCase();
  if (k === "MILESTONE") return "继续接单结算即可点亮";
  if (tier <= 1) return "去测评或完成任务后点亮";
  return "学习或完成相关任务后点亮";
}

function fromCatalog(item: SkillCatalogItem): SkillGuideInfo {
  return {
    name: item.name,
    desc: item.desc,
    source: deriveSkillSource(item.kind, item.tier),
    group: item.group,
    tier: item.tier,
    actionHint: deriveSkillActionHint(item.kind, item.tier),
  };
}

/** 按技能名取说明；优先用已缓存的目录 */
export function getSkillGuideInfo(name: string): SkillGuideInfo {
  const hit = getCachedSkillCatalog().find((s) => s.name === name);
  if (hit) return fromCatalog(hit);
  return {
    name,
    desc: "点亮后可用于报名要求该技能的任务。",
    source: "测评或任务履约",
    group: "通用",
    tier: 0,
    actionHint: "去测评或完成相关任务后点亮",
  };
}

export function resolveSkillGuideAction(
  info: Pick<SkillGuideInfo, "source" | "actionHint">,
  lit: boolean,
): SkillGuideAction {
  if (lit) {
    return { href: "/tasks", label: "去看可报名任务" };
  }

  const text = `${info.source}${info.actionHint ?? ""}`;
  if (text.includes("测评") || text.includes("评测")) {
    return { href: "/assessment", label: "去测评" };
  }
  if (text.includes("活动")) {
    return { href: "/activities", label: "去看活动" };
  }
  if (
    text.includes("里程碑") ||
    text.includes("接单") ||
    text.includes("结算") ||
    text.includes("任务") ||
    text.includes("履约")
  ) {
    return { href: "/tasks", label: "去任务广场" };
  }
  return { href: "/assessment", label: "去测评" };
}

export function catalogItemToGuide(item: SkillCatalogItem): SkillGuideInfo {
  return fromCatalog(item);
}
