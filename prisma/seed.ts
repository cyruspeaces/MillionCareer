/**
 * 种子数据：技能目录 + 演示任务 + 演示活动
 *
 * 幂等：技能按 code upsert；任务/活动按固定 id upsert。
 * 运行：npx prisma db seed（或 npm run db:seed）
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  Prisma,
  PrismaClient,
  SkillKind,
} from "../src/generated/prisma/client";

type SkillSeed = {
  code: string;
  name: string;
  desc: string;
  group: string;
  kind: SkillKind;
  tier: number;
  canGateTask?: boolean;
};

const GROUP_START = "起步与成长";
const GROUP_BASE = "通用底座";
const GROUP_MODEL = "模型训练与数据";
const GROUP_CONTENT = "内容与广告创意";
const GROUP_AGENT = "Agent 与评测";

const skills: SkillSeed[] = [
  // ---------- 起步与成长（里程碑，不做任务门槛） ----------
  { code: "first-order", name: "首单达成", desc: "完成第一笔任务结算，迈出赚钱第一步", group: GROUP_START, kind: "MILESTONE", tier: 0, canGateTask: false },
  { code: "earn-200", name: "赚到 ¥200", desc: "累计结算满 200 元", group: GROUP_START, kind: "MILESTONE", tier: 0, canGateTask: false },
  { code: "earn-2000", name: "赚到 ¥2000", desc: "累计结算满 2000 元，解锁更高阶成长叙事", group: GROUP_START, kind: "MILESTONE", tier: 0, canGateTask: false },

  // ---------- 通用底座（跨赛道 Tier 0，测评可点亮） ----------
  { code: "zh-express", name: "中文表达", desc: "清晰、自然的中文表达能力", group: GROUP_BASE, kind: "CRAFT", tier: 0 },
  { code: "zh-sentence", name: "中文造句", desc: "按规则补采与改写中文样例", group: GROUP_BASE, kind: "CRAFT", tier: 0 },
  { code: "rule-follow", name: "规则执行", desc: "严格按任务规范执行交付", group: GROUP_BASE, kind: "CRAFT", tier: 0 },
  { code: "table-organize", name: "表格整理", desc: "结构化整理语料与质检表格", group: GROUP_BASE, kind: "TOOL", tier: 0 },
  { code: "prompt-basic", name: "提示词基础", desc: "把需求写成 AI 能稳定执行的指令", group: GROUP_BASE, kind: "CRAFT", tier: 0 },
  { code: "delivery-comm", name: "交付沟通", desc: "交付说明、进度同步与问题反馈的职业化表达", group: GROUP_BASE, kind: "CRAFT", tier: 0 },

  // ---------- 模型训练与数据 ----------
  { code: "dialogue-starter", name: "对话训练新人", desc: "测评通过 · 对话训练赛道入门资格", group: GROUP_MODEL, kind: "QUALIFICATION", tier: 1 },
  { code: "dialogue-quality", name: "对话质量判断", desc: "判断回复是否合规、有用、自然", group: GROUP_MODEL, kind: "CRAFT", tier: 1 },
  { code: "safety-sense", name: "安全意识", desc: "敏感与拒识场景的基本判断", group: GROUP_MODEL, kind: "CRAFT", tier: 1 },
  { code: "sensitive-sense", name: "敏感词意识", desc: "识别并正确处理敏感内容", group: GROUP_MODEL, kind: "CRAFT", tier: 1 },
  { code: "label-basic", name: "基础标注规范", desc: "掌握基础标注字段与验收口径", group: GROUP_MODEL, kind: "CRAFT", tier: 2 },
  { code: "corpus-spec", name: "语料规范", desc: "语料字段、格式与质检口径", group: GROUP_MODEL, kind: "CRAFT", tier: 2 },
  { code: "corpus-qa", name: "语料质检", desc: "完成语料质检能力认证", group: GROUP_MODEL, kind: "CRAFT", tier: 2 },
  { code: "dataset-build", name: "数据集构建", desc: "收集、清洗并组织可用于训练的数据集", group: GROUP_MODEL, kind: "CRAFT", tier: 2 },
  { code: "persona-corpus", name: "人设与语料设计", desc: "为个人 AI 分身设计人设、语气与训练语料", group: GROUP_MODEL, kind: "CRAFT", tier: 2 },
  { code: "model-trainer", name: "模型训练师", desc: "点亮后可接个人 AI 模型训练服务高价单", group: GROUP_MODEL, kind: "QUALIFICATION", tier: 3 },

  // ---------- 内容与广告创意 ----------
  { code: "ad-copy", name: "广告文案", desc: "提炼卖点，写出可直接投放的广告文案", group: GROUP_CONTENT, kind: "CRAFT", tier: 1 },
  { code: "product-express", name: "产品表达", desc: "把产品卖点转化为可理解的内容", group: GROUP_CONTENT, kind: "CRAFT", tier: 1 },
  { code: "short-video-edit", name: "短视频剪辑", desc: "短视频节奏、剪辑与成片交付", group: GROUP_CONTENT, kind: "CRAFT", tier: 2 },
  { code: "ai-video-tool", name: "AI 视频工具", desc: "使用 AI 视频工具完成交付", group: GROUP_CONTENT, kind: "TOOL", tier: 2 },
  { code: "ai-image-video-tool", name: "AI 图像/视频工具", desc: "使用 AI 工具完成图像与视频素材", group: GROUP_CONTENT, kind: "TOOL", tier: 2 },
  { code: "storyboard", name: "分镜叙事", desc: "漫剧分镜结构与叙事节奏", group: GROUP_CONTENT, kind: "CRAFT", tier: 2 },
  { code: "brand-sense", name: "品牌理解", desc: "理解品牌调性并落地到内容表达", group: GROUP_CONTENT, kind: "CRAFT", tier: 2 },
  { code: "ad-spec", name: "投放素材规范", desc: "各平台广告素材的尺寸、时长与审核规则", group: GROUP_CONTENT, kind: "CRAFT", tier: 2 },
  { code: "comic-maker", name: "漫剧制作师", desc: "点亮后可接漫剧方向高价任务", group: GROUP_CONTENT, kind: "QUALIFICATION", tier: 3 },
  { code: "ad-maker", name: "广告制作师", desc: "点亮后可接广告制作方向高价任务", group: GROUP_CONTENT, kind: "QUALIFICATION", tier: 3 },

  // ---------- Agent 与评测 ----------
  { code: "logic-decompose", name: "逻辑拆解", desc: "拆解任务目标与工具调用步骤", group: GROUP_AGENT, kind: "CRAFT", tier: 1 },
  { code: "agent-tool-insight", name: "Agent / 工具调用理解", desc: "理解 Agent 工具调用轨迹与评测点", group: GROUP_AGENT, kind: "CRAFT", tier: 1 },
  { code: "tech-writing", name: "技术写作", desc: "清晰记录评测过程与结论", group: GROUP_AGENT, kind: "CRAFT", tier: 2 },
  { code: "agent-reviewer", name: "Agent 评测员", desc: "点亮后可接工具调用轨迹评审高价单", group: GROUP_AGENT, kind: "QUALIFICATION", tier: 3 },
];

type TaskRef = { label: string; href: string };

type TaskSeed = {
  id: string;
  category: string;
  title: string;
  summary: string;
  description: string;
  rewardText: string;
  rewardAmount: number;
  rewardUnit: string;
  /** 总名额 = mock「余 N」+ joinedCount */
  quota: number;
  deadline: Date;
  workType: string;
  location: string;
  suitFor: string;
  publisherName: string;
  publisherNote: string;
  deliverables: string[];
  acceptance: string[];
  specs: string[];
  requirements: string[];
  enrollSteps: string[];
  references: TaskRef[];
  skillCodes: string[];
  /** 演示报名人数（写入 TaskApplication） */
  joinedCount: number;
  applicantNicknames: string[];
};

