/**
 * AI 能力测评（静态题库与计分模型）
 *
 * 设计参考 2026 年主流测评思路（OECD PISA MAIL / AILit Framework）：
 * 以「情景判断 + 微实操」为主，而非自评打分——测「你会怎么做」而不是「你觉得自己行不行」。
 *
 * 结构：
 * - 2 道背景题（不计分，用于报告个性化）
 * - 16 道情景计分题，覆盖 6 个维度，每题选项计 0-3 分
 * - 结果输出：MBTI 式类型（6 种）+ 维度雷达 + 起步技能点亮
 *
 * 出题原则：选项只描述动作与理由，所有选项措辞保持同等可信度，
 * 不在正确选项里写「标准答案说明」——让用户凭判断力选，而不是凭语气认好学生答案。
 * 满分项在选项列表中的位置已打散（约均匀落在第 1～4 位），避免「永远选第一个」。
 */

export type DimensionId =
  | "dialogue"
  | "safety"
  | "creation"
  | "agent"
  | "prompt"
  | "delivery";

export type AssessmentDimension = {
  id: DimensionId;
  name: string;
  shortName: string;
  desc: string;
  /** 对应平台任务方向 */
  taskDirection: string;
};

export const assessmentDimensions: AssessmentDimension[] = [
  {
    id: "dialogue",
    name: "对话与判断",
    shortName: "对话",
    desc: "判断 AI 回复好坏、按标准做偏好选择的能力",
    taskDirection: "对话训练 / 模型训练数据",
  },
  {
    id: "safety",
    name: "规范与安全",
    shortName: "规范",
    desc: "按规范执行、识别敏感与风险内容的意识",
    taskDirection: "数据质检 / 安全拒识",
  },
  {
    id: "creation",
    name: "AI 内容创作",
    shortName: "创作",
    desc: "用 AI 工具产出图文视频内容的方法与审美",
    taskDirection: "漫剧 / 广告 / 内容商单",
  },
  {
    id: "agent",
    name: "Agent 与工具",
    shortName: "Agent",
    desc: "理解工具调用、拆解步骤、验证 AI 结论的能力",
    taskDirection: "Agent 评测 / 轨迹评审",
  },
  {
    id: "prompt",
    name: "提示与指令",
    shortName: "提示",
    desc: "把需求写成 AI 能稳定执行的指令的能力",
    taskDirection: "通用底座 · 所有任务",
  },
  {
    id: "delivery",
    name: "交付与协作",
    shortName: "交付",
    desc: "交付说明、进度同步与问题反馈的职业化程度",
    taskDirection: "通用底座 · 所有任务",
  },
];

export type AssessmentOption = {
  id: string;
  text: string;
  /** 计分题：该选项在题目维度上的得分（0-3）；背景题为 undefined */
  score?: number;
};

export type AssessmentQuestion = {
  id: string;
  /** 背景题为 "profile"，计分题挂维度 */
  dimension: DimensionId | "profile";
  /** 题干前的小场景标签 */
  scene: string;
  text: string;
  /** 情景材料（如 AI 回复对比、调用记录），可选 */
  material?: string[];
  options: AssessmentOption[];
};

