/** 技能目录节点（来自 Skill 表） */
export type SkillCatalogItem = {
  code: string;
  name: string;
  desc: string;
  group: string;
  kind: string;
  tier: number;
  canGateTask: boolean;
  sortOrder: number;
};

/** 技能树展示节点（目录 + 用户点亮态） */
export type SkillTreeNode = SkillCatalogItem & {
  lit: boolean;
  sourceLabel: string;
  unlockedAt?: string;
  actionHint?: string;
};

/** 赛道分组展示顺序 */
export const SKILL_GROUP_ORDER = [
  "起步与成长",
  "通用底座",
  "模型训练与数据",
  "内容与广告创意",
  "Agent 与评测",
] as const;
