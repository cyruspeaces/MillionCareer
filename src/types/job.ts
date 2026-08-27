/** 岗位列表 / 详情前端视图 */

export type JobView = {
  id: string;
  campaign: string;
  campaignLabel: string;
  title: string;
  summary: string;
  description: string;
  department: string;
  jobType: string;
  location: string;
  locationNote: string;
  headcount: string;
  salaryText: string;
  publisherName: string;
  publisherNote: string;
  requirements: string[];
  status: string;
  statusLabel: string;
};