/** 与 mocks/home.ts 当前展示任务一一对应 */
const tasks: TaskSeed[] = [
  {
    id: "task-1",
    category: "对话训练",
    title: "豆包多轮对话偏好标注",
    summary: "对助手回复进行排序与点评，输出可验收的偏好对数据",
    description:
      "围绕多轮对话场景，对同一问题的多条助手回复做偏好排序与简要点评，沉淀可训练、可复验的偏好对数据。本商单面向有中文语感、能稳定判断回复质量的创作者。",
    rewardText: "¥80 / 百条",
    rewardAmount: 80,
    rewardUnit: "百条",
    quota: 40,
    deadline: new Date("2026-07-28T23:59:59+08:00"),
    workType: "远程兼职",
    location: "不限地区",
    suitFor: "有对话标注 / 内容审核经验，或长期使用大模型的创作者",
    publisherName: "某头部对话模型团队（脱敏）",
    publisherNote: "历史验收准时率 98% · 好评结算",
    deliverables: [
      "偏好排序结果表（平台模板）",
      "关键 case 点评（每百条不少于 8 条）",
    ],
    acceptance: [
      "排序理由可复述，不出现明显随意打分",
      "敏感、违规内容按规范标记，不漏标",
      "每日提交量与质量抽检通过率 ≥ 90%",
    ],
    specs: [
      "按平台模板填写排序结果，不可自建字段",
      "点评需说明理由，禁止仅写「更好 / 更差」",
      "涉及敏感内容必须按标签体系标记",
      "单日提交建议 100–300 条，超量需提前报备",
    ],
    requirements: ["实名接单资料", "试标账号权限", "完成 10 条试标并通过抽检"],
    enrollSteps: ["完善接单资料", "完成 10 条试标", "确认领取并开工"],
    references: [
      { label: "偏好标注手册（示例）", href: "#" },
      { label: "优质 / 劣质回复对照样例", href: "#" },
    ],
    skillCodes: ["zh-express", "dialogue-quality", "label-basic"],
    joinedCount: 12,
    applicantNicknames: ["林晓", "周明", "陈静", "黄磊", "刘洋", "罗倩", "高翔", "叶凡", "吴桐", "赵雪", "孙悦", "钱进"],
  },
  {
    id: "task-2",
    category: "数据达标",
    title: "垂类问答语料质检达标包",
    summary: "按规则校验语料完整性、敏感词与格式，提交质检报告",
    description:
      "对指定垂类问答语料包做完整性、敏感词、格式与字段一致性校验，输出可复现的质检报告与问题清单，帮助发包方达到入库标准。",
    rewardText: "¥1,200 / 包",
    rewardAmount: 1200,
    rewardUnit: "包",
    quota: 12,
    deadline: new Date("2026-07-30T23:59:59+08:00"),
    workType: "远程项目制",
    location: "不限地区",
    suitFor: "有数据标注、质检或内容运营经验者优先",
    publisherName: "某 AI 数据服务商（脱敏）",
    publisherNote: "支持分批验收结算",
    deliverables: ["质检报告（PDF/飞书文档）", "问题明细表（表格）"],
    acceptance: [
      "按检查清单覆盖全部抽样条目",
      "问题分级（阻断 / 警告 / 建议）清晰",
      "报告可直接用于返修与二次验收",
    ],
    specs: [
      "问题分级：阻断 / 警告 / 建议，三级必填",
      "报告需可复现抽检路径与抽样比例",
      "字段缺失、编码错误单独列出",
      "敏感词库以发包方当周版本为准",
    ],
    requirements: ["接单资料", "质检手册阅读确认", "表格工具（Excel / 飞书）"],
    enrollSteps: ["完善接单资料", "阅读质检手册", "确认领取并开工"],
    references: [
      { label: "质检检查清单模板", href: "#" },
      { label: "报告范例（脱敏）", href: "#" },
    ],
    skillCodes: ["corpus-spec", "sensitive-sense", "table-organize"],
    joinedCount: 7,
    applicantNicknames: ["王芳", "赵强", "吴敏", "孙浩", "钱程", "冯丽", "陈博"],
  },
  {
    id: "task-3",
    category: "AI 漫剧",
    title: "品牌向 AI 漫剧分镜商单",
    summary: "完成 6 镜分镜脚本 + 关键帧视觉，符合品牌调性与时长",
    description:
      "为品牌短剧向内容产出 6 镜分镜脚本与关键帧视觉参考，要求叙事完整、角色稳定、调性贴合品牌手册，可作为后续成片生产输入。",
    rewardText: "¥3,500 / 单",
    rewardAmount: 3500,
    rewardUnit: "单",
    quota: 6,
    deadline: new Date("2026-08-02T23:59:59+08:00"),
    workType: "远程项目制",
    location: "不限地区",
    suitFor: "有短视频、漫剧或广告分镜经验的创作者 / 工作室",
    publisherName: "某消费品牌市场部（脱敏）",
    publisherNote: "优质交付可进入长期共创池",
    deliverables: ["分镜脚本", "关键帧图 6–8 张", "简要制作说明"],
    acceptance: [
      "分镜信息完整（景别、对白、时长、画面说明）",
      "关键帧风格统一，无明显穿模 / 脸崩",
      "总时长落在约定区间，可被制作方直接沿用",
    ],
    specs: [
      "分镜需含景别、对白、时长、画面说明",
      "关键帧横版 16:9，长边 ≥ 1920",
      "角色造型前后一致，避免明显脸崩 / 穿模",
      "文件命名：镜号_场景_版本",
    ],
    requirements: ["作品集链接", "风格小样 2–3 张", "可接收品牌手册的网盘 / 飞书权限"],
    enrollSteps: ["完善作品集链接", "提交风格小样", "确认领取并开工"],
    references: [
      { label: "品牌视觉手册（脱敏节选）", href: "#" },
      { label: "分镜脚本模板", href: "#" },
    ],
    skillCodes: ["storyboard", "ai-image-video-tool", "brand-sense"],
    joinedCount: 4,
    applicantNicknames: ["许诺", "何川", "郑宇", "谢婷"],
  },
  {
    id: "task-4",
    category: "评测标注",
    title: "Agent 工具调用轨迹评审",
    summary: "审查工具选择是否合理，标注失败节点与改进建议",
    description:
      "审阅 Agent 在完成任务时的工具调用轨迹：判断选工具是否合理、参数是否正确、失败点在哪，并给出可执行的改进建议，用于强化模型工具使用能力。",
    rewardText: "¥100 / 小时",
    rewardAmount: 100,
    rewardUnit: "小时",
    quota: 20,
    deadline: new Date("2026-07-26T23:59:59+08:00"),
    workType: "远程兼职",
    location: "不限地区",
    suitFor: "有开发、评测或复杂工作流设计经验者",
    publisherName: "某 Agent 平台评测组（脱敏）",
    publisherNote: "按时长结算，周结",
    deliverables: ["轨迹评审表", "典型失败 case 说明（每周汇总）"],
    acceptance: [
      "失败节点定位准确，理由可复核",
      "改进建议具体到工具/参数层面",
      "抽样复核一致率达标",
    ],
    specs: [
      "失败节点需定位到具体 tool call",
      "改进建议写到参数 / 重试策略层",
      "评审用语客观，避免情绪化评价",
      "每周汇总需附 3 个典型 case",
    ],
    requirements: ["接单资料", "示例轨迹试评通过", "熟悉基础 JSON / API 概念"],
    enrollSteps: ["完善接单资料", "完成示例轨迹试评", "确认领取并开工"],
    references: [
      { label: "轨迹评审字段说明", href: "#" },
      { label: "示例轨迹包", href: "#" },
    ],
    skillCodes: ["agent-tool-insight", "logic-decompose", "tech-writing"],
    joinedCount: 6,
    applicantNicknames: ["唐果", "冯凯", "蒋晨", "沈悦", "韩冬", "杨帆"],
  },
  {
    id: "task-5",
    category: "内容创作",
    title: "产品功能演示短视频（AI 辅助）",
    summary: "基于分镜生成 30s 演示片，交付成片与工程源文件说明",
    description:
      "基于既有分镜，用 AI 辅助完成约 30 秒产品功能演示短视频，要求信息清晰、节奏紧凑，适合官网与社媒投放。",
    rewardText: "¥2,000 / 条",
    rewardAmount: 2000,
    rewardUnit: "条",
    quota: 8,
    deadline: new Date("2026-08-05T23:59:59+08:00"),
    workType: "远程项目制",
    location: "不限地区",
    suitFor: "有产品演示片或信息流广告制作经验者",
    publisherName: "某 ToB 产品增长团队（脱敏）",
    publisherNote: "可加急，加急费另议",
    deliverables: ["成片 MP4", "工程/素材说明", "封面静帧 1 张"],
    acceptance: [
      "时长 28–35 秒，字幕可读",
      "功能演示无事实错误",
      "成片可直接导出投放规格",
    ],
    specs: [
      "成片时长 28–35 秒",
      "导出 1080p，H.264；字幕烧录或外挂二选一",
      "功能演示不得偏离产品事实",
      "封面静帧需可裁切为 1:1 与 16:9",
    ],
    requirements: ["作品集或往期成片链接", "确认分镜与品牌素材包", "成片交付网盘权限"],
    enrollSteps: ["完善作品集链接", "确认分镜与品牌素材", "确认领取并开工"],
    references: [
      { label: "分镜与配音草案", href: "#" },
      { label: "品牌字幕规范", href: "#" },
    ],
    skillCodes: ["short-video-edit", "ai-video-tool", "product-express"],
    joinedCount: 5,
    applicantNicknames: ["沈青", "韩梅", "杨柳", "尤佳", "许晴"],
  },
  {
    id: "task-6",
    category: "对话训练",
    title: "安全拒识与边界 case 补采",
    summary: "构造高风险提问并验收模型拒识策略，输出 case 集",
    description:
      "围绕安全与边界场景构造高风险提问，检查模型拒识/降级策略是否合理，沉淀可复用的 case 集，用于安全训练与回归测试。",
    rewardText: "¥60 / 十组",
    rewardAmount: 60,
    rewardUnit: "十组",
    quota: 25,
    deadline: new Date("2026-07-29T23:59:59+08:00"),
    workType: "远程兼职",
    location: "不限地区",
    suitFor: "细心、能按规范稳定产出的标注员或创作者",
    publisherName: "某大模型安全团队（脱敏）",
    publisherNote: "按组结算，支持多轮补采",
    deliverables: ["边界 case 集（表格）", "典型误拒/漏拒说明"],
    acceptance: [
      "case 覆盖指定风险类别，不重复灌水",
      "拒识判定与规范一致",
      "输出格式符合模板字段",
    ],
    specs: [
      "每组 case 覆盖指定风险类别，禁止灌水重复",
      "拒识判定必须对照当周安全规范",
      "输出字段不可缺：类别 / 提问 / 模型表现 / 判定",
      "不得在公共渠道传播原始高风险语料",
    ],
    requirements: ["接单资料", "安全标注规范阅读确认", "稳定网络与表格提交权限"],
    enrollSteps: ["完善接单资料", "阅读安全标注规范", "确认领取并开工"],
    references: [
      { label: "安全标注规范摘要", href: "#" },
      { label: "边界 case 模板", href: "#" },
    ],
    skillCodes: ["safety-sense", "zh-sentence", "rule-follow"],
    joinedCount: 7,
    applicantNicknames: ["曹阳", "袁野", "邓超", "彭程", "卢娜", "蒋雯", "蔡亮"],
  },
];