export const assessmentQuestions: AssessmentQuestion[] = [
  // ---------- 背景题（不计分） ----------
  {
    id: "q-intent",
    dimension: "profile",
    scene: "开始之前",
    text: "你来百万职场，最想先做到哪件事？",
    options: [
      { id: "intent-earn", text: "快点赚到第一笔钱，哪怕单价低" },
      { id: "intent-upgrade", text: "冲更高价的商单，愿意先补技能" },
      { id: "intent-explore", text: "先看看 AI 方向哪些适合我" },
      { id: "intent-work", text: "把 AI 用进我现在的工作/副业" },
    ],
  },
  {
    id: "q-frequency",
    dimension: "profile",
    scene: "开始之前",
    text: "过去半年，你使用 AI 工具（对话、生图、剪辑等）的频率是？",
    options: [
      { id: "freq-daily", text: "几乎每天都用" },
      { id: "freq-weekly", text: "每周用几次" },
      { id: "freq-rare", text: "偶尔试过几次" },
      { id: "freq-none", text: "基本没用过" },
    ],
  },

  // ---------- 对话与判断（3 题）----------
  // 满分项位置：第 1 / 2 / 3 位（0-index）打散
  {
    id: "q-dlg-1",
    dimension: "dialogue",
    scene: "对话训练",
    text: "用户问 AI：「快递三天没动，帮我写句话催客服」。哪条回复更好？",
    material: [
      "回复 A：您好，我的快递（单号 xxx）已三天未更新物流，麻烦帮我查询一下目前状态，谢谢。",
      "回复 B：你们物流也太慢了吧！三天都不动，再不处理我就投诉到底！",
    ],
    options: [
      {
        id: "dlg1-a",
        text: "A：诉求和单号都给全了，客服能直接去查",
        score: 3,
      },
      {
        id: "dlg1-c",
        text: "A：字数更多，显得对这件事更重视",
        score: 1,
      },
      {
        id: "dlg1-b",
        text: "B：语气强硬，有投诉风险的工单会被优先处理",
        score: 0,
      },
      {
        id: "dlg1-d",
        text: "B：情绪真实，更像用户本人的口吻",
        score: 0,
      },
    ],
  },
  {
    id: "q-dlg-2",
    dimension: "dialogue",
    scene: "偏好标注",
    text: "任务标准是「对新手友好」。用户问「什么是显卡」，你会把哪条标为更优？",
    material: [
      "回复 A：显卡是负责图形渲染的硬件，核心为 GPU，通过 PCIe 与主板通信，显存带宽与 CUDA 核心数决定并行吞吐性能。",
      "回复 B：显卡就是电脑里专门负责「画画面」的零件，玩游戏、剪视频画面流不流畅主要看它。",
    ],
    options: [
      {
        id: "dlg2-a",
        text: "标 A 更优",
        score: 1,
      },
      {
        id: "dlg2-b",
        text: "标 B 更优",
        score: 3,
      },
      {
        id: "dlg2-both",
        text: "两条都标为优",
        score: 0,
      },
      {
        id: "dlg2-self",
        text: "凭第一感觉快速标，保证效率",
        score: 0,
      },
    ],
  },
  {
    id: "q-dlg-3",
    dimension: "dialogue",
    scene: "对话质量",
    text: "多轮对话里，用户上一句说「我不吃辣」，AI 接着推荐了麻辣火锅。这条回复的主要问题是？",
    options: [
      {
        id: "dlg3-tone",
        text: "语气不够热情，缺少亲和力",
        score: 0,
      },
      {
        id: "dlg3-short",
        text: "推荐数量太少，应该一次给三五个选项",
        score: 0,
      },
      {
        id: "dlg3-context",
        text: "违背了用户上文已明确说过的约束",
        score: 3,
      },
      {
        id: "dlg3-ok",
        text: "没有明显问题",
        score: 0,
      },
    ],
  },

  // ---------- 规范与安全（3 题）----------
  {
    id: "q-safe-1",
    dimension: "safety",
    scene: "标注规范",
    text: "规范要求「地点标到城市级」。句子是「我在朝阳区上班」，你会怎么标？",
    options: [
      {
        id: "safe1-district",
        text: "标「朝阳区」，忠于原文",
        score: 1,
      },
      {
        id: "safe1-skip",
        text: "跳过这条",
        score: 0,
      },
      {
        id: "safe1-guess",
        text: "标「朝阳区上班」，信息保留得更全",
        score: 0,
      },
      {
        id: "safe1-city",
        text: "标「北京」，并在备注说明原文只到区",
        score: 3,
      },
    ],
  },
  {
    id: "q-safe-2",
    dimension: "safety",
    scene: "安全拒识",
    text: "用户让 AI「生成一张可以用的身份证图片做测试」。理想的 AI 行为是？",
    options: [
      {
        id: "safe2-refuse",
        text: "拒绝生成，说明原因，并提供带明显「样例」标注的示意图作替代",
        score: 3,
      },
      {
        id: "safe2-do",
        text: "生成，测试用途属于合理使用",
        score: 0,
      },
      {
        id: "safe2-silent",
        text: "不回复这条请求",
        score: 1,
      },
      {
        id: "safe2-ask",
        text: "让用户提供真实信息，生成得更接近实物以便测试",
        score: 0,
      },
    ],
  },
  {
    id: "q-safe-3",
    dimension: "safety",
    scene: "执行冲突",
    text: "做任务时你发现有一条样本和规范文档冲突。最专业的做法是？",
    options: [
      {
        id: "safe3-self",
        text: "按自己的理解处理，保证进度",
        score: 0,
      },
      {
        id: "safe3-report",
        text: "先按规范执行这条，同时把冲突反馈给发包方确认",
        score: 3,
      },
      {
        id: "safe3-skip",
        text: "跳过这条，先做其他的",
        score: 1,
      },
      {
        id: "safe3-stop",
        text: "暂停全部工作，等确认后再继续",
        score: 1,
      },
    ],
  },

  // ---------- AI 内容创作（3 题）----------
  {
    id: "q-create-1",
    dimension: "creation",
    scene: "漫剧制作",
    text: "接到一个 AI 漫剧短片单，第一步最应该做什么？",
    options: [
      {
        id: "create1-gen",
        text: "先批量生成一批图，从里面挑能用的",
        score: 0,
      },
      {
        id: "create1-style",
        text: "先花一天确定画风参考",
        score: 1,
      },
      {
        id: "create1-script",
        text: "先写故事梗概和分镜脚本",
        score: 3,
      },
      {
        id: "create1-tool",
        text: "先调研最新的生图工具",
        score: 1,
      },
    ],
  },
  {
    id: "q-create-2",
    dimension: "creation",
    scene: "图像修复",
    text: "AI 生成的主角图整体很好，但手指有明显畸形。最有效的处理方式是？",
    options: [
      {
        id: "create2-reroll",
        text: "整张图重新生成，直到满意",
        score: 1,
      },
      {
        id: "create2-accept",
        text: "保留原图，手部瑕疵不影响画面主体",
        score: 0,
      },
      {
        id: "create2-switch",
        text: "换一个生图工具重做这张",
        score: 1,
      },
      {
        id: "create2-inpaint",
        text: "用局部重绘只修手部区域",
        score: 3,
      },
    ],
  },
  {
    id: "q-create-3",
    dimension: "creation",
    scene: "品牌商单",
    text: "品牌单要求「画面不能出现竞品元素」，你发现 AI 出图背景里疑似有竞品 Logo。你会？",
    options: [
      {
        id: "create3-ask",
        text: "截图问发包方「这个算吗」，等回复再动",
        score: 2,
      },
      {
        id: "create3-submit",
        text: "元素很模糊，按原样交付",
        score: 0,
      },
      {
        id: "create3-drop",
        text: "整组图作废，全部重做",
        score: 1,
      },
      {
        id: "create3-fix",
        text: "放大确认；拿不准也按有处理，重绘该区域后再交",
        score: 3,
      },
    ],
  },

  // ---------- Agent 与工具（3 题）----------
  {
    id: "q-agent-1",
    dimension: "agent",
    scene: "轨迹评审",
    text: "评审一条 Agent 执行记录：用户问「明天上海天气如何」，Agent 调用了计算器工具后回答「无法计算」。问题出在哪？",
    options: [
      {
        id: "agent1-tool",
        text: "工具选择错误：该调用天气查询，而不是计算器",
        score: 3,
      },
      {
        id: "agent1-user",
        text: "用户问题不够具体，没说要哪个区的天气",
        score: 0,
      },
      {
        id: "agent1-calc",
        text: "计算器工具本身故障，需要修复",
        score: 0,
      },
      {
        id: "agent1-final",
        text: "最终回复的措辞不当，应该更委婉",
        score: 0,
      },
    ],
  },
  {
    id: "q-agent-2",
    dimension: "agent",
    scene: "结果验证",
    text: "AI 给了你一个带具体数字的行业结论，你要写进交付物但拿不准真假。最靠谱的做法是？",
    options: [
      {
        id: "agent2-trust",
        text: "数字给得很具体，直接采用",
        score: 0,
      },
      {
        id: "agent2-verify",
        text: "让 AI 给出来源，去源头交叉核对后再决定用不用",
        score: 3,
      },
      {
        id: "agent2-ask-again",
        text: "再问一遍 AI 确认，答案一致就用",
        score: 1,
      },
      {
        id: "agent2-remove",
        text: "删掉所有数字表述，只保留定性结论",
        score: 1,
      },
    ],
  },
  {
    id: "q-agent-3",
    dimension: "agent",
    scene: "任务拆解",
    text: "你让 AI 一次性完成「调研 + 写稿 + 排版」的长任务，结果很乱。更好的做法是？",
    options: [
      {
        id: "agent3-longer",
        text: "把要求写得更长更细，仍一次性执行",
        score: 1,
      },
      {
        id: "agent3-retry",
        text: "同样的指令多试几次",
        score: 0,
      },
      {
        id: "agent3-split",
        text: "拆成三步，每步确认结果后再进下一步",
        score: 3,
      },
      {
        id: "agent3-give-up",
        text: "这类任务不适合 AI，全部手工完成",
        score: 0,
      },
    ],
  },

  // ---------- 提示与指令（2 题）----------
  {
    id: "q-prompt-1",
    dimension: "prompt",
    scene: "微实操 · 提示词",
    text: "要给宠物用品店写 3 条朋友圈文案。哪个提示词最可能一次拿到可用结果？",
    material: [
      "提示 A：写点宠物店的文案。",
      "提示 B：你是宠物用品店的社群运营。写 3 条朋友圈文案推广新到的猫抓板，口语化、每条不超过 50 字、带一个表情符号，突出「实木耐抓」。",
      "提示 C：请以资深新消费品牌全案专家视角，结合 4P 理论与用户心智模型，输出一套完整的宠物用品店社媒矩阵内容策略并附 3 条文案。",
    ],
    options: [
      {
        id: "prompt1-c",
        text: "提示 C",
        score: 1,
      },
      {
        id: "prompt1-a",
        text: "提示 A",
        score: 0,
      },
      {
        id: "prompt1-b",
        text: "提示 B",
        score: 3,
      },
      {
        id: "prompt1-none",
        text: "哪个都行，多生成几次再挑",
        score: 0,
      },
    ],
  },
  {
    id: "q-prompt-2",
    dimension: "prompt",
    scene: "微实操 · 调提示",
    text: "AI 写的文案总是太书面化，你想让它口语化。最有效的改法是？",
    options: [
      {
        id: "prompt2-vague",
        text: "在提示里加一句「请务必注意语言风格」",
        score: 1,
      },
      {
        id: "prompt2-retry",
        text: "同样的提示多生成几次，挑最口语的一版",
        score: 0,
      },
      {
        id: "prompt2-switch",
        text: "换一个 AI 工具",
        score: 0,
      },
      {
        id: "prompt2-example",
        text: "在提示里写明「口语化、像朋友聊天」，并附一条满意的示例",
        score: 3,
      },
    ],
  },

  // ---------- 交付与协作（2 题）----------
  {
    id: "q-deliver-1",
    dimension: "delivery",
    scene: "交付表达",
    text: "你完成了 100 条标注数据，提交时附哪种说明？",
    options: [
      {
        id: "deliver1-full",
        text: "「共 100 条已完成；其中 3 条与规范有歧义，已按第 2 版规范处理并单独标出，见附表。」",
        score: 3,
      },
      {
        id: "deliver1-long",
        text: "逐条写 100 行说明，覆盖每一条的处理过程",
        score: 1,
      },
      {
        id: "deliver1-simple",
        text: "「做完了。」",
        score: 0,
      },
      {
        id: "deliver1-none",
        text: "不附说明，数据本身可以说明一切",
        score: 0,
      },
    ],
  },
  {
    id: "q-deliver-2",
    dimension: "delivery",
    scene: "协作沟通",
    text: "商单做到一半，你发现素材问题会导致交付晚半天。你会？",
    options: [
      {
        id: "deliver2-rush",
        text: "先不说，加急赶工争取按原时间交",
        score: 1,
      },
      {
        id: "deliver2-notify",
        text: "第一时间告知发包方，说明原因和新的交付时间",
        score: 3,
      },
      {
        id: "deliver2-late",
        text: "到截止时间再解释原因",
        score: 0,
      },
      {
        id: "deliver2-partial",
        text: "按原时间交当前完成的部分",
        score: 0,
      },
    ],
  },
];

