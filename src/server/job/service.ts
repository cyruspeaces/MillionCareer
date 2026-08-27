import { prisma } from "@/server/db";
import { toJobView, type JobRowForView } from "@/server/job/mapper";
import type { JobView } from "@/types/job";

function asRow(row: unknown): JobRowForView {
  return row as JobRowForView;
}

const publicWhere = {
  status: "OPEN" as const,
  listed: true,
};

/** 列表：仅上架且在招 */
export async function listJobs(campaign?: string): Promise<JobView[]> {
  const rows = await prisma.job.findMany({
    where: campaign ? { ...publicWhere, campaign } : publicWhere,
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return rows.map((row) => toJobView(asRow(row)));
}

export async function getJobById(id: string): Promise<JobView | null> {
  const row = await prisma.job.findUnique({ where: { id } });
  if (!row || row.status !== "OPEN" || !row.listed) return null;
  return toJobView(asRow(row));
}
