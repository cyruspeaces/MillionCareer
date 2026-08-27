/**
 * 导入腾讯猎头岗位表（按序号 upsert 为 job-tencent-N）
 *
 * 运行（在 apps/web）：
 *   npx tsx scripts/import-jobs-xlsx.mjs "路径/腾讯猎头平台-岗位列表.xlsx"
 */
import path from "node:path";
import { createRequire } from "node:module";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";

const require = createRequire(import.meta.url);
const ExcelJS = require("exceljs");

const PUBLISHER_NOTE =
  "本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。";

function cellText(v) {
  if (v == null || v === "") return "";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "object") {
    if (typeof v.text === "string") return v.text;
    if (v.result != null) return cellText(v.result);
    if (v.richText) return v.richText.map((t) => t.text).join("");
    return String(v);
  }
  return String(v).trim();
}

function parseDate(raw) {
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw;
  const text = cellText(raw).replace(/^"+|"+$/g, "").trim();
  if (!text) return null;
  const d = new Date(text);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toSummary(description) {
  const first = description.split(/\n/)[0]?.trim() ?? "";
  if (!first) return null;
  return first.length > 80 ? `${first.slice(0, 80)}…` : first;
}

function locationNoteFromTitle(title) {
  const m = title.match(/（([^）]+)）/);
  return m ? m[1] : null;
}

const fileArg = process.argv[2];
if (!fileArg) {
  console.error("用法: npx tsx scripts/import-jobs-xlsx.mjs <xlsx路径>");
  process.exit(1);
}

const xlsxPath = path.resolve(fileArg);
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(xlsxPath);
const sheet = workbook.worksheets[0];

const headers = [];
sheet.getRow(1).eachCell((cell, col) => {
  headers[col] = cellText(cell.value);
});

const rows = [];
sheet.eachRow((row, i) => {
  if (i === 1) return;
  const rec = {};
  row.eachCell({ includeEmpty: true }, (cell, col) => {
    rec[headers[col]] = cell.value;
  });
  if (!cellText(rec["岗位名称"])) return;
  rows.push(rec);
});

if (rows.length === 0) {
  console.error("没有读到有效岗位行");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

let created = 0;
let updated = 0;

for (const rec of rows) {
  const seq = cellText(rec["序号"]) || String(rows.indexOf(rec) + 1);
  const id = `job-tencent-${seq}`;
  const title = cellText(rec["岗位名称"]);
  const statusRaw = cellText(rec["委托状态"]);
  const open = statusRaw === "跟进中";
  const description = cellText(rec["职位描述"]) || title;
  const hcRaw = cellText(rec["需求人数"]);
  const hc = hcRaw === "" ? null : Number.parseInt(hcRaw, 10);

  const data = {
    campaign: "tencent",
    title,
    summary: toSummary(description),
    description,
    department: cellText(rec["所属部门"]) || null,
    jobType: cellText(rec["职位类型"]) || null,
    location: cellText(rec["工作地点"]) || null,
    locationNote: locationNoteFromTitle(title),
    headcount: Number.isFinite(hc) ? hc : null,
    salaryText: "面议",
    publisherName: "腾讯",
    publisherNote: PUBLISHER_NOTE,
    requirements: [],
    status: open ? "OPEN" : "CLOSED",
    listed: open,
    sortOrder: Number.parseInt(seq, 10) || 0,
    publishedAt: parseDate(rec["发布时间"]),
  };

  const existing = await prisma.job.findUnique({ where: { id } });
  if (existing) {
    await prisma.job.update({ where: { id }, data });
    updated += 1;
    console.log(`更新 ${id}  ${open ? "上架" : "下架"}  ${title}`);
  } else {
    await prisma.job.create({ data: { id, ...data } });
    created += 1;
    console.log(`新增 ${id}  ${open ? "上架" : "下架"}  ${title}`);
  }
}

await prisma.$disconnect();
console.log(`完成：新增 ${created}，更新 ${updated}，合计 ${rows.length}`);
console.log(`文件：${xlsxPath}`);