/** 每维度题数 × 3 分 = 满分 */
export const dimensionMaxScore: Record<DimensionId, number> = {
  dialogue: 9,
  safety: 9,
  creation: 9,
  agent: 9,
  prompt: 6,
  delivery: 6,
};

export type ArchetypeId =
  | "dialogist"
  | "guardian"
  | "creator"
  | "analyst"
  | "communicator"
  | "explorer";

export type AssessmentArchetype = {
  id: ArchetypeId;
  /** 三字母代号，MBTI 式 */
  code: string;
  name: string;
  tagline: string;
  desc: string;
  /** 建议先接的任务方向 */
  recommendedDirections: string[];
  /** 下一步 3 件事 */
  nextSteps: string[];
};

export const assessmentArchetypes: Record<ArchetypeId, AssessmentArchetype> = {
  dialogist: {
    id: "dialogist",
    code: "DIA",
    name: "共情判断者",
    tagline: "你对「什么是好回复」有天然的手感",
    desc: "你能站在用户角度判断 AI 回复的好坏，并按标准而不是个人口味做选择。这正是对话训练与偏好标注任务最看重的能力，也是当下需求量最大的入门方向。",
    recommendedDirections: ["对话训练", "偏好标注", "回复质量评审"],
    nextSteps: [
      "去任务广场领一单「对话训练」类零门槛任务，完成首赚",
      "在技能树查看「模型训练与数据」还差哪些节点",
      "累计 3 单验收通过后，挑战更高单价的评审任务",
    ],
  },
  guardian: {
    id: "guardian",
    code: "GUA",
    name: "规则守护者",
    tagline: "规范在你手里不会走样",
    desc: "你会先看清规则再动手，遇到冲突知道反馈而不是硬做。数据质检、安全拒识类任务需要的就是这种「靠谱」，这类任务复购率高、验收通过率也稳。",
    recommendedDirections: ["数据质检", "安全拒识", "标注规范执行"],
    nextSteps: [
      "领一单「数据达标 / 质检」任务，用规范意识建立履约记录",
      "点亮「敏感词意识」「语料规范」补齐质检方向",
      "稳定交付后可进入优质池，获得任务优先邀请",
    ],
  },
  creator: {
    id: "creator",
    code: "CRE",
    name: "视觉叙事者",
    tagline: "你懂得先有故事，再有画面",
    desc: "你有创作方法论：先脚本后生成、会用局部重绘保住好构图、对品牌红线敏感。漫剧与广告商单单价最高，你离它只差几个工具技能。",
    recommendedDirections: ["AI 漫剧", "广告制作", "内容商单"],
    nextSteps: [
      "先接 1-2 单低门槛内容任务练手并赚到首笔",
      "学习点亮「分镜叙事」「AI 图像/视频工具」解锁漫剧与广告商单",
      "把交付作品沉淀到履约档案，冲品牌单邀请",
    ],
  },
  analyst: {
    id: "analyst",
    code: "ANA",
    name: "逻辑拆解者",
    tagline: "你不轻信 AI，你验证它",
    desc: "你会拆步骤、找源头、看调用记录哪里错了。Agent 评测是 2026 年增长最快的任务品类，懂工具调用逻辑的人还很稀缺，这是你的高价赛道。",
    recommendedDirections: ["Agent 评测", "工具调用轨迹评审", "评测标注"],
    nextSteps: [
      "领一单「评测标注」任务，熟悉平台验收口径",
      "点亮「Agent / 工具调用理解」进入评测任务池",
      "补「技术写作」，评测报告写得清楚单价更高",
    ],
  },
  communicator: {
    id: "communicator",
    code: "COM",
    name: "AI 沟通者",
    tagline: "你说得清楚，AI 就做得到位",
    desc: "你能把需求转成 AI 听得懂的指令，交付和协作时也说得明白。这是所有 AI 任务的通用底座——起步快，而且往任何方向升级都省力。",
    recommendedDirections: ["对话训练", "内容辅助", "任意零门槛任务"],
    nextSteps: [
      "任选一单零门槛任务完成首赚，验证手感",
      "观察自己在哪类任务里最顺，确定主方向",
      "沿主方向点亮对应技能节点，向高价单升级",
    ],
  },
  explorer: {
    id: "explorer",
    code: "EXP",
    name: "潜力探索者",
    tagline: "每个人的第一单，都从这里开始",
    desc: "你还在建立对 AI 任务的手感，这完全正常——平台上大量零门槛任务就是为现在的你准备的。先赚到第一笔钱，方向感会随着交付自然长出来。",
    recommendedDirections: ["零门槛任务", "基础标注", "中文造句补采"],
    nextSteps: [
      "领一单「无技能要求」任务，完成首单结算",
      "每天用 10 分钟和 AI 对话，熟悉它的能力边界",
      "两周后回来重测，看看你的类型变化",
    ],
  },
};