type ActivitySeed = {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  benefits: string;
  benefitItems: string[];
  rules: string;
  timeline: string[];
  howToJoin: string[];
  requirements: string[];
  judgingNote: string;
  quota: number;
  tone: "primary" | "accent" | "mix";
  rewardSkillCodes: string[];
  /** 相对今天的天数偏移 */
  startsOffsetDays: number;
  endsOffsetDays: number;
  joinedCount: number;
  registrantNicknames: string[];
};

function dayOffset(days: number): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

const activities: ActivitySeed[] = [
  {
    id: "act-1",
    title: "AI 漫剧 48h 共创挑战",
    summary: "用生成式叙事完成一支可发布短剧分镜与成片雏形",
    description:
      "48 小时内完成一支短剧分镜与成片雏形。鼓励用 AI 图像/视频工具加速产出，重点考察叙事完整度、角色一致性与可发布潜力。优秀作品将进入优先商单池。",
    category: "创作赛",
    benefits: "奖金池 + 作品曝光 + 优先商单池",
    benefitItems: ["奖金池激励", "作品平台曝光", "优先进入漫剧商单池"],
    rules:
      "每人限提交 1 支作品；须为活动期间原创或明确标注 AI 工具链路；禁止抄袭与侵权素材；逾期提交不参与评审。",
    timeline: ["报名截止", "48h 创作期", "评审打分", "结果公示"],
    howToJoin: ["确认报名", "按要求完成分镜与成片雏形", "按运营指引提交作品链接"],
    requirements: [
      "分镜说明（含角色与情绪节拍）",
      "成片雏形链接（可预览）",
      "使用的 AI 工具与流程简述",
    ],
    judgingNote: "评审关注叙事完整度、画面一致性与可发布潜力；由平台运营与特邀创作者联合评审。",
    quota: 80,
    tone: "mix",
    rewardSkillCodes: ["storyboard", "ai-image-video-tool"],
    startsOffsetDays: -2,
    endsOffsetDays: 5,
    joinedCount: 6,
    registrantNicknames: ["许诺", "何川", "郑宇", "谢婷", "沈青", "韩梅"],
  },
  {
    id: "act-2",
    title: "对话质量评测周",
    summary: "参与多轮对话标注与偏好对比，沉淀高可信训练样本",
    description:
      "为期一周的对话质量评测共创。参与者完成多轮对话标注与偏好对比任务，产出可用于模型训练的高可信样本，优秀训练员将进入优质池。",
    category: "评测周",
    benefits: "有偿参与 · 进入优质训练员池",
    benefitItems: ["有偿参与补贴", "进入优质训练员池", "点亮对话相关技能资格"],
    rules:
      "需按手册完成试标后方可正式开标；每日有额度上限；质量抽检不达标将暂停当日额度。",
    timeline: ["报名与试标", "正式标注期", "质量抽检", "结算与池子邀请"],
    howToJoin: ["确认报名", "完成试标样例", "按日额度完成标注并回传"],
    requirements: ["可稳定使用标注工具", "完成试标并通过抽检口径", "按时同步进度"],
    judgingNote: "以抽检一致率与完成量为准；达标者优先进入对话训练商单池。",
    quota: 120,
    tone: "primary",
    rewardSkillCodes: ["dialogue-quality", "label-basic"],
    startsOffsetDays: 0,
    endsOffsetDays: 7,
    joinedCount: 6,
    registrantNicknames: ["林晓", "周明", "陈静", "黄磊", "刘洋", "罗倩"],
  },
  {
    id: "act-3",
    title: "Prompt 创意公开赛",
    summary: "面向图像 / 视频 / Agent 工作流的提示词与流程设计",
    description:
      "围绕图像、视频与 Agent 工作流提交可复用的 Prompt 方案与流程设计。强调可执行性、稳定性与业务场景贴合度，优秀方案将获得认证与品牌共创机会。",
    category: "创作赛",
    benefits: "认证标识 · 品牌共创机会",
    benefitItems: ["平台认证标识", "品牌共创机会", "优秀方案曝光"],
    rules:
      "提交须包含 Prompt 正文、适用场景与失败边界说明；允许附带演示链接；每人最多 2 份方案。",
    timeline: ["报名开启", "方案征集", "初审与公示", "共创对接"],
    howToJoin: ["确认报名", "按模板准备方案", "按运营指引提交材料"],
    requirements: ["Prompt 正文与变量说明", "适用场景与验收口径", "可选演示链接"],
    judgingNote: "评审关注可复用性、稳定性与业务贴合度；由平台与合作品牌共同初审。",
    quota: 60,
    tone: "accent",
    rewardSkillCodes: ["prompt-basic", "agent-tool-insight"],
    startsOffsetDays: 3,
    endsOffsetDays: 14,
    joinedCount: 9,
    registrantNicknames: ["唐果", "冯凯", "蒋晨"],
  },
];

