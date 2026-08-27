/**
 * 把本地 Job 表导出为可在生产库执行的 SQL
 * 运行：npx tsx scripts/export-jobs-sql.mjs
 */
import fs from "node:fs";
import path from "node:path";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";

function sqlStr(v) {
  if (v == null) return "NULL";
  return `'${String(v).replace(/'/g, "''")}'`;
}

function sqlArr(arr) {
  if (!arr || arr.length === 0) return "ARRAY[]::TEXT[]";
  return `ARRAY[${arr.map((s) => sqlStr(s)).join(", ")}]`;
}

function sqlTs(d) {
  if (!d) return "NULL";
  return `'${new Date(d).toISOString()}'`;
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const jobs = await prisma.job.findMany({
  orderBy: { sortOrder: "asc" },
});

await prisma.$disconnect();

const lines = [
  "-- 岗位表 + 当前库内岗位数据（可在生产 PostgreSQL 直接执行）",
  "-- 幂等：表已存在会跳过；岗位按 id upsert",
  "",
  'DO $$ BEGIN',
  "  CREATE TYPE \"JobStatus\" AS ENUM ('DRAFT', 'OPEN', 'CLOSED');",
  "EXCEPTION",
  "  WHEN duplicate_object THEN NULL;",
  "END $$;",
  "",
  'CREATE TABLE IF NOT EXISTS "Job" (',
  '    "id" TEXT NOT NULL,',
  '    "campaign" TEXT NOT NULL,',
  '    "title" TEXT NOT NULL,',
  '    "summary" TEXT,',
  '    "description" TEXT NOT NULL,',
  '    "department" TEXT,',
  '    "jobType" TEXT,',
  '    "location" TEXT,',
  '    "locationNote" TEXT,',
  '    "headcount" INTEGER,',
  '    "salaryText" TEXT,',
  '    "publisherName" TEXT NOT NULL,',
  '    "publisherNote" TEXT,',
  '    "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],',
  '    "status" "JobStatus" NOT NULL DEFAULT \'DRAFT\',',
  '    "listed" BOOLEAN NOT NULL DEFAULT false,',
  '    "sortOrder" INTEGER NOT NULL DEFAULT 0,',
  '    "publishedAt" TIMESTAMP(3),',
  '    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,',
  '    "updatedAt" TIMESTAMP(3) NOT NULL,',
  '    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")',
  ");",
  "",
  'CREATE INDEX IF NOT EXISTS "Job_status_listed_campaign_idx" ON "Job"("status", "listed", "campaign");',
  'CREATE INDEX IF NOT EXISTS "Job_jobType_idx" ON "Job"("jobType");',
  'CREATE INDEX IF NOT EXISTS "Job_location_idx" ON "Job"("location");',
  "",
];

for (const j of jobs) {
  lines.push(
    'INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")',
    `VALUES (${[
      sqlStr(j.id),
      sqlStr(j.campaign),
      sqlStr(j.title),
      sqlStr(j.summary),
      sqlStr(j.description),
      sqlStr(j.department),
      sqlStr(j.jobType),
      sqlStr(j.location),
      sqlStr(j.locationNote),
      j.headcount == null ? "NULL" : String(j.headcount),
      sqlStr(j.salaryText),
      sqlStr(j.publisherName),
      sqlStr(j.publisherNote),
      sqlArr(j.requirements),
      sqlStr(j.status),
      j.listed ? "true" : "false",
      String(j.sortOrder ?? 0),
      sqlTs(j.publishedAt),
      sqlTs(j.createdAt),
      sqlTs(j.updatedAt),
    ].join(",")})`,
    'ON CONFLICT ("id") DO UPDATE SET',
    `"campaign"=EXCLUDED."campaign",`,
    `"title"=EXCLUDED."title",`,
    `"summary"=EXCLUDED."summary",`,
    `"description"=EXCLUDED."description",`,
    `"department"=EXCLUDED."department",`,
    `"jobType"=EXCLUDED."jobType",`,
    `"location"=EXCLUDED."location",`,
    `"locationNote"=EXCLUDED."locationNote",`,
    `"headcount"=EXCLUDED."headcount",`,
    `"salaryText"=EXCLUDED."salaryText",`,
    `"publisherName"=EXCLUDED."publisherName",`,
    `"publisherNote"=EXCLUDED."publisherNote",`,
    `"requirements"=EXCLUDED."requirements",`,
    `"status"=EXCLUDED."status",`,
    `"listed"=EXCLUDED."listed",`,
    `"sortOrder"=EXCLUDED."sortOrder",`,
    `"publishedAt"=EXCLUDED."publishedAt",`,
    `"updatedAt"=EXCLUDED."updatedAt";`,
    "",
  );
}

const out = path.resolve("scripts/jobs-prod.sql");
fs.writeFileSync(out, lines.join("\n"), "utf8");
console.log(`已写出 ${jobs.length} 条岗位 -> ${out}`);