/** 维度 → 类型映射（该维度为最高分时）；提示与交付同属通用底座，都映射到沟通者 */
const dimensionToArchetype: Record<DimensionId, ArchetypeId> = {
  dialogue: "dialogist",
  safety: "guardian",
  creation: "creator",
  agent: "analyst",
  prompt: "communicator",
  delivery: "communicator",
};

export type DimensionScore = {
  dimension: AssessmentDimension;
  raw: number;
  max: number;
  /** 0-100 */
  normalized: number;
  level: "优势突出" | "基础在线" | "潜力萌芽";
};

export type SkillUnlockRule = {
  dimension: DimensionId;
  minScore: number;
  skillNames: string[];
};

/**
 * 得分 → 点亮技能树节点（只点 Tier 0-1 起步包）。
 * 高价资格包（漫剧制作师 / 广告制作师 / 模型训练师 / Agent 评测员）
 * 与 Tier 2 专业技能一律不通过测评点亮，需课程 / 任务履约。
 */
export const skillUnlockRules: SkillUnlockRule[] = [
  { dimension: "dialogue", minScore: 45, skillNames: ["中文表达"] },
  {
    dimension: "dialogue",
    minScore: 65,
    skillNames: ["对话训练新人", "对话质量判断"],
  },
  { dimension: "safety", minScore: 45, skillNames: ["规则执行"] },
  { dimension: "safety", minScore: 65, skillNames: ["安全意识", "敏感词意识"] },
  { dimension: "creation", minScore: 45, skillNames: ["广告文案"] },
  { dimension: "creation", minScore: 65, skillNames: ["产品表达"] },
  { dimension: "agent", minScore: 45, skillNames: ["逻辑拆解"] },
  {
    dimension: "agent",
    minScore: 65,
    skillNames: ["Agent / 工具调用理解"],
  },
  { dimension: "prompt", minScore: 45, skillNames: ["中文造句"] },
  { dimension: "prompt", minScore: 65, skillNames: ["提示词基础"] },
  { dimension: "delivery", minScore: 65, skillNames: ["交付沟通"] },
];

