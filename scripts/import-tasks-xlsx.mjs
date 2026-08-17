/**
 * 把运营回传的「任务数据填报」xlsx 写入数据库（按内部编号或标题 upsert）
 *
 * 运行（在 apps/web）：
 *   npx tsx scripts/import-tasks-xlsx.mjs "路径/任务数据填报模板.xlsx"
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../src/generated/prisma/client.ts";

const require = createRequire(import.meta.url);
const ExcelJS = require("exceljs");

const STATUS_MAP = {
  草稿: "DRAFT",
  招募中: "RECRUITING",
  DRAFT: "DRAFT",
  RECRUITING: "RECRUITING",
};

const DEMO_OWNER_ID = "demo-task-owner";

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

function splitPipe(raw) {
  return cellText(raw)
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseRefs(raw) {
  const text = cellText(raw);
  if (!text) return [];
  return text
    .split(/[;；]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [label, href] = part.split("|").map((s) => s.trim());
      return { label: label || "参考资料", href: href || "#" };
    });
}

function parseAmount(raw, rewardText) {
  const text = cellText(raw).replace(/,/g, "");
  if (text && !Number.isNaN(Number(text))) return Number(text);
  const range = text.match(/(\d+(?:\.\d+)?)\s*[~～-]\s*(\d+(?:\.\d+)?)/);
  if (range) return Number(range[2]);
  const fromText = cellText(rewardText).replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  if (fromText) return Number(fromText[1]);
  return null;
}

function parseDeadline(raw) {
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw;
  let text = cellText(raw).replace(/^"+|"+$/g, "").trim();
  if (!text) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return new Date(`${text}T23:59:59+08:00`);
  }
  const d = new Date(text);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseStatus(raw) {
  const key = cellText(raw);
  return STATUS_MAP[key] ?? "DRAFT";
}

async function ensureOwner(prisma) {
  const existing = await prisma.user.findUnique({ where: { id: DEMO_OWNER_ID } });
  if (existing) return existing.id;
  const any = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  if (any) return any.id;
  throw new Error("库中没有可用发包方账号，请先执行一次 prisma db seed");
}

const fileArg = process.argv[2];
if (!fileArg) {
  console.error("用法: npx tsx scripts/import-tasks-xlsx.mjs <xlsx路径>");
  process.exit(1);
}

const xlsxPath = path.resolve(fileArg);
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(xlsxPath);
const sheet =
  workbook.worksheets.find((s) => s.name.includes("任务填报")) ??
  workbook.worksheets[0];

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
  if (!cellText(rec["标题*"])) return;
  rows.push(rec);
});

if (rows.length === 0) {
  console.error("没有读到有效任务行（标题为空的行已跳过）");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const ownerId = await ensureOwner(prisma);
const skills = await prisma.skill.findMany({ select: { id: true, name: true } });
const skillIdByName = new Map(skills.map((s) => [s.name, s.id]));

let created = 0;
let updated = 0;

for (const rec of rows) {
  const title = cellText(rec["标题*"]);
  const givenId = cellText(rec["内部编号"]);
  const skillNames = [
    cellText(rec["技能门槛1*"]),
    cellText(rec["技能门槛2"]),
    cellText(rec["技能门槛3"]),
  ].filter(Boolean);

  const missingSkills = skillNames.filter((n) => !skillIdByName.has(n));
  if (missingSkills.length) {
    throw new Error(`「${title}」技能不存在：${missingSkills.join("、")}`);
  }

  const data = {
    ownerId,
    title,
    summary: cellText(rec["摘要*"]) || null,
    description: cellText(rec["详情正文*"]),
    category: cellText(rec["品类*"]) || null,
    rewardText: cellText(rec["报酬展示文案*"]) || null,
    rewardAmount: (() => {
      const n = parseAmount(rec["报酬金额*"], rec["报酬展示文案*"]);
      return n == null ? null : new Prisma.Decimal(n);
    })(),
    rewardUnit: cellText(rec["报酬单位*"]) || null,
    quota: (() => {
      const n = Number(cellText(rec["总名额*"]));
      return Number.isFinite(n) ? Math.trunc(n) : null;
    })(),
    deadline: parseDeadline(rec["截止时间*"]),
    workType: cellText(rec["工作方式*"]) || null,
    location: cellText(rec["地区"]) || null,
    suitFor: cellText(rec["适合人群"]) || null,
    publisherName: cellText(rec["发包方展示名"]) || null,
    publisherNote: cellText(rec["发包方备注"]) || null,
    deliverables: splitPipe(rec["交付物*|分隔"]),
    acceptance: splitPipe(rec["验收标准*|分隔"]),
    specs: splitPipe(rec["交付规范*|分隔"]),
    requirements: splitPipe(rec["报名前置条件*|分隔"]),
    enrollSteps: splitPipe(rec["报名步骤*|分隔"]),
    references: parseRefs(rec["参考资料 名称|链接;名称|链接"]),
    status: parseStatus(rec["发布状态*"]),
  };

  let task =
    givenId
      ? await prisma.task.findUnique({ where: { id: givenId } })
      : null;
  if (!task) {
    task = await prisma.task.findFirst({ where: { title } });
  }

  if (task) {
    await prisma.task.update({ where: { id: task.id }, data });
    await prisma.taskSkill.deleteMany({ where: { taskId: task.id } });
    for (const name of skillNames) {
      await prisma.taskSkill.create({
        data: { taskId: task.id, skillId: skillIdByName.get(name), required: true },
      });
    }
    updated += 1;
    console.log(`更新 ${task.id}  ${title}`);
  } else {
    const createdTask = await prisma.task.create({
      data: givenId ? { id: givenId, ...data } : data,
    });
    for (const name of skillNames) {
      await prisma.taskSkill.create({
        data: {
          taskId: createdTask.id,
          skillId: skillIdByName.get(name),
          required: true,
        },
      });
    }
    created += 1;
    console.log(`新增 ${createdTask.id}  ${title}`);
  }
}

await prisma.$disconnect();
console.log(`完成：新增 ${created}，更新 ${updated}，合计 ${rows.length}`);
console.log(`文件：${xlsxPath}`);