const DEMO_OWNER_ID = "demo-task-owner";

async function seedSkills(prisma: PrismaClient) {
  for (const [index, s] of skills.entries()) {
    const data = {
      name: s.name,
      desc: s.desc,
      group: s.group,
      kind: s.kind,
      tier: s.tier,
      canGateTask: s.canGateTask ?? true,
      sortOrder: (index + 1) * 10,
    };
    await prisma.skill.upsert({
      where: { code: s.code },
      create: { code: s.code, ...data },
      update: data,
    });
  }
  const count = await prisma.skill.count();
  console.log(`技能目录已同步：${skills.length} 条种子，库中共 ${count} 条`);
}

async function ensureDemoOwner(prisma: PrismaClient) {
  await prisma.user.upsert({
    where: { id: DEMO_OWNER_ID },
    create: {
      id: DEMO_OWNER_ID,
      phone: "19900000000",
      nickname: "平台演示发包方",
      roles: ["CLIENT"],
      identities: {
        create: {
          provider: "PHONE",
          providerUserId: "19900000000",
        },
      },
      profile: { create: {} },
    },
    update: {
      nickname: "平台演示发包方",
      roles: ["CLIENT"],
    },
  });
}

async function ensureDemoApplicant(
  prisma: PrismaClient,
  nickname: string,
  index: number,
) {
  const id = `demo-applicant-${String(index + 1).padStart(2, "0")}`;
  const phone = `198${String(10000000 + index).slice(-8)}`;
  await prisma.user.upsert({
    where: { id },
    create: {
      id,
      phone,
      nickname,
      roles: ["CREATOR"],
      identities: {
        create: {
          provider: "PHONE",
          providerUserId: phone,
        },
      },
      profile: { create: {} },
    },
    update: { nickname },
  });
  return id;
}

