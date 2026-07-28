/** 任务列表/详情的前端视图（与当前 UI 字段对齐） */

export type TaskParticipant = {
  initials: string;
  color: string;
};

export type TaskStep = {
  label: string;
  done: boolean;
  tag?: string;
};

export type TaskReference = {
  label: string;
  href: string;
};

export type TaskView = {
  id: string;
  category: string;
  title: string;
  summary: string;
  reward: string;
  status: string;
  deadline: string;
  quota: string;
  joinedCount: number;
  participants: TaskParticipant[];
  workType: string;
  location: string;
  about: string;
  acceptance: string[];
  deliverables: string[];
  skills: string[];
  suitFor: string;
  publisher: string;
  publisherNote: string;
  steps: TaskStep[];
  specs: string[];
  requirements: string[];
  references: TaskReference[];
};
