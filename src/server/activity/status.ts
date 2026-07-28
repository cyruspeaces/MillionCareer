/** 活动状态机（服务端权威） */
export const ACTIVITY_STATUSES = [
  "DRAFT",
  "OPEN",
  "JUDGING",
  "PUBLISHED",
  "CLOSED",
] as const;

export type ActivityStatusCode = (typeof ACTIVITY_STATUSES)[number];

export const ACTIVITY_TRANSITIONS: Record<
  ActivityStatusCode,
  ActivityStatusCode[]
> = {
  DRAFT: ["OPEN", "CLOSED"],
  OPEN: ["JUDGING", "CLOSED"],
  JUDGING: ["PUBLISHED", "CLOSED"],
  PUBLISHED: ["CLOSED"],
  CLOSED: [],
};

export function canTransitionActivity(
  from: ActivityStatusCode,
  to: ActivityStatusCode,
): boolean {
  return ACTIVITY_TRANSITIONS[from]?.includes(to) ?? false;
}