async function seedTasks(prisma: PrismaClient) {
  await ensureDemoOwner(prisma);

  const skillRows = await prisma.skill.findMany({
    select: { id: true, code: true },
  });
  const skillIdByCode = new Map(skillRows.map((s) => [s.code, s.id]));

  // 全局演示报名人（去重昵称→固定 id）
  const allNicknames = Array.from(
    new Set(tasks.flatMap((t) => t.applicantNicknames)),
  );
  const applicantIdByNickname = new Map<string, string>();
  for (const [i, name] of allNicknames.entries()) {
    const id = await ensureDemoApplicant(prisma, name, i);
    applicantIdByNickname.set(name, id);
  }

  for (const t of tasks) {
    const data = {
      ownerId: DEMO_OWNER_ID,
      title: t.title,
      summary: t.summary,
      description: t.description,
      category: t.category,
      rewardText: t.rewardText,
      rewardAmount: new Prisma.Decimal(t.rewardAmount),
      rewardUnit: t.rewardUnit,
      quota: t.quota,
      deadline: t.deadline,
      workType: t.workType,
      location: t.location,
      suitFor: t.suitFor,
      publisherName: t.publisherName,
      publisherNote: t.publisherNote,
      deliverables: t.deliverables,
      acceptance: t.acceptance,
      specs: t.specs,
      requirements: t.requirements,
      enrollSteps: t.enrollSteps,
      references: t.references as Prisma.InputJsonValue,
      status: "RECRUITING" as const,
    };

    await prisma.task.upsert({
      where: { id: t.id },
      create: { id: t.id, ...data },
      update: data,
    });

    // 重建技能关联
    await prisma.taskSkill.deleteMany({ where: { taskId: t.id } });
    for (const code of t.skillCodes) {
      const skillId = skillIdByCode.get(code);
      if (!skillId) throw new Error(`技能 code 不存在：${code}`);
      await prisma.taskSkill.create({
        data: { taskId: t.id, skillId, required: true },
      });
    }

    // 重建演示报名（保持 joinedCount）
    await prisma.taskApplication.deleteMany({ where: { taskId: t.id } });
    for (const nickname of t.applicantNicknames.slice(0, t.joinedCount)) {
      const userId = applicantIdByNickname.get(nickname);
      if (!userId) continue;
      await prisma.taskApplication.create({
        data: { taskId: t.id, userId, note: "演示报名数据" },
      });
    }
  }

  const count = await prisma.task.count();
  console.log(`任务已同步：${tasks.length} 条种子，库中共 ${count} 条`);
}