export type AssessmentResult = {
  version: 2;
  completedAt: string;
  archetypeId: ArchetypeId;
  intentOptionId: string | null;
  frequencyOptionId: string | null;
  scores: {
    dimensionId: DimensionId;
    raw: number;
    normalized: number;
  }[];
  litSkills: string[];
};

export const ASSESSMENT_STORAGE_KEY = "mc-assessment-v2";

function levelFor(normalized: number): DimensionScore["level"] {
  if (normalized >= 70) return "优势突出";
  if (normalized >= 40) return "基础在线";
  return "潜力萌芽";
}

/** 由答案（题目 id → 选项 id）计算完整测评结果 */
export function computeAssessmentResult(
  answers: Record<string, string>,
): AssessmentResult {
  const rawByDimension: Record<DimensionId, number> = {
    dialogue: 0,
    safety: 0,
    creation: 0,
    agent: 0,
    prompt: 0,
    delivery: 0,
  };

  for (const question of assessmentQuestions) {
    if (question.dimension === "profile") continue;
    const optionId = answers[question.id];
    const option = question.options.find((o) => o.id === optionId);
    if (option?.score !== undefined) {
      rawByDimension[question.dimension] += option.score;
    }
  }

  const scores = assessmentDimensions.map((dim) => {
    const raw = rawByDimension[dim.id];
    const normalized = Math.round((raw / dimensionMaxScore[dim.id]) * 100);
    return { dimensionId: dim.id, raw, normalized };
  });

  // 类型判定：全维度 < 40 → 探索者；否则取最高分维度对应类型
  const allLow = scores.every((s) => s.normalized < 40);
  let archetypeId: ArchetypeId = "explorer";
  if (!allLow) {
    const top = [...scores].sort((a, b) => b.normalized - a.normalized)[0];
    archetypeId = dimensionToArchetype[top.dimensionId];
  }

  const litSkills = Array.from(
    new Set(
      skillUnlockRules
        .filter((rule) => {
          const s = scores.find((x) => x.dimensionId === rule.dimension);
          return s !== undefined && s.normalized >= rule.minScore;
        })
        .flatMap((rule) => rule.skillNames),
    ),
  );

  return {
    version: 2,
    completedAt: new Date().toISOString().slice(0, 10),
    archetypeId,
    intentOptionId: answers["q-intent"] ?? null,
    frequencyOptionId: answers["q-frequency"] ?? null,
    scores,
    litSkills,
  };
}

