-- 上线任务替换（2026-09-30）
-- 来源：SOP1-任务数据填报模板_20260930.xlsx 中 4 条有效任务
--
-- 会清空：全部任务、任务报名、任务技能门槛、任务交付、任务结算
-- 不会动：用户、技能目录、用户已点亮技能、活动、岗位、银行卡
-- 不写 TaskSkill（这四条都不设技能门槛）
-- displayJoinedCount 只用于「已有 N 人参与」展示，不占 quota，报名校验仍看真实报名
--
-- 用法（先备份，再在线上库执行）：
--   psql "$DATABASE_URL" -f prisma/sql/20260930_replace_online_tasks.sql

BEGIN;

ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "displayJoinedCount" INTEGER NOT NULL DEFAULT 0;

DELETE FROM "Review"
WHERE "submissionId" IN (
  SELECT "id" FROM "Submission" WHERE "taskId" IS NOT NULL
);

DELETE FROM "Submission" WHERE "taskId" IS NOT NULL;
DELETE FROM "Settlement" WHERE "taskId" IS NOT NULL;
DELETE FROM "TaskApplication";
DELETE FROM "TaskSkill";
DELETE FROM "Task";

DO $body$
DECLARE
  v_owner text;
BEGIN
  SELECT u.id INTO v_owner
  FROM "User" u
  WHERE u.id = 'demo-task-owner';

  IF v_owner IS NULL THEN
    SELECT u.id INTO v_owner
    FROM "User" u
    WHERE 'ADMIN' = ANY (u.roles)
    ORDER BY u."createdAt" ASC
    LIMIT 1;
  END IF;

  IF v_owner IS NULL THEN
    SELECT u.id INTO v_owner
    FROM "User" u
    ORDER BY u."createdAt" ASC
    LIMIT 1;
  END IF;

  IF v_owner IS NULL THEN
    RAISE EXCEPTION '没有可用发包方账号，请先保证库里至少有一个用户';
  END IF;

  INSERT INTO "Task" (
    "id", "ownerId", "title", "summary", "description", "category",
    "rewardText", "rewardAmount", "rewardUnit", "quota", "deadline",
    "workType", "location", "suitFor", "publisherName", "publisherNote",
    "deliverables", "acceptance", "specs", "requirements", "enrollSteps",
    "references", "status", "displayJoinedCount", "createdAt", "updatedAt"
  ) VALUES
  (
    'task-1', v_owner,
    '大模型语音标注「多轮对话偏好标注」',
    '对助手回复进行排序与点评，输出可验收的偏好对数据',
    $d$围绕多轮对话场景，对同一问题的多条助手回复做偏好排序与简要点评，沉淀可训练、可复验的偏好对数据。本商单面向有中文语感、能稳定判断回复质量的创作者。$d$,
    '对话训练',
    '￥200/天', 300, '天', 200,
    TIMESTAMPTZ '2027-12-31 23:59:59+08',
    '远程兼职', '不限地区',
    '有对话标注 / 内容审核经验，或长期使用大模型的创作者',
    '某头部对话模型团队（脱敏）',
    '历史验收准时率 98% · 好评结算',
    ARRAY['偏好排序结果表（平台模板）', '关键 case 点评（每百条不少于 8 条）'],
    ARRAY['排序理由可复述，不出现明显随意打分', '敏感、违规内容按规范标记，不漏标', '每日提交量与质量抽检通过率 ≥ 90%'],
    ARRAY['按平台模板填写排序结果，不可自建字段', '点评需说明理由，禁止仅写「更好 / 更差」', '涉及敏感内容必须按标签体系标记', '单日提交建议 100–300 条，超量需提前报备'],
    ARRAY['实名接单资料', '试标账号权限', '完成 10 条试标并通过抽检'],
    ARRAY['完善接单资料', '完成 10 条试标', '确认领取并开工'],
    '[{"label":"偏好标注手册（示例）","href":"#"},{"label":"优质 / 劣质回复对照样例","href":"#"}]'::jsonb,
    'RECRUITING', 168, NOW(), NOW()
  ),
  (
    'task-7', v_owner,
    '海外短剧分发 OPC',
    'AI短剧二创，在海外平台进行推广、运营',
    $d$在平台上选择爆款短剧，进行二次创作，把创作的视频发放到海外社交平台，进行推广、运营，占领海外AI短剧市场，促成最终变现$d$,
    'AI 漫剧',
    '¥300 / 天', 2000, '天', 3000,
    TIMESTAMPTZ '2027-12-31 23:59:59+08',
    '远程兼职', '不限地区',
    '有短剧、漫剧经验优先，会视频剪辑',
    '某知名短剧出海团队',
    '按月结算',
    ARRAY['成片 MP4', '画面清晰无模糊、卡顿等问题', '字幕无误', '成品无违规画面、台词'],
    ARRAY['30秒以内的短剧二创视频'],
    ARRAY['成片时长60秒~120秒；视频添加首尾帧，引导用户关注；视频前3秒钩子；视频加封面；不得出现原视频的logo等内容'],
    ARRAY['熟练使用剪映等剪辑软件', '可独立完成视频制作', '时间稳定保证量产', '态度端正'],
    ARRAY['完善作品集链接', '提交风格小样', '确认领取并开工'],
    '[{"label":"视频剪辑模板","href":"#"},{"label":"短剧二创视频模板","href":"#"}]'::jsonb,
    'RECRUITING', 486, NOW(), NOW()
  ),
  (
    'task-12', v_owner,
    '具身智能抓夹数据采集',
    '穿戴抓夹设备采集真实场景操作数据，经 SLAM 与人工质检验收后按有效时长结算',
    $d$本项目面向具身智能模型训练，招募采集人员在固定采集点穿戴抓夹等设备，按任务描述完成真实场景中的抓取、摆放、整理等操作并录制三路画面数据。数据经 SLAM 全量自动质检（约占 40%）与人工抽检（30%）双重验收，合格数据按有效时长结算。项目需求 500 人；结算条款：大于 3 小时有效时长起算结算，每小时 30 元，次月月度结算。$d$,
    '数据达标',
    '¥30 / 小时', 30, '小时', 500,
    TIMESTAMPTZ '2027-12-31 23:59:59+08',
    '驻场项目制', '仅限中国大陆',
    '动作稳定、有耐心，可在固定采集点长时间作业（零基础经培训可上岗）',
    '某具身智能AI团队（脱敏）',
    '次月月度结算 · 有效时长满 3 小时起算',
    ARRAY['有效采集数据（三路画面视频，已上传平台）', '数据上传成功回执'],
    ARRAY['SLAM 全量质检通过', '人工质检抽检合格，无否决项', '两大多样性打分项不取 0 分', '单条时长≤10 分钟且无水时长'],
    ARRAY['全程匀速，画面特征点充足', '单条任务时长≤10 分钟，推荐 3~5 分钟', '严禁水时长、看手机、疑似非真实场景', '结束前手站稳后再停止录制'],
    ARRAY['在指定平台注册并加入项目组织', '按规范设置账号编号', '观看甲方培训课程', '自备或按项目配置采集设备（手机、抓夹）'],
    ARRAY['报名并完善接单资料', '参加培训并熟悉采集规则', '确认领取并开工'],
    '[{"label":"甲方培训课程","href":"https://meeting.tencent.com/crm/KD6G9rQZ0a"}]'::jsonb,
    'RECRUITING', 357, NOW(), NOW()
  ),
  (
    'task-13', v_owner,
    'AI数据标注（爬虫视频质量判定）',
    '按美感等级（高/中/低）对爬虫视频标注判定，产出达标标注数据',
    $d$本项目为 AI 数据标注项目，标注员在 SkyVendorise 平台接单，按《爬虫视频质量判定标注规则-对外》对爬虫视频进行高美感/中美感/低美感分级标注与质检，合格标注经质检员交付后进入结算。项目需求 500 人；结算条款：150 元-300 元/天，次月月度结算。$d$,
    '评测标注',
    '¥150~300 / 天', 300, '天', 500,
    TIMESTAMPTZ '2027-12-31 23:59:59+08',
    '远程兼职', '不限地区',
    '可零基础入门，细心耐心、具备基础电脑操作能力的接单学员',
    '易通亿商务服务（北京）有限公司',
    '次月月度结算 · 按天计价 150-300 元',
    ARRAY['标注结果（经质检员交付的任务包）'],
    ARRAY['标注准确率≥95%', '经质检员质检通过并交付的任务包方可结算', '判定符合《爬虫视频质量判定标注规则》'],
    ARRAY['严格按平台要求格式与渠道提交', '在规定截止时间前提交', '标注数据、规则、截图不得外传', '严禁代写、代做、转卖任务'],
    ARRAY['完成平台账号注册并加入甲方数据公司', '账号编号按 AP-ZQXXX 格式设置', '完整观看培训会议回放', '准确率须达 95% 以上'],
    ARRAY['在平台注册账号', '加入项目组织并设置账号编号', '观看培训会议回放后开工'],
    '[{"label":"SkyVendorise平台","href":"https://www.skyvendorise.com/skyvendor/dashboard/workbench"},{"label":"培训会议回放","href":"https://meeting.tencent.com/crm/Ngp1dp0e79"}]'::jsonb,
    'RECRUITING', 429, NOW(), NOW()
  );
END
$body$;

COMMIT;

SELECT "id", "title", "quota", "displayJoinedCount", "status"
FROM "Task"
ORDER BY "id";
