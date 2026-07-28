/** 商单状态机（服务端权威） */
export const TASK_STATUSES = [
  "DRAFT",
  "RECRUITING",
  "IN_PROGRESS",
  "SUBMITTED",
  "ACCEPTED",
  "REJECTED",
  "SETTLED",
  "CLOSED",
] as const;

export type TaskStatusCode = (typeof TASK_STATUSES)[number];

/** 允许的流转：from -> to[] */
export const TASK_TRANSITIONS: Record<TaskStatusCode, TaskStatusCode[]> = {
  DRAFT: ["RECRUITING", "CLOSED"],
  RECRUITING: ["IN_PROGRESS", "CLOSED"],
  IN_PROGRESS: ["SUBMITTED", "CLOSED"],
  SUBMITTED: ["ACCEPTED", "REJECTED"],
  ACCEPTED: ["SETTLED", "CLOSED"],
  REJECTED: ["IN_PROGRESS", "CLOSED"],
  SETTLED: ["CLOSED"],
  CLOSED: [],
};

export function canTransitionTask(
  from: TaskStatusCode,
  to: TaskStatusCode,
): boolean {
  return TASK_TRANSITIONS[from]?.includes(to) ?? false;
}