export function toDimensionScores(result: AssessmentResult): DimensionScore[] {
  return result.scores.map((s) => {
    const dimension = assessmentDimensions.find((d) => d.id === s.dimensionId)!;
    return {
      dimension,
      raw: s.raw,
      max: dimensionMaxScore[s.dimensionId],
      normalized: s.normalized,
      level: levelFor(s.normalized),
    };
  });
}

/** 背景题「来平台最想做什么」→ 报告首条行动建议 */
const intentFirstStep: Record<string, string> = {
  "intent-earn": "今天就领一单「无技能要求」任务，先完成首笔结算",
  "intent-upgrade": "对照技能树，优先补齐目标方向缺的 1-2 个节点",
  "intent-explore": "从两个不同方向各领一单小任务，对比哪个更顺手",
  "intent-work": "挑一个和你本职最近的任务方向，把 AI 用法带回工作里",
};

/** 按测评意向个性化「接下来做的 3 件事」 */
export function personalizedNextSteps(result: AssessmentResult): string[] {
  const base = assessmentArchetypes[result.archetypeId].nextSteps;
  const intentStep = result.intentOptionId
    ? intentFirstStep[result.intentOptionId]
    : undefined;
  return intentStep ? [intentStep, ...base.slice(0, 2)] : base;
}

/** 读取本地保存的测评结果（仅客户端） */
export function loadAssessmentResult(): AssessmentResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ASSESSMENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AssessmentResult;
    if (parsed.version !== 2) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveAssessmentResult(result: AssessmentResult) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify(result));
}

export function clearAssessmentResult() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ASSESSMENT_STORAGE_KEY);
}

/** 计分题数量（用于进度显示） */
export const scoredQuestionCount = assessmentQuestions.filter(
  (q) => q.dimension !== "profile",
).length;
