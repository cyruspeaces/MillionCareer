/**
 * 导出库内任务到运营填报表（完整可用 xlsx，含下拉）
 * 运行：npx tsx scripts/export-tasks-xlsx.mjs
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";

const require = createRequire(import.meta.url);
const ExcelJS = require("exceljs");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(
  __dirname,
  "../../../docs/运营/task-data-from-db.xlsx",
);

const categories = [
  "对话训练",
  "数据达标",
  "AI 漫剧",
  "评测标注",
  "内容创作",
  "广告制作",
];
const workTypes = ["远程兼职", "远程项目制", "驻场兼职", "驻场项目制"];
const rewardUnits = ["百条", "十组", "条", "包", "单", "小时", "天", "次"];
const statuses = ["草稿", "招募中"];
const locations = ["不限地区", "仅限中国大陆", "仅限远程海外"];
const skills = [
  "中文表达",
  "中文造句",
  "规则执行",
  "表格整理",
  "提示词基础",
  "交付沟通",
  "对话训练新人",
  "对话质量判断",
  "安全意识",
  "敏感词意识",
  "基础标注规范",
  "语料规范",
  "语料质检",
  "数据集构建",
  "人设与语料设计",
  "模型训练师",
  "广告文案",
  "产品表达",
  "短视频剪辑",
  "AI 视频工具",
  "AI 图像/视频工具",
  "分镜叙事",
  "品牌理解",
  "投放素材规范",
  "漫剧制作师",
  "广告制作师",
  "逻辑拆解",
  "Agent / 工具调用理解",
  "技术写作",
  "Agent 评测员",
];

const headers = [
  "内部编号",
  "标题*",
  "摘要*",
  "详情正文*",
  "品类*",
  "报酬展示文案*",
  "报酬金额*",
  "报酬单位*",
  "总名额*",
  "截止时间*",
  "工作方式*",
  "地区",
  "适合人群",
  "发包方展示名",
  "发包方备注",
  "交付物*|分隔",
  "验收标准*|分隔",
  "交付规范*|分隔",
  "报名前置条件*|分隔",
  "报名步骤*|分隔",
  "参考资料 名称|链接;名称|链接",
  "技能门槛1*",
  "技能门槛2",
  "技能门槛3",
  "发布状态*",
];

const STATUS_LABEL = {
  DRAFT: "草稿",
  RECRUITING: "招募中",
  IN_PROGRESS: "进行中",
  SUBMITTED: "待验收",
  ACCEPTED: "已通过",
  REJECTED: "未通过",
  SETTLED: "已结算",
  CLOSED: "已关闭",
};

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

function joinPipe(arr) {
  return (arr ?? []).join("|");
}

function formatRefs(raw) {
  if (!Array.isArray(raw)) return "";
  return raw
    .map((r) => `${r?.label ?? ""}|${r?.href ?? "#"}`)
    .filter((s) => s !== "|#" && s !== "|")
    .join(";");
}

function applyListValidation(sheet, col, formula) {
  for (let row = 2; row <= 200; row++) {
    sheet.getCell(`${col}${row}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [formula],
      showErrorMessage: true,
      errorTitle: "无效选项",
      error: "请从下拉列表选择",
    };
  }
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const tasks = await prisma.task.findMany({
  include: {
    taskSkills: {
      include: { skill: { select: { name: true, sortOrder: true } } },
    },
  },
  orderBy: { id: "asc" },
});

const workbook = new ExcelJS.Workbook();
workbook.creator = "MillionCareer";

const sheet1 = workbook.addWorksheet("任务填报", {
  views: [{ state: "frozen", ySplit: 1 }],
});
sheet1.addRow(headers);
sheet1.getRow(1).font = { bold: true };
sheet1.getRow(1).fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFE8EAF6" },
};
sheet1.columns = headers.map((h) => ({
  width: Math.min(Math.max(String(h).length + 4, 12), 36),
}));
sheet1.getColumn(4).width = 48;
sheet1.getColumn(16).width = 40;
sheet1.getColumn(17).width = 40;

for (const t of tasks) {
  const skillNames = [...t.taskSkills]
    .sort((a, b) => (a.skill.sortOrder ?? 0) - (b.skill.sortOrder ?? 0))
    .map((ts) => ts.skill.name);
  const amount =
    t.rewardAmount == null ? "" : Number(t.rewardAmount.toString());

  sheet1.addRow([
    t.id,
    t.title ?? "",
    t.summary ?? "",
    t.description ?? "",
    t.category ?? "",
    t.rewardText ?? "",
    amount,
    t.rewardUnit ?? "",
    t.quota ?? "",
    formatDate(t.deadline),
    t.workType ?? "",
    t.location ?? "",
    t.suitFor ?? "",
    t.publisherName ?? "",
    t.publisherNote ?? "",
    joinPipe(t.deliverables),
    joinPipe(t.acceptance),
    joinPipe(t.specs),
    joinPipe(t.requirements),
    joinPipe(t.enrollSteps),
    formatRefs(t.references),
    skillNames[0] ?? "",
    skillNames[1] ?? "",
    skillNames[2] ?? "",
    STATUS_LABEL[t.status] ?? t.status,
  ]);
}

applyListValidation(sheet1, "E", "'下拉选项'!$A$2:$A$20");
applyListValidation(sheet1, "H", "'下拉选项'!$C$2:$C$20");
applyListValidation(sheet1, "K", "'下拉选项'!$B$2:$B$20");
applyListValidation(sheet1, "L", "'下拉选项'!$D$2:$D$20");
applyListValidation(sheet1, "V", "'下拉选项'!$F$2:$F$50");
applyListValidation(sheet1, "W", "'下拉选项'!$F$2:$F$50");
applyListValidation(sheet1, "X", "'下拉选项'!$F$2:$F$50");
applyListValidation(sheet1, "Y", "'下拉选项'!$E$2:$E$10");

const sheet2 = workbook.addWorksheet("下拉选项", {
  views: [{ state: "frozen", ySplit: 1 }],
});
sheet2.addRow(["品类", "工作方式", "报酬单位", "地区", "发布状态", "技能清单"]);
sheet2.getRow(1).font = { bold: true };
const maxLen = Math.max(
  skills.length,
  categories.length,
  workTypes.length,
  rewardUnits.length,
  locations.length,
  statuses.length,
);
for (let i = 0; i < maxLen; i++) {
  sheet2.addRow([
    categories[i] ?? "",
    workTypes[i] ?? "",
    rewardUnits[i] ?? "",
    locations[i] ?? "",
    statuses[i] ?? "",
    skills[i] ?? "",
  ]);
}
sheet2.columns = [
  { width: 14 },
  { width: 14 },
  { width: 12 },
  { width: 16 },
  { width: 12 },
  { width: 22 },
];

const sheet3 = workbook.addWorksheet("填写说明");
sheet3.addRow(["说明", "本文件由数据库导出，含当前全部任务数据；可继续增改后回填。"]);
sheet3.addRow(["列表字段", "交付物 / 验收 / 规范 / 前置 / 步骤：多条用英文 | 分隔"]);
sheet3.addRow(["参考资料", "格式：名称|链接;名称|链接"]);
sheet3.addRow(["下拉列", "品类、报酬单位、工作方式、地区、技能、发布状态"]);
sheet3.columns = [{ width: 14 }, { width: 70 }];

await workbook.xlsx.writeFile(outPath);
await prisma.$disconnect();
console.log(`已导出 ${tasks.length} 条任务 → ${outPath}`);
