export type ActivityTone = "primary" | "accent" | "mix";

/** 活动列表 / 详情前端视图 */
export type ActivityView = {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  benefit: string;
  benefitItems: string[];
  rules: string;
  timeline: string[];
  howToJoin: string[];
  requirements: string[];
  judgingNote: string;
  status: string;
  statusLabel: string;
  tone: ActivityTone;
  startsAtLabel: string;
  endsAtLabel: string;
  deadlineHint: string;
  quota: string;
  joinedCount: number;
  rewardSkillCodes: string[];
  /** 是否仍可报名（OPEN 且名额未满） */
  canRegister: boolean;
};