async function seedActivities(prisma: PrismaClient) {
  await ensureDemoOwner(prisma);

  const allNicknames = Array.from(
    new Set(activities.flatMap((a) => a.registrantNicknames)),
  );
  const registrantIdByNickname = new Map<string, string>();
  // 与任务报名人错开 index，避免手机号冲突
  for (const [i, name] of allNicknames.entries()) {
    const id = await ensureDemoApplicant(prisma, name, 100 + i);
    registrantIdByNickname.set(name, id);
  }

  for (const a of activities) {
    const data = {
      ownerId: DEMO_OWNER_ID,
      title: a.title,
      summary: a.summary,
      description: a.description,
      category: a.category,
      benefits: a.benefits,
      benefitItems: a.benefitItems,
      rules: a.rules,
      timeline: a.timeline,
      howToJoin: a.howToJoin,
      requirements: a.requirements,
      judgingNote: a.judgingNote,
      quota: a.quota,
      tone: a.tone,
      rewardSkillCodes: a.rewardSkillCodes,
      startsAt: dayOffset(a.startsOffsetDays),
      endsAt: dayOffset(a.endsOffsetDays),
      status: "OPEN" as const,
    };

    await prisma.activity.upsert({
      where: { id: a.id },
      create: { id: a.id, ...data },
      update: data,
    });

    await prisma.activityRegistration.deleteMany({
      where: { activityId: a.id },
    });
    for (const nickname of a.registrantNicknames.slice(0, a.joinedCount)) {
      const userId = registrantIdByNickname.get(nickname);
      if (!userId) continue;
      await prisma.activityRegistration.create({
        data: {
          activityId: a.id,
          userId,
          approved: true,
        },
      });
    }
  }

  const count = await prisma.activity.count();
  console.log(`活动已同步：${activities.length} 条种子，库中共 ${count} 条`);
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    await seedSkills(prisma);
    await seedTasks(prisma);
    await seedActivities(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
