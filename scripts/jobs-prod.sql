-- 岗位表 + 当前库内岗位数据（可在生产 PostgreSQL 直接执行）
-- 幂等：表已存在会跳过；岗位按 id upsert

DO $$ BEGIN
  CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "Job" (
    "id" TEXT NOT NULL,
    "campaign" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT NOT NULL,
    "department" TEXT,
    "jobType" TEXT,
    "location" TEXT,
    "locationNote" TEXT,
    "headcount" INTEGER,
    "salaryText" TEXT,
    "publisherName" TEXT NOT NULL,
    "publisherNote" TEXT,
    "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
    "listed" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Job_status_listed_campaign_idx" ON "Job"("status", "listed", "campaign");
CREATE INDEX IF NOT EXISTS "Job_jobType_idx" ON "Job"("jobType");
CREATE INDEX IF NOT EXISTS "Job_location_idx" ON "Job"("location");

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-1','tencent','腾讯视频-产品leader-端体验方向（北京/深圳）(深圳)','1.全局把控与规划： 深度洞察行业趋势、用户需求与竞争格局，制定中长期产品战略与路线图。具备C端产品经验，有过独立负责端产品的能力，有创造力，审美好。为关键产品…','1.全局把控与规划： 深度洞察行业趋势、用户需求与竞争格局，制定中长期产品战略与路线图。具备C端产品经验，有过独立负责端产品的能力，有创造力，审美好。为关键产品决策负责，明确产品在不同阶段的优先级与目标；
2.用户体验与增长： 以用户为中心，主导端侧用户体验的全链路设计、优化与创新。通过数据驱动的方法，系统性提升用户活跃、留存、时长及会员转化等核心指标，对产品的整体增长负责；
3.产品创新与落地： 探索并孵化创新视频产品形态与功能。高效协调设计、技术、运营、市场等多部门资源，确保高质量产品迭代如期上线；
4.跨团队协同： 与会员、广告、内容、技术等团队紧密合作，在保障用户体验的前提下，实现商业价值和用户规模的可持续增长。','视频产品部','产品经理','深圳','北京/深圳',1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,1,'2026-07-29T09:21:17.000Z','2026-08-27T03:13:29.385Z','2026-08-27T03:13:29.385Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-2','tencent','混元大模型高级研发项目经理（北京/深圳）(北京)','1.负责大模型研发项目的目标对齐、计划拟定、过程管理、风险控制；与算法、产品、工程、数据等多个团队深度合作，确保目标得到精准理解并高效实现；','1.负责大模型研发项目的目标对齐、计划拟定、过程管理、风险控制；与算法、产品、工程、数据等多个团队深度合作，确保目标得到精准理解并高效实现；
2.建立和优化公共流程、机制、规范，提升内外协同效率，提供稳定高效的管理工具；
3.负责团队知识管理和沉淀， 赋能项目成员。','基础模型部','研发项目管理','北京','北京/深圳',1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,2,'2026-07-08T01:46:33.000Z','2026-08-27T03:13:29.391Z','2026-08-27T03:13:29.391Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-3','tencent','OG项目组-游戏高级项目经理(深圳)','1.负责配合创意总监制定项目规划和计划，跟进和推进项目进度，有效管理项目风险，并有效跟踪与推进，确保关键节点按时交付；','1.负责配合创意总监制定项目规划和计划，跟进和推进项目进度，有效管理项目风险，并有效跟踪与推进，确保关键节点按时交付；
2.对接美术外包团队包括海外团队，进行商务谈判，制定美术外包计划，安排和验收其工作内容；
3.面试并筛选组建高级别的游戏3A级的团队，建立3A级游戏的制作流程；
4.负责项目资源的跨部门协调与组织，确保项目团队各干系人协同工作，高效沟通；
5.负责项目组的日常管理工作，明确成员分工与目标，建立高效透明的沟通机制，提升团队协作效率与战斗力；
6.及时发现并跟踪解决项目问题，识别执行过程中的风险，并积极推动、协助制定解决方案；
7.作为项目接口人，高效协调美术、程序、策划、测试、运营等多部门工作，保障信息流畅通与目标一致。','BST创想中心','综合项目管理','深圳',NULL,2,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,3,'2026-08-07T16:19:57.000Z','2026-08-27T03:13:29.393Z','2026-08-27T03:13:29.393Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-4','tencent','微信输入法-语音识别算法工程师 / 研究员(北京)','1.负责语音识别核心技术的研发与优化，推动语音识别能力在公司内外多元业务场景中的规模化落地，持续核心技术表现；','1.负责语音识别核心技术的研发与优化，推动语音识别能力在公司内外多元业务场景中的规模化落地，持续核心技术表现；
2.持续跟踪语音识别与大模型发展的前沿技术，推动新算法、新模型的研究、验证与业务落地。','读书产品部','应用研究','北京',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,4,'2026-07-27T03:26:07.000Z','2026-08-27T03:13:29.395Z','2026-08-27T03:13:29.395Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-5','tencent','腾讯视频-会员运营高级专家(北京)','1.会员生命周期运营与促活。设计会员全生命周期运营策略，覆盖拉新、激活、留存、召回等核心环节；制定会员分层精细化运营方案，基于不同价值层级会员实施差异化触达；策…','1.会员生命周期运营与促活。设计会员全生命周期运营策略，覆盖拉新、激活、留存、召回等核心环节；制定会员分层精细化运营方案，基于不同价值层级会员实施差异化触达；策划并落地会员促活专项动作，包括会员日/会员节活动、权益感知强化、沉默会员唤醒等；协同产品、技术团队，推动会员运营工具的迭代升级；
2.企微私域建联与运营。搭建并运营企业微信私域生态，建立与核心会员的有效连接通道；设计企微建联链路（扫码添加、支付后关注、小程序跳转等），优化添加率、留存率与互动率；制定企微社群运营策略及SOP化触达机制，提升社群活跃度与转化效率；管理企微个人号及社群矩阵，沉淀会员画像标签，实现人群精准触达；
3.行业研究与动态追踪。持续跟踪新消费、连锁零售、餐饮茶饮等行业头部品牌的会员策略与私域运营动态；定期输出行业会员运营深度研究报告，为团队提供策略参考与创新思路；对竞品会员体系进行系统性拆解分析（等级、积分、权益、触达手段等维度），输出可落地的优化建议。','视频订阅与商业化部','商业运营与拓展','北京',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,5,'2026-08-07T02:42:25.000Z','2026-08-27T03:13:29.397Z','2026-08-27T03:13:29.397Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-6','tencent','光子 AI-游戏数据科学专家(深圳)','1.利用游戏海量数据，设计和构建游戏大模型，包括但不限于社交网络分析，推荐，异常用户挖掘等，为产品设计研发及运营提供支持；','1.利用游戏海量数据，设计和构建游戏大模型，包括但不限于社交网络分析，推荐，异常用户挖掘等，为产品设计研发及运营提供支持；
2.数据特征算法：负责海量文本&多模态数据（图像，视频，音频，3D）的内容理解（如分类标签体系、embedding表征、Caption生成等），质量检测（低质识别检测、优质美学评价等），去重/聚类分析，数据合成等算法；
3.关注行业前沿动态，保持行业敏感度，对竞品有专业的研究和分析。','光子技术发展部','数据科学','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,6,'2024-05-08T06:39:50.000Z','2026-08-27T03:13:29.398Z','2026-08-27T03:13:29.398Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-7','tencent','光子 AI-专家游戏策划(深圳)','1.战略与规划。负责部门 AI 产品的整体规划与路线图制定，结合行业痛点定义核心价值场景；跟踪 AI 技术前沿与行业动态，分析竞品，确保产品长期竞争力；进行产品…','1.战略与规划。负责部门 AI 产品的整体规划与路线图制定，结合行业痛点定义核心价值场景；跟踪 AI 技术前沿与行业动态，分析竞品，确保产品长期竞争力；进行产品的市场与竞争分析，并调整产品策略；
2.产品全生命周期管理。主导产品从需求调研、方案设计、开发协同到上线迭代及效果复盘的全过程；负责将复杂的业务问题转化为可行的 AI 产品方案，明确技术边界与落地可行性；协调算法、研发、数据团队，确保产品技术方案的实施；
3.商业化落地与驱动。推动AI能力在具体业务场景中落地，解决实际问题，并对产品的商业结果负责；设计数据反馈闭环，通过效果复盘驱动产品持续优化。','光子技术发展部','产品策划','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,7,'2026-01-21T06:47:06.000Z','2026-08-27T03:13:29.399Z','2026-08-27T03:13:29.399Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-8','tencent','《洛克王国：世界》IP品牌管理经理(深圳)','1.建立并维护《洛克王国：世界》 IP 全球统一的使用规范、视觉标准与世界观资料库，确保所有授权产品、宣传物料严格符合 IP 设定；','1.建立并维护《洛克王国：世界》 IP 全球统一的使用规范、视觉标准与世界观资料库，确保所有授权产品、宣传物料严格符合 IP 设定；
2.制定标准化的监修流程与审核标准，对授权产品的设计、生产、宣传全环节进行监修，严格把控 IP 调性，杜绝 OOC（脱离角色）问题；
3.制定全产业链分级授权策略，涵盖快消、服饰、数码及空间授权（如主题展、快闪店）等领域；
4.跟踪 IP 授权行业动态与竞品策略，分析用户消费偏好，挖掘新的授权品类与合作机会，提升 IP 商业价值；
5.与游戏研发、市场、法务、供应链等部门紧密配合，保障授权项目顺利推进，维护 IP 长期健康发展。','魔方发行中心','消费互联网营销','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,8,'2026-05-15T03:54:09.000Z','2026-08-27T03:13:29.401Z','2026-08-27T03:13:29.401Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-9','tencent','光子 AI-模型数据算法专家/负责人-数据方向(深圳)','1.作为模型数据团队的技术负责人，统筹数据治理到模型训练之间的衔接工作，制定数据标准、质量规范和团队技术路线；','1.作为模型数据团队的技术负责人，统筹数据治理到模型训练之间的衔接工作，制定数据标准、质量规范和团队技术路线；
2.数据特征算法：负责海量文本&多模态数据（图像，视频，音频，3D）的内容理解（如分类标签体系、embedding表征、Caption生成等），质量检测（低质识别检测、优质美学评价等），去重/聚类分析，数据合成等算法；
3.数据管线建设：负责数据采集、筛选清洗、标注与质量评估管线建设。与模型业务团队紧密配合，充分分析挖掘数据资源，建立自动化数据处理流程与机制，支持模型持续迭代；
4.数据实验分析：对模型训练数据进行详细分析，建立科学数据实验机制，识别样本不足、质量问题、配比不均衡等潜在问题，驱动数据优化提升数据覆盖、质量、多样性需求，最终带来大模型生成效果的持续提升；
5.带领并指导团队成员，制定工作计划、评审技术方案、把控交付质量。','光子技术发展部','应用研究','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,9,'2026-05-28T08:27:47.000Z','2026-08-27T03:13:29.402Z','2026-08-27T03:13:29.402Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-10','tencent','光子 AI-游戏模型数据专家-研发数据(深圳)','1.多模态模型数据处理：负责游戏研发阶段多模态模型的数据处理， 包括不仅限文档OCR、版面理解、表格/公式识别、图表解析、图片视频解析等核心场景，以业务问题为驱…','1.多模态模型数据处理：负责游戏研发阶段多模态模型的数据处理， 包括不仅限文档OCR、版面理解、表格/公式识别、图表解析、图片视频解析等核心场景，以业务问题为驱动，持续提升模型效果；
2.数据闭环建设：主导数据优化工作，包括问题样本与难例自动化挖掘、多源异构模型交叉投票标注、视觉渲染闭环质量校验、数据分布结构性优化等，构建高质量、可持续迭代的数据飞轮；
3.专项难题攻关：针对复杂表格、公式、图表、图片、视频等复杂场景，设计并落地专项技术方案，解决解析不全、解析错乱等核心问题；
4.前沿技术转化：持续跟踪多模态大模型前沿进展，结合业务场景完成技术选型与落地验证。','光子技术发展部','数据科学','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,10,'2026-05-28T08:27:47.000Z','2026-08-27T03:13:29.403Z','2026-08-27T03:13:29.403Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-11','tencent','光子 AI-游戏模型评测专家(深圳)','1.构建游戏模型评测体系：通过紧跟先进模型及应用的前沿发展，设计全面、准确的多维度指标，建立覆盖多模态（文本/语音/图像/视频/3D等）生成、多模态理解等全面、…','1.构建游戏模型评测体系：通过紧跟先进模型及应用的前沿发展，设计全面、准确的多维度指标，建立覆盖多模态（文本/语音/图像/视频/3D等）生成、多模态理解等全面、多维度的评测体系；
2.构建游戏模型评测流程：协同多方相关团队梳理并构建游戏模型评测流程，定期监控模型效果，分析问题并提供优化方案，把模型评测流程高效落地；
3.积极洞察行业动态：持续完善评测体系、快速反馈行业动态及模型能力，发现行业模型以及应用的前进方向、亮点；
4.结果归因：通过各种数据分析方法，深度分析模型评测结果，为模型的更新调优提供精准的问题分析结论。','光子技术发展部','行业应用','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,11,'2026-05-28T08:27:47.000Z','2026-08-27T03:13:29.404Z','2026-08-27T03:13:29.404Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-12','tencent','光子 AI-推理部署与优化研究员(深圳)','1.推动基于Diffusion的视频模型推理时效率优化；','1.推动基于Diffusion的视频模型推理时效率优化；
2.针对消费级显卡优化推理 pipeline，目标实现端侧高效生成；
3.设计高并发推理服务，实现多模型路由与灰度发布；
4.建设端到端超低延迟管线，融合硬件加速编解码；
5.研发高效视频编码配置，适配实时流媒体协议；
6.跟踪最新加速方法，探索投机式扩散采样与训推一体优化。','光子技术发展部','应用研究','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,12,'2026-06-17T02:02:06.000Z','2026-08-27T03:13:29.405Z','2026-08-27T03:13:29.405Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-13','tencent','光子 AI-视频生成基础模型研究员(深圳)','1.设计与迭代下一代视频生成基础架构；','1.设计与迭代下一代视频生成基础架构；
2.探索长视频生成核心技术：长上下文注意力、KV Cache 压缩、记忆机制等；
3.研究高压缩比视频 Tokenizer，推进多分辨率、多帧率统一建模能力；
4.主导千亿/万亿 token 级别视频预训练，定义 data mixture 与 curriculum learning 策略；
5.探索 Scaling Law，输出科学的 scale-up 路径，持续提升模型关键能力；
6.跟踪业界 SOTA，主导对比实验，输出技术路线决策与论文发表。','光子技术发展部','应用研究','深圳',NULL,2,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,13,'2026-06-17T02:02:06.000Z','2026-08-27T03:13:29.406Z','2026-08-27T03:13:29.406Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-14','tencent','光子 AI-大语言模型Coding算法专家(深圳)','1.参与Coding方向的大模型算法研发，构建能够理解复杂代码任务，完成游戏场景软件工程任务的智能体系统；','1.参与Coding方向的大模型算法研发，构建能够理解复杂代码任务，完成游戏场景软件工程任务的智能体系统；
2.提升Code Agent在代码能力、指令遵循、长程任务执行等方向上的核心能力；
3.参与大模型预训练与后训练优化，包括但不限于数据构建、SFT、RL算法、Reward设计，持续提升模型Coding能力；
4.构建面向游戏场景的评测体系与数据闭环，包括Benchmark、数据回流和针对性能力优化。','光子技术发展部','应用研究','深圳',NULL,5,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,14,'2026-06-17T04:37:22.000Z','2026-08-27T03:13:29.407Z','2026-08-27T03:13:29.407Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-15','tencent','混元大模型平台产品经理（北京/深圳）(北京)','1.一站式AI Infra底座体系建设：围绕混元大模型全链路研发流程，统筹设计模型训练、效果评测、服务部署、底层调度、版本迭代的一站式平台产品能力，构建标准化、…','1.一站式AI Infra底座体系建设：围绕混元大模型全链路研发流程，统筹设计模型训练、效果评测、服务部署、底层调度、版本迭代的一站式平台产品能力，构建标准化、可复用、高效率的模型研发基础设施，支撑内部模型规模化、常态化迭代交付；
2.大模型评测体系产品化落地：负责AI评测平台核心能力搭建与体系升级，深度对齐通用/专业Benchmark评测标准、评测数据集管理、评测任务编排、多版本模型对照、效果归因分析等全流程产品设计，搭建标准化、自动化、可追溯的模型质量评估闭环，保障混元模型迭代精度与效果稳定性；
3.跨团队技术需求治理与项目落地：深度对接算法研发、AI工程、框架团队、算力平台等核心角色，拆解复杂技术诉求、沉淀通用产品能力、输出完整方案与PRD，持续推进平台能力落地、流程提效、体验升级与技术壁垒沉淀；
4.平台效能优化与长期规划：持续复盘模型研发链路瓶颈，针对训练调试成本高、评测链路碎片化、部署迭代低效等问题，输出体系化产品解法，推动AI研发流程标准化、自动化、集约化建设。','基础模型部','产品经理','北京','北京/深圳',2,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,15,'2026-06-26T11:39:50.000Z','2026-08-27T03:13:29.408Z','2026-08-27T03:13:29.408Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-16','tencent','资深unity客户端工程师(上海)','1.负责系统组业务管理工作，包括任务拆解、排期评估、进度跟踪等等；','1.负责系统组业务管理工作，包括任务拆解、排期评估、进度跟踪等等；
2.负责系统组梯队建设，人才培养；
3.基于AI重塑工作流，提升研发效率和质量；
4.负责核心系统的架构设计和方案选型。','生态发展部','游戏客户端开发','上海',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,16,'2026-07-02T02:46:47.000Z','2026-08-27T03:13:29.409Z','2026-08-27T03:13:29.409Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-17','tencent','光子 AI-高级研究员-语音合成与多模态大模型(深圳)','1.基于大语言模型（LLM）及多模态/全模态大模型，研究和开发前沿语音合成与生成算法（如 TTS、语音转换、声音/音乐生成等）；','1.基于大语言模型（LLM）及多模态/全模态大模型，研究和开发前沿语音合成与生成算法（如 TTS、语音转换、声音/音乐生成等）；
2.开发和优化面向线上应用的语音及音频合成系统，提升效果、效率和可扩展性；
3.探索并推进全双工/流式多模态大模型在语音理解、语音生成及实时语音交互方面的能力；
4.与研究和工程团队跨职能协作，推动项目从原型验证到生产落地。','光子技术发展部','应用研究','深圳',NULL,2,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,17,'2026-07-10T04:46:23.000Z','2026-08-27T03:13:29.411Z','2026-08-27T03:13:29.411Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-18','tencent','AI产品策划-银发方向(北京)(深圳)','1.主导面向中老群体的AI创新产品，从需求洞察、方案设计到落地推进，对业务结果负责；','1.主导面向中老群体的AI创新产品，从需求洞察、方案设计到落地推进，对业务结果负责；
2.聚焦银发用户特有行为，通过调研与数据分析，持续优化产品体验与商业转化；
3.探索大模型在适老化交互中的应用，联动产研运团队高效落地，保持行业敏感度。','公共数据科学部','产品策划','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,18,'2026-07-21T02:09:21.000Z','2026-08-27T03:13:29.412Z','2026-08-27T03:13:29.412Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-19','tencent','腾讯视频-动画内容制片人（欧罗巴工作室）(北京)','1.识别、筛选、评估、引入编剧的原创选题，主导重点原创选题的深度孵化开发；','1.识别、筛选、评估、引入编剧的原创选题，主导重点原创选题的深度孵化开发；
2.整合行业专家资源服务于内容创作，自主研发选题，负责搭建、更新内容选题池。并且能够进行选题-编剧的精准匹配，全流程孵化优质内容；
3.评估选题/IP的系列化开发潜力，规划并支持长线系列项目的开发创作；
4.对动画市场进行分析调研，紧密跟踪行业趋势、创新模式，总结提炼内容创作方法论。','欧罗巴工作室','内容创作','北京','欧罗巴工作室',1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,19,'2026-07-31T07:31:45.000Z','2026-08-27T03:13:29.413Z','2026-08-27T03:13:29.413Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-20','tencent','灰境行者-系统策划-商业化方向(上海)','1.负责游戏商业化系统的整体框架（如商城、通行证、礼包等）、需求撰写、开发跟进和最终交付质量；','1.负责游戏商业化系统的整体框架（如商城、通行证、礼包等）、需求撰写、开发跟进和最终交付质量；
2.负责游戏内各类商业化资产的需求发起与推进落地，并跟踪上线后的数据效果，持续优化迭代商业化内容；
3.​设计游戏内短期及长期活动类系统（如节日活动、版本主题活动），提升玩家活跃度；
4.对接运营相关需求，提供活动配置、版本宣传等支持；
5.分析游戏线上数据与用户行为，发现商业化和外观类潜在问题与提升方向。敏锐捕捉媒体平台的流行元素，并能将其巧妙结合到游戏外观和活动中。','北极光A3工作室','游戏策划','上海',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,20,'2025-12-28T15:28:47.000Z','2026-08-27T03:13:29.414Z','2026-08-27T03:13:29.414Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-21','tencent','《王者荣耀》游戏AI算法研究员- LLM/NLP方向(成都)','1.负责LLM在王者荣耀及相关生态游戏领域应用， 能针对业务场景需求对模型进行设计和优化，包括但不限于剧情生成、可控NPC对话、社交聊天、逻辑推理、游戏盘面推理…','1.负责LLM在王者荣耀及相关生态游戏领域应用， 能针对业务场景需求对模型进行设计和优化，包括但不限于剧情生成、可控NPC对话、社交聊天、逻辑推理、游戏盘面推理等。','天美L1工作室','应用研究','成都',NULL,0,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,21,'2026-02-01T15:16:05.000Z','2026-08-27T03:13:29.416Z','2026-08-27T03:13:29.416Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-22','tencent','QQ-多模态大模型算法工程师-深圳/北京(深圳)','1.负责多模态大模型的算法优化，及在多模态内容理解、图像/视频/3D生成方面的业务落地；','1.负责多模态大模型的算法优化，及在多模态内容理解、图像/视频/3D生成方面的业务落地；
2.调研多模态大模型的业界前沿算法，包括但不限于如预训练、后训练、强化学习、持续学习、理解&生成统一模型、世界模型等，并应用在产品项目中；
3.参与项目讨论，基于技术判断和技术优化对相关产品应用提出改进建议。','AI应用产品中心','应用研究','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,22,'2026-01-22T07:18:22.000Z','2026-08-27T03:13:29.417Z','2026-08-27T03:13:29.417Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-23','tencent','浏览器内核与自动化工程师（AI Agent领域）(深圳)','1.研发面向AI Agent 产品的边缘浏览器，为智能体产品提供低Token 成本、高语义保真的网页上下文；','1.研发面向AI Agent 产品的边缘浏览器，为智能体产品提供低Token 成本、高语义保真的网页上下文；
2.深度定制基于 Playwright/Chromium 的浏览器自动化引擎，优化浏览器的运行性能、稳定性与多平台兼容性，实现环境指纹的动态模拟；
3.深入理解浏览器内核渲染机制，提升动态渲染（JS加载、AJAX异步数据）页面的完整性；
4.负责网页内容结构化降噪与正文提取，以及基于Query的网页内容总结与意图提取。','云架构平台部','后台开发','深圳','AI Agent领域',1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,23,'2026-06-21T09:18:03.000Z','2026-08-27T03:13:29.418Z','2026-08-27T03:13:29.418Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-24','tencent','微信-视觉设计师-AIGC/模型美学方向(广州)','1.负责图像/视频生成大模型的美学标准制定、数据采集、模型调优与效果验收等工作；','1.负责图像/视频生成大模型的美学标准制定、数据采集、模型调优与效果验收等工作；
2.跟踪 AIGC 工具与视觉趋势，形成专业洞察与美学规范，推动模型美学能力持续优化；
3.探索 AIGC 技术在业务场景中的创新应用，包括但不限于视频特效模板、直播礼物、互动内容等方向。','基础产品部','视觉设计','广州',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,24,'2026-06-03T09:02:49.000Z','2026-08-27T03:13:29.419Z','2026-08-27T03:13:29.419Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-25','tencent','和平精英-2D美宣设计师-玩法(深圳)','1.参与前瞻性设计讨论，根据项目需求配合团队完成主视觉和宣传美宣的设计工作；','1.参与前瞻性设计讨论，根据项目需求配合团队完成主视觉和宣传美宣的设计工作；
2.高审美有创意会AI等前沿工具的候选人优先，可独立完成创意设计提案，为项目的演绎内容绘制分镜和氛围稿；
3.协助推进外部设计资源，跟进并把控外包设计的品质效果。','S工作室','2D角色设计','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,25,'2026-01-12T03:10:02.000Z','2026-08-27T03:13:29.421Z','2026-08-27T03:13:29.421Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-26','tencent','腾讯混元大模型数据飞轮产品经理(北京)','1.数据飞轮闭环搭建：负责混元大模型数据飞轮体系产品设计与落地，挖掘模型使用短板与业务痛点，搭建「使用-回流-迭代升级」的正向数据闭环；','1.数据飞轮闭环搭建：负责混元大模型数据飞轮体系产品设计与落地，挖掘模型使用短板与业务痛点，搭建「使用-回流-迭代升级」的正向数据闭环；
2.数据驱动模型能力升级：基于用户Workflow及真实场景，联动算法、数据团队分析模型能力缺陷，针对性迭代数据飞轮规则与工具能力，不断反哺模型训练、微调与能力优化，持续提升混元大模型专业度与场景适配性；
3.产品全生命周期落地：独立完成需求调研、产品方案设计、数据复盘全流程，持续优化数据链路、Agent工具体验与数据飞轮机制，保障体系可持续迭代。','AI Data部','产品策划','北京',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,26,'2026-06-09T07:11:57.000Z','2026-08-27T03:13:29.422Z','2026-08-27T03:13:29.422Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-27','tencent','后台开发负责人-AI方向(北京)','1.负责AI应用工程基建的整体技术规划与路线图设计。探索AI提升工程研效的新生产模式，主导构建与优化面向生产环境的AI工程化能力；','1.负责AI应用工程基建的整体技术规划与路线图设计。探索AI提升工程研效的新生产模式，主导构建与优化面向生产环境的AI工程化能力；
2.主导后台技术架构的规划、设计与演进，确保系统的高可用、高性能与高扩展性；
3.负责后台AI研发团队管理与建设，提升团队的研发效能与创新速度。','视频技术部','后台开发','北京',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,27,'2026-07-21T02:12:02.000Z','2026-08-27T03:13:29.423Z','2026-08-27T03:13:29.423Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-28','tencent','大数据调度工具开发专家/架构师（DataOps 方向）（深圳/北京）(深圳)','1.设计并实现高性能、高可用的分布式任务调度引擎，支持分钟级百万任务调度；','1.设计并实现高性能、高可用的分布式任务调度引擎，支持分钟级百万任务调度；
2.构建分布式调度系统的高可用架构，实现故障自动转移与恢复；
3.设计并实现监控告警体系，推动调度系统的可观测性建设；
4.推动代码质量、单元测试和工程规范落地。','数据计算平台部','后台开发','深圳','DataOps 方向',1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,28,'2026-04-10T02:20:57.000Z','2026-08-27T03:13:29.424Z','2026-08-27T03:13:29.424Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-29','tencent','机器学习平台调度工程师​​（北京/深圳/上海/杭州）(北京)','1.主导万卡级GPU集群的全局资源调度，通过精细化管理和优化策略，显著提升资源利用率，确保离线和在线任务的高效稳定运行；','1.主导万卡级GPU集群的全局资源调度，通过精细化管理和优化策略，显著提升资源利用率，确保离线和在线任务的高效稳定运行；
2.深入优化RDMA高速网络、分布式存储与计算资源的协同调度，有效解决大规模训练任务中的性能瓶颈，提升整体计算效率；
3.基于Kubernetes、Docker等云原生技术，构建高可用调度框架，全面支持分布式训练框架，实现任务编排、容灾与混部能力，并深入K8s调度器、CSI插件及CRD的开发，推动大规模训推技术的实际落地；
4.积极探索混合云、虚拟化、ARM异构计算等前沿方向，不断推动技术与平台能力的升级和创新。','数据计算平台部','后台开发','北京','北京/深圳/上海/杭州',1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,29,'2026-04-14T03:12:13.000Z','2026-08-27T03:13:29.425Z','2026-08-27T03:13:29.425Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-30','tencent','微信秒剪-AI产品经理(广州)','1.负责秒剪的产品策划工作，深度挖掘用户在视频创作领域的核心痛点与潜在需求，设计并落地创新的产品方案，有效提升用户产品体验和使用效率；','1.负责秒剪的产品策划工作，深度挖掘用户在视频创作领域的核心痛点与潜在需求，设计并落地创新的产品方案，有效提升用户产品体验和使用效率；
2.围绕AI应用落地方向深入研究和设计，能够快速学习，拆解复杂问题并与开发同学有效配合制定解决方案，不断强化产品特点和独特的用户价值；
3.持续了解和深挖行业和用户特点，提出创新性的产品玩法，提升用户留存和活跃。','读书产品部','产品策划','广州',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,30,'2025-08-01T02:52:01.000Z','2026-08-27T03:13:29.426Z','2026-08-27T03:13:29.426Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-31','tencent','芯片架构师(北京/深圳)(深圳)','1.负责SoC架构方案设计，包括：总线拓扑、QoS策略、地址翻译、访存行为以及IO设备与CPU 的Cache一致性维护方案；','1.负责SoC架构方案设计，包括：总线拓扑、QoS策略、地址翻译、访存行为以及IO设备与CPU 的Cache一致性维护方案；
2.负责SoC架构性能调优，包括：总线数据通路、DDR访问、IO一致性访问通路的延时、效率和带宽优化，制定全芯片QoS策略；
3.负责加速器IP的访存子系统、硬件调度、中断聚合等行为规范和方案的制定，与SoC的访存系统联合调优；
4.负责SoC系统和加速器IP的PPA指标制定和优化。','云架构平台部','硬件开发','深圳',NULL,0,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,31,'2026-01-15T01:51:16.000Z','2026-08-27T03:13:29.429Z','2026-08-27T03:13:29.429Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-32','tencent','微信输入法-AI 应用全栈开发工程师(广州)','1.推进微信输入法 AI 应用的开发和逻辑，探索云端推理、端云协同智能等技术方案，增强产品核心竞争力；','1.推进微信输入法 AI 应用的开发和逻辑，探索云端推理、端云协同智能等技术方案，增强产品核心竞争力；
2.负责微信输入法 iOS/Android/Mac/Windows 等多平台 Vibe Coding 开发，探索基于 harness engineering 的全新全栈开发模式；
3.参与微信输入法客户端性能和稳定性建设，通过构建 agentic 的开发工具，提升团队研发效率，保障更好的软件质量。','读书产品部','应用开发','广州',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,32,'2026-02-12T13:17:54.000Z','2026-08-27T03:13:29.430Z','2026-08-27T03:13:29.430Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-33','tencent','火龙漫剧-增长负责人(北京)','1.整合内外部资源，制定整体用户增长策略；负责增长模型的搭建与拆解，对 DAU/MAU 及核心转化指标负责；','1.整合内外部资源，制定整体用户增长策略；负责增长模型的搭建与拆解，对 DAU/MAU 及核心转化指标负责；
2.擅长各媒体投放策略，领导UG团队制定全渠道投放策略；管理广告素材的创意工业化流程，通过渠道拓展与素材创新持续提升买量回报；
3.负责用户生命周期管理（LCM），设计用户分层策略与分发逻辑；通过产品机制优化（如推荐算法对齐、路径缩短、激励体系）提升站内转化效率与活跃度；
4.深度对接内部生态资源，实现跨产品线的流量渗透；协调设计、产品、研发团队，确保营销创意与产品调性的高度统一；
5.建立严谨的 A/B Testing 体系与归因模型，通过数据分析定位增长瓶颈，并快速迭代增长方案。','KAIROS​中心','商业运营与拓展','北京',NULL,0,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,33,'2026-03-17T06:16:35.000Z','2026-08-27T03:13:29.432Z','2026-08-27T03:13:29.432Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-34','tencent','腾讯在线视频算法工程师(北京)','1.负责腾讯体育、腾讯视频海外版、腾讯视频AI影视表达工作室等业务的推荐算法、AI agent 等工作；','1.负责腾讯体育、腾讯视频海外版、腾讯视频AI影视表达工作室等业务的推荐算法、AI agent 等工作；
2.推荐场景算法持续优化，助力业务体验升级；
3.开发和优化业务场景内AI agent基础设施，提升用户交互体验；
4.前沿技术的研究和探索，包括但不限于 深度学习、强化学习、LLM、 RAG 等；
5.与产品和工程团队紧密合作，推进模型在相关业务中的部署和落地。','AI影视表达工作室','应用研究','北京',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,34,'2026-03-17T08:31:11.000Z','2026-08-27T03:13:29.433Z','2026-08-27T03:13:29.433Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-35','tencent','微信输入法- 语音识别大模型算法研究员/工程师(北京)','1.负责语音识别大模型研发，提高噪声/小声/远场/口音/方言等复杂声学条件下识别鲁棒性；','1.负责语音识别大模型研发，提高噪声/小声/远场/口音/方言等复杂声学条件下识别鲁棒性；
2.负责语音识别语音-文本多模态大模型的研发，融合领域知识，用户行为与实时信息，提高大模型的上下文建模与逻辑推理能力；
3.负责语音识别大模型预训练，后训练、强化学习相关的数据和算法工作。','读书产品部','应用研究','北京',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,35,'2026-03-27T03:52:56.000Z','2026-08-27T03:13:29.436Z','2026-08-27T03:13:29.436Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-36','tencent','微信输入法-语音大模型算法研究员-语音合成方向(北京)','1.负责研发具有多任务能力的语音合成（TTS）大模型；','1.负责研发具有多任务能力的语音合成（TTS）大模型；
2.负责TTS大模型的预训练及后训练相关的数据和算法工作；
3.推动TTS大模型在产品中应用落地（如朗读/对话/配音等场景），及针对这些场景进行模型优化。','读书产品部','应用研究','北京',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,36,'2026-03-30T09:47:14.000Z','2026-08-27T03:13:29.438Z','2026-08-27T03:13:29.438Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-37','tencent','腾讯游戏-AI Infra专家/工程师(深圳)','1.负责生成式游戏引擎大模型分布式训练和推理系统的性能优化；','1.负责生成式游戏引擎大模型分布式训练和推理系统的性能优化；
2.通过数据并行、模型并行、流水线并行、专家并行等策略的工程实现和性能优化；
3.解决大模型训练中的显存瓶颈、通信延迟和负载均衡等核心计算资源问题；
4.负责多模态RLHF训练与推理平台的实现。','游戏AI引擎部','后台开发','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,37,'2026-05-16T04:02:38.000Z','2026-08-27T03:13:29.439Z','2026-08-27T03:13:29.439Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-38','tencent','腾讯游戏-多模态策略产品经理/专家(深圳)','1.负责生成式游戏引擎多模态大模型方向的产品规划与全生命周期管理；','1.负责生成式游戏引擎多模态大模型方向的产品规划与全生命周期管理；
2.深度洞察用户需求与技术趋势，定义具有竞争力的产品能力矩阵和发展路线图；
3.建立科学的模型评估与迭代机制，确保产品效果的持续领先；
4.协调内外部资源，推动产品从概念到上线、优化及商业化落地的全过程；
5.评测体系构建：通过紧跟先进模型及应用的前沿发展，设计全面、准确的多维度指标，建立覆盖多模态生成、多模态理解等全面、多维度的评测体系；
6.评测流程：熟悉大模型评测流程的实际执行与落地，协同多方相关团队高效完成评测工作，定期监控模型效果，分析问题并提供优化方案；
7.行业动态洞察：持续完善快速评测体系构建、快速反馈行业动态及模型能力，发现行业模型以及应用的前进方向、亮点；
8.结果归因：通过各种数据分析方法，深度分析模型评测结果，为大模型的更新调优提供精准的问题分析结论。','游戏AI引擎部','技术产品','深圳',NULL,2,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,38,'2026-05-16T04:02:38.000Z','2026-08-27T03:13:29.440Z','2026-08-27T03:13:29.440Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-39','tencent','企业微信-产业互联网营销-内容营销(广州)','1.负责企业微信产品特性到对外传播内容的转化，基于产品功能、行业趋势、用户洞察及客户实践，提炼核心竞争优势与策略定位；','1.负责企业微信产品特性到对外传播内容的转化，基于产品功能、行业趋势、用户洞察及客户实践，提炼核心竞争优势与策略定位；
2.针对B端（企业）、C端（个人）用户群体，策划并输出差异化内容，精准传递产品价值与差异化优势；
3.结合行业特性与市场需求，制定B端精准营销策略，通过行业KOL合作、权威媒体发声等方式扩大行业影响力；
4.策划并执行C端营销活动，运用广告创意、事件营销等手段提升品牌口碑与用户渗透率；
5.协同跨部门团队（产品、运营等），推动营销内容的落地与效果优化，确保传播目标达成；
6.持续跟踪市场动态与竞品策略，通过数据分析与用户反馈迭代内容与传播策略。','企业微信产品部','产业互联网营销','广州',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,39,'2026-06-04T07:56:51.000Z','2026-08-27T03:13:29.441Z','2026-08-27T03:13:29.441Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-40','tencent','《王者荣耀》2D美宣原画-colour key设定(深圳)','1.负责绘制游戏展示动画中的灯光氛围及情绪变化的画面效果，即colour key绘制；','1.负责绘制游戏展示动画中的灯光氛围及情绪变化的画面效果，即colour key绘制；
2.负责绘制游戏展示动画中的画面风格设计；
3.负责将游戏展示的特效设计稿和场景设计进行整合优化。','天美L1工作室','2D场景设计','深圳',NULL,2,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,40,'2026-07-06T10:37:21.000Z','2026-08-27T03:13:29.442Z','2026-08-27T03:13:29.442Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-41','tencent','AI视频数据项目经理(北京)','1.需求承接与规则制定：作为AI视频方向数据对接人，深入理解视频生成模型各阶段的数据需求，日常和算法/产品团队对接，主导将算法需求转化为可执行的标注规则与评测标…','1.需求承接与规则制定：作为AI视频方向数据对接人，深入理解视频生成模型各阶段的数据需求，日常和算法/产品团队对接，主导将算法需求转化为可执行的标注规则与评测标准，并持续迭代优化；
2.项目全流程管理：独立负责AI视频方向多个并行标注/评测项目的全生命周期管理，包括需求拆解、排期规划、资源调度、进度管控、质量验收与交付复盘，确保项目按时保质交付；
3.交付质控体系搭建：主导各类项目交付和团队情况评估，部署团队，搭建视频标注与评测的质量管控体系，持续提升交付准确率，确保如期完成项目交付；
4.评测驱动迭代：对人工评测体系建设（含评测维度定义、评测集构建、评测报告撰写）有了解，基于评测结果进行bad case归因分析，反向推动算法侧优化方向，以数据驱动模型能力进化；
5.团队建设与管理：统筹管理100-500人规模的标注/评测团队（含内部PM、作业团队），负责团队梯队搭建、培训体系建设、绩效考核与人才培养；
6.降本增效与流程优化：推动标注工具与平台优化，探索AI预标/辅标能力落地，设计人机协同作业模式，持续提升数据生产效率并控制成本；
7.跨团队协同：与算法、产品、美学专家、供应商管理等多方高效协作，主动拉通上下游信息，推动需求对齐与资源保障，确保数据交付与模型迭代节奏匹配。','内容服务部','交付项目管理','北京',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,41,'2026-06-17T08:13:47.000Z','2026-08-27T03:13:29.444Z','2026-08-27T03:13:29.444Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-42','tencent','魔方工作室-视频模型数据工程师(深圳)','1.数据策略与配比：制定预训练 / 微调 / 对齐各阶段的数据配方（domain、动作类别、画质、时长、分辨率分布），用实验驱动配比决策；','1.数据策略与配比：制定预训练 / 微调 / 对齐各阶段的数据配方（domain、动作类别、画质、时长、分辨率分布），用实验驱动配比决策；
2.大规模数据管线：设计并落地视频数据的采集、去重、清洗、镜头分割、质量过滤、标注与版本管理流程，保障可复现与可追溯；
3.标注体系设计：定义动作/交互的标签体系（刺激-反应分类、轨迹、物件、深度等），制定标注规范与质检抽样方案，管理标注质量；
4.控制信号对齐：建立 caption、轨迹、首末帧、深度/mask 等条件信号与视频帧的对齐与质检指标，量化对齐误差对生成效果的影响；
5.评测与归因：构建画质、时序一致性、身份保持、控制响应等离线评测集与指标，做数据-效果归因分析，定位"哪类数据缺失导致哪类 bad case"；
6.数据质量度量：定义并监控数据集的覆盖度、多样性、噪声率、长尾分布等指标，建立数据健康度看板。','技术中心','应用研究','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,42,'2026-06-23T11:17:27.000Z','2026-08-27T03:13:29.446Z','2026-08-27T03:13:29.446Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-43','tencent','混元大模型平台研发工程师（北京/深圳）(北京)','1.混元机器学习研发底座与LLMOps工程平台的架构设计、核心开发与全链路性能迭代。 负责混元平台核心架构设计与迭代开发，聚焦大模型训练、推理、评估、数据多个核…','1.混元机器学习研发底座与LLMOps工程平台的架构设计、核心开发与全链路性能迭代。 负责混元平台核心架构设计与迭代开发，聚焦大模型训练、推理、评估、数据多个核心场景，解决大规模训练、数据处理、评测等场景问题，持续提升大模型训练稳定性与平台整体性能上限；
2.LLMOps工程体系迭代与研发效能升级：持续深耕并跟进业界AIGC、大模型工程化前沿技术与落地实践，结合内部模型预训练、后训练、迭代、部署全流程诉求，持续优化平台技术方案与产品形态。聚焦平台易用性、自动化、标准化建设，降低大模型研发与落地门槛，持续完善、升级、落地全链路LLMOps研发体系。','基础模型部','后台开发','北京','北京/深圳',5,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,43,'2026-06-26T11:39:50.000Z','2026-08-27T03:13:29.447Z','2026-08-27T03:13:29.447Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-44','tencent','腾讯营销-海外广告联盟流量运营专家-北京(北京)','1.负责海外广告联盟的开发者变现合作，制定业务发展规划，搭建流量变现解决方案，开发各类型开发者变现合作，提升流量变现效率、规模和市场竞争力；','1.负责海外广告联盟的开发者变现合作，制定业务发展规划，搭建流量变现解决方案，开发各类型开发者变现合作，提升流量变现效率、规模和市场竞争力；
2.负责或协助相关团队的日常管理。','海外发展中心','产品运营','北京',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,44,'2026-05-14T02:19:48.000Z','2026-08-27T03:13:29.448Z','2026-08-27T03:13:29.448Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-45','tencent','火龙漫剧推荐算法工程师(北京)','1.负责火龙漫剧/视频业务的推荐与搜索技术研发（包含但不限于传统搜推、LLM4Rec、AI搜索、生成式推荐等），提升用户体验，用户消费与时长，用户转化与留存等核…','1.负责火龙漫剧/视频业务的推荐与搜索技术研发（包含但不限于传统搜推、LLM4Rec、AI搜索、生成式推荐等），提升用户体验，用户消费与时长，用户转化与留存等核心业务指标；
2.根据场景特点和产品定位，对全链路算法体系进行深度理解与优化，持续优化推荐/推荐算法；
3.结合大模型技术，升级推荐技术，提升推荐效果，解决实际业务问题；
4.紧跟学术界、工业界的前沿技术，结合实际的业务场景进行算法开发、落地，实现团队技术和业务的共同发展。','视频技术部','应用研究','北京',NULL,2,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,45,'2026-06-17T07:14:02.000Z','2026-08-27T03:13:29.449Z','2026-08-27T03:13:29.449Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-46','tencent','腾讯视频-衍生品产品企划经理(北京)','1.基于周边市场趋势，用户需求洞察，充分了解并挖掘IP潜力，制定重点IP的衍生品产品规划，明确产品线布局与商业目标，持续打造有竞争力的商品；','1.基于周边市场趋势，用户需求洞察，充分了解并挖掘IP潜力，制定重点IP的衍生品产品规划，明确产品线布局与商业目标，持续打造有竞争力的商品；
2.统筹商品开发全流程，推动商品企划、设计协同、产品设计、打样、监修、生产及销售，保证产品按期上线；
3.协同供应商，优化供应商、供应链效率，建立长期稳定的合作关系；
4.推进与协同部门制定新品推广、销售策略，推动销售目标达成；
5.监控商品动销与用户反馈，分析商品表现，迭代商品开发策略。','视频订阅与商业化部','商业运营与拓展','北京',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,46,'2026-06-22T03:36:52.000Z','2026-08-27T03:13:29.450Z','2026-08-27T03:13:29.450Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-47','tencent','PUBG Mobile-3D角色模型（AI方向）(深圳)','1.统筹项目内部角色道具模型与贴图相关工作，依据制作规范与工作流程，配合原画、TA 及其他美术岗位，产出符合项目品质与性能标准的模型与材质资产；','1.统筹项目内部角色道具模型与贴图相关工作，依据制作规范与工作流程，配合原画、TA 及其他美术岗位，产出符合项目品质与性能标准的模型与材质资产；
2.根据原画需求，理解角色设计背景，合理规划 3D 资产结构，把控制作过程符合引擎性能优化要求，并在引擎内完成资产调试、迭代与统一管理；
3.对接 3D 美术外包，协调各制作环节，确保外包在规定周期内交付符合项目品质的模型资产；
4.推动 AI 工具与自动化方案在角色模型生产链路中的落地应用，参与流程提效、工具选型、Prompt/工作流设计、AI 资产质量校验等关键环节；
5.与 TA、程序、AI 技术团队协同，输出可复用的脚本、HDA、节点工具或 AI 应用方案，沉淀项目级的程序化与智能化资产生产能力。','量子工作室','3D角色设计','深圳','AI方向',1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,47,'2025-08-02T03:34:06.000Z','2026-08-27T03:13:29.451Z','2026-08-27T03:13:29.451Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-48','tencent','《异人之下》游戏客户端开发工程师（GamePlay方向）(深圳)','1.负责帧同步框架的开发，以及动作、技能、关卡流程、过场表演等关键模块的开发维护；','1.负责帧同步框架的开发，以及动作、技能、关卡流程、过场表演等关键模块的开发维护；
2.负责场景管线的构建，包括制作规范、性能规范以及部署发布等工具链提效优化；
3.负责Gameplay相关的管线开发、工具链开发以及相关的标准制定和落地；
4.负责战斗内各种疑难问题的跟进和解决。','魔术师工作室','游戏客户端开发','深圳','GamePlay方向',2,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,48,'2025-09-15T03:59:06.000Z','2026-08-27T03:13:29.453Z','2026-08-27T03:13:29.453Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-49','tencent','企业微信-大模型算法工程师-记忆系统（北京/成都）(广州)','1.负责 AI 在企业微信场景落地的核心系统建设，包括 LLM 记忆系统、上下文工程、图谱构建的设计和实现','1.负责 AI 在企业微信场景落地的核心系统建设，包括 LLM 记忆系统、上下文工程、图谱构建的设计和实现
2.完成结构化/非结构化数据的信息压缩、知识提炼、关系挖掘和推理、图谱的存储和更新
3.持续跟踪并引入最新的记忆系统构建、上下文管理技术，推动技术在实际业务的创新应用，打造下一代 AI 应用系统','企业微信产品部','应用研究','广州','北京/成都',2,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,49,'2025-10-09T03:31:29.000Z','2026-08-27T03:13:29.454Z','2026-08-27T03:13:29.454Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-50','tencent','海外IDC采购商务经理(深圳)','1.IDC资源合作：根据公司总体业务规划，在全球范围内寻找满足公司业务需求的IDC与云计算服务提供商，实现公司互联网内容在主要目标区域的本地化部署；','1.IDC资源合作：根据公司总体业务规划，在全球范围内寻找满足公司业务需求的IDC与云计算服务提供商，实现公司互联网内容在主要目标区域的本地化部署；
2.海外运营商合作：与海外主流电信运营商合作，通过Peering、路由优化等方式，改善和优化海外运营商终端用户腾讯产品的网络使用体验；负责所辖地区的各地运营商商务接口，建立并维护双方长期、深入、全方位的战略合作伙伴关系，支撑公司业务发展与运营商战略落地实施；
3.运维支持：作为公司与海外运营商的第一接口人，负责建立双方运维团队的沟通机制，协调解决业务运行过程重点各类运维问题与优化需求；
4.规划支持：发挥自身专业能力，为公司海外IDC布局和运营商网络互联规划提供专业建议。','云采购供应管理部','采购商务管理','深圳',NULL,4,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,50,'2025-10-09T10:22:04.000Z','2026-08-27T03:13:29.455Z','2026-08-27T03:13:29.455Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-51','tencent','企业微信-大模型算法工程师-Agent应用（广州/北京）(成都)','1.负责构建具备自主决策、协作与工具调用能力的多智能体系统（Multi-Agent System），推动大模型从“对话式AI”向“任务执行体”演进，解决复杂场景…','1.负责构建具备自主决策、协作与工具调用能力的多智能体系统（Multi-Agent System），推动大模型从“对话式AI”向“任务执行体”演进，解决复杂场景下的自动化问题；
2.深入研究并应用LLM的复杂推理技术（如思维链CoT、思维树ToT），攻克开放式、复杂问题的深度研究模式，赋予Agent独立探索与解决问题的能力；
3.运用指令微调、强化学习等方法，提升大模型规划、推理与遵循指令的能力，从而提升模型知识边界探索和抗干扰的能力。','企业微信产品部','应用研究','成都','广州/北京',2,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,51,'2025-10-10T07:25:33.000Z','2026-08-27T03:13:29.456Z','2026-08-27T03:13:29.456Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-52','tencent','微信输入法-AI产品经理(广州)','1.负责微信输入法 AI 方向的产品策划，围绕大语言模型（LLM）、Agent、多模态交互、语音识别与合成（ASR）等前沿技术，探索 AI 在文字输入、智能表达…','1.负责微信输入法 AI 方向的产品策划，围绕大语言模型（LLM）、Agent、多模态交互、语音识别与合成（ASR）等前沿技术，探索 AI 在文字输入、智能表达、语音交互、内容创作等核心场景的创新落地方案；
2.深度挖掘用户在输入全链路中对 AI 的真实需求和使用场景，设计端到端的产品解决方案并推动落地，持续提升输入效率与表达体验；
3.结合业务目标定义模型效果标准和评测体系，协同算法、工程、设计团队进行模型迭代优化与数据飞轮建设；
4.持续跟踪大模型与 AI 交互领域的前沿趋势及竞品动态，提出创新性产品策略，强化微信输入法的 AI 产品心智。','读书产品部','产品经理','广州',NULL,2,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,52,'2025-10-15T14:26:55.000Z','2026-08-27T03:13:29.457Z','2026-08-27T03:13:29.457Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-53','tencent','《王者荣耀》资深3D动画设计师(深圳)','1.负责制作游戏内技能动画，回城动画等单局动画内容；','1.负责制作游戏内技能动画，回城动画等单局动画内容；
2.负责制作外围皮肤&英雄展示动画；
3.负责总结动画风格，归纳动画流程；
4.具备分镜能力者优先，具备引擎能力者优先。','天美L1工作室','动画设计','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,53,'2025-11-09T06:44:56.000Z','2026-08-27T03:13:29.458Z','2026-08-27T03:13:29.458Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-54','tencent','《王者荣耀》2D美宣原画-colour key设定(深圳)','1.负责绘制游戏展示动画中的灯光氛围及情绪变化的画面效果，即colour key绘制；','1.负责绘制游戏展示动画中的灯光氛围及情绪变化的画面效果，即colour key绘制；
2.负责绘制游戏展示动画中的画面风格设计；
3.负责将游戏展示的特效设计稿和场景设计进行整合优化。','天美L1工作室','2D场景设计','深圳',NULL,2,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,54,'2025-11-09T06:45:42.000Z','2026-08-27T03:13:29.459Z','2026-08-27T03:13:29.459Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-55','tencent','腾讯游戏-资深机器学习工程师/专家-大规模模型训练与推理优化(深圳)','1.负责3D/动画等美术资产生成大模型分布式训练和推理系统的性能优化；','1.负责3D/动画等美术资产生成大模型分布式训练和推理系统的性能优化；
2.通过数据并行、模型并行、流水线并行、专家并行等策略的工程实现和性能优化；
3.解决大模型训练中的显存瓶颈、通信延迟和负载均衡等核心计算资源问题；
4.负责多模态RLHF训练与推理平台的实现。','效能产品部','后台开发','深圳',NULL,0,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,55,'2025-11-10T01:48:21.000Z','2026-08-27T03:13:29.460Z','2026-08-27T03:13:29.460Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-56','tencent','腾讯云-服务器硬件高级工程师(深圳)','1.负责腾讯自研服务器、板卡的硬件设计和开发；','1.负责腾讯自研服务器、板卡的硬件设计和开发；
2.负责服务器研发技术文档编写，包括产品规格、模块接口定义等；
3.带领OEM一起完成服务器板卡的原理图设计、PCB布局布线的检查、单板调试和测试；
4.评审ODM的测试报告，问题攻关和定位 ，确保产品质量满足腾讯的要求；
5.负责解决服务器生产加工的问题，确保产品的生产质量以及交付；
6.负责服务器现网故障定位。','星星海实验室','硬件开发','深圳',NULL,0,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,56,'2025-11-25T08:53:25.000Z','2026-08-27T03:13:29.461Z','2026-08-27T03:13:29.461Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-57','tencent','服务器部件计划工程师(深圳)','1.负责腾讯服务器商用核心部件（例如CPU、GPU、DRAM、SSD、网卡等）的计划和供应管理，包括安全库存管理、备货管理、日常供应商管理工作等；','1.负责腾讯服务器商用核心部件（例如CPU、GPU、DRAM、SSD、网卡等）的计划和供应管理，包括安全库存管理、备货管理、日常供应商管理工作等；
2.负责腾讯自研核心部件的下层管理管理工作，包括从芯片到成卡的过程管理、ODM生产管理；
3.负责腾讯部件供应商的管理，以及部件供应商和整机供应商之间的协同合作；
4.负责腾讯部件供应管理的整体策略的制定和落地实施。','云采购供应管理部','运营规划','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,57,'2025-11-25T08:53:33.000Z','2026-08-27T03:13:29.462Z','2026-08-27T03:13:29.462Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-58','tencent','游戏玩法开发专家(深圳)','1.负责角色控制，输入控制，相机控制，NPC控制等模块的开发与相关技术预研；','1.负责角色控制，输入控制，相机控制，NPC控制等模块的开发与相关技术预研；
2.负责与AI结合的玩法开发。','光子技术发展部','游戏客户端开发','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,58,'2025-11-28T01:47:16.000Z','2026-08-27T03:13:29.464Z','2026-08-27T03:13:29.464Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-59','tencent','腾讯云-传媒行业高级产品运营经理-上海/深圳(上海)','1.负责腾讯融媒体客户端增长解决方案，针对客户增长需求，制定运营思路、策略、计划并执行，推动运营效果达成，对产品体验和用户满意度负责；','1.负责腾讯融媒体客户端增长解决方案，针对客户增长需求，制定运营思路、策略、计划并执行，推动运营效果达成，对产品体验和用户满意度负责；
2.参与产品策划需求过程，提出运营类生态需求与建议，站在用户角度驱动产品发展；
3.分析用户行为和属性，挖掘用户潜在需求，制定获客、留存、增长、活跃的运营策略；
4.对业务数据进行收集、整理、分析，监控运营推广效果并及时调整，规范产品运营标准和流程，达到预定的推广效果；
5.为传媒客户提供内容传播的运营产品，制定运营策略，打造整体运营方案；
6.拉通内外生态，构建主流媒体的内容生态，助力主流媒体与腾讯内容生态的深度融合，建立内容运营、内容电商、互联网广告运营以及新闻 信息流产品、短视频产品运营的商业化生态体系。','智慧行业十部','行业应用','上海',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,59,'2025-12-19T02:55:23.000Z','2026-08-27T03:13:29.465Z','2026-08-27T03:13:29.465Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-60','tencent','腾讯云汽车行业解决方案架构师-出海专项(上海)','1.作为出海专项架构师，为中国车企提供全球化业务布局的技术架构咨询，协助客户完成海外研发、生产、营销、智驾及车联网平台的平滑出海；','1.作为出海专项架构师，为中国车企提供全球化业务布局的技术架构咨询，协助客户完成海外研发、生产、营销、智驾及车联网平台的平滑出海；
2.针对车企在不同海外大区（如欧洲、东南亚、美洲）的业务需求，基于腾讯云全球基础设施设计高可用、低延迟、多中心的分布式架构方案；
3.深度对接车企出海过程中的合规需求，协助客户应对 GDPR、LGPD 等数据及当地行业安全标准，设计数据脱敏及跨境流转方案；
4.联动腾讯云海外技术团队与当地生态合作伙伴，确保方案在海外市场的落地实施，并解决跨国弱网环境、多云互联、数据回传等技术难题；
5.总结车企出海共性痛点（如海外智驾、OTA、营销等），打造具有竞争力的车企出海专项解决方案包；
6.沉淀腾讯云在支撑车企全球化方面的技术优势，建立在车企出海圈层的技术信任感。','智慧出行事业部','技术咨询','上海',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,60,'2025-12-24T05:57:23.000Z','2026-08-27T03:13:29.466Z','2026-08-27T03:13:29.466Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-61','tencent','《异人之下》高级关卡策划(深圳)','1.负责动作游戏的关卡2D概念图设计，3D箱庭式关卡地图设计；','1.负责动作游戏的关卡2D概念图设计，3D箱庭式关卡地图设计；
2.根据叙事需求与体验需求，设计与实现关卡流程，在引擎内搭建关卡体验白盒，持续推进关卡的实现与落地；
3.使用编辑器驱动任务关卡中的各对象触发、表演、衔接逻辑，对关卡的整体体验负责；
4.动作游戏中PVE相关玩法设计与实现；
5.参与产品相关设计和优化工作，进行关卡相关编辑器的设计与优化，完善工作流程；
6.根据测试数据与玩家反馈，持续打磨关卡，提升关卡品质。','魔术师工作室','游戏策划','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,61,'2026-01-06T05:02:21.000Z','2026-08-27T03:13:29.467Z','2026-08-27T03:13:29.467Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-62','tencent','无畏契约手游-高级2D枪械原画设计师(深圳)','1.负责《无畏契约》风格枪械的商业化设计以及细节打磨，确保武器在视觉和功能上高度契合游戏世界观；','1.负责《无畏契约》风格枪械的商业化设计以及细节打磨，确保武器在视觉和功能上高度契合游戏世界观；
2.需要指导和协调子岗V岗的员工进行设计；部门内协调3D，动作，特效等跨部门合作，确保设计方案落地和品质统一；
3.具备制定设计标准与流程的专业能力。','量子工作室','2D角色设计','深圳',NULL,0,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,62,'2026-01-08T06:06:52.000Z','2026-08-27T03:13:29.468Z','2026-08-27T03:13:29.468Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-63','tencent','《异人之下》游戏客户端开发工程师（引擎Crash分析优化）(深圳)','1.负责分析定位引擎Crash问题以及底层BUG，并解决优化；','1.负责分析定位引擎Crash问题以及底层BUG，并解决优化；
2.负责引擎性能分析和优化，包括卡顿，内存，功耗，并制定规范推动落地；
3.负责研效提升，分析定位卡点，优化工具链和管线，制定相应标准和规范；
4.关注业界发展和前沿技术，预研和验证新技术的可行性和落地效果。','魔术师工作室','游戏客户端开发','深圳','引擎Crash分析优化',1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,63,'2026-01-08T07:15:48.000Z','2026-08-27T03:13:29.469Z','2026-08-27T03:13:29.469Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-64','tencent','《王者荣耀》资深2D美宣原画(深圳)','1.美宣海报绘制；','1.美宣海报绘制；
2.负责部分版本内容的跟进；
3.未来美术部分的表现与技术探索 ；
4.能够配合多方进行独立构思和设计表现探索和研发。','天美L1工作室','2D角色设计','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,64,'2026-01-08T14:40:26.000Z','2026-08-27T03:13:29.470Z','2026-08-27T03:13:29.470Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-65','tencent','《王者荣耀》UGC-场景原画设计(深圳)','1.负责UGC地图设计工作，结合游戏机制与玩家需求输出适配的场景方案；','1.负责UGC地图设计工作，结合游戏机制与玩家需求输出适配的场景方案；
2.主导项目美术风格制定，搭建统一且富有辨识度的2D场景视觉体系；
3.承担MOBA地图概念设计与细化制作，从创意草图到最终落地稿全程把控，确保符合项目调性与技术要求。','天美L1工作室','2D场景设计','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,65,'2026-01-13T16:16:28.000Z','2026-08-27T03:13:29.471Z','2026-08-27T03:13:29.471Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-66','tencent','无畏契约手游-资深3D特效设计师(深圳)','1.主导商业化枪械皮肤特效设计与实现，打造标杆级特效视觉表现；','1.主导商业化枪械皮肤特效设计与实现，打造标杆级特效视觉表现；
2.协同CP完成英雄技能特效开发全流程把控，确保美术效果与设计目标吻合；
3.协同TA与程序推进工具链迭代、特效资源性能优化及管线效能提升；
4.审核团队输出质量，培养新人并攻克特效技术难点，推动团队专业化建设。','量子工作室','特效设计','深圳',NULL,0,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,66,'2025-06-25T23:44:36.000Z','2026-08-27T03:13:29.472Z','2026-08-27T03:13:29.472Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-67','tencent','《洛克王国：世界》-视觉设计师（资深）(深圳)','1.负责游戏UI系统创意视觉提案，依据游戏世界观与产品需求，确定系统整体的视觉包装方向，涵盖二次元、主机、写实、影视化等多种风格；','1.负责游戏UI系统创意视觉提案，依据游戏世界观与产品需求，确定系统整体的视觉包装方向，涵盖二次元、主机、写实、影视化等多种风格；
2.全程跟进设计实现过程，与策划、动效、程序密切协作，确保最终版本实现品质与设计相符；
3.提出创意方案，并推动各环节岗位将最终资源依照方案品质落实。','艺术设计中心','视觉设计','深圳','资深',1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,67,'2025-04-27T08:18:32.000Z','2026-08-27T03:13:29.473Z','2026-08-27T03:13:29.473Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-68','tencent','信用卡现金借贷-产品经理(深圳)','1.负责信用卡及零贷业务产品策划工作，包括提升产品力服务供给、丰富经营能力、提升运营效率等工作；','1.负责信用卡及零贷业务产品策划工作，包括提升产品力服务供给、丰富经营能力、提升运营效率等工作；
2.深度挖掘平台用户特征和需求，持续丰富合作金融机构和信贷产品，满足不同客群对产品额度、定价、服务的需求；
3.洞察金融机构诉求，负责平台用户权益设计和营销能力建设，持续提升运营效率，助力提升资产规模；
4.关注金融科技、信贷行业动向，基于行业趋势和用户理解，持续推动平台产品中长期的经营规划和迭代。','支付应用产品部','产品策划','深圳',NULL,0,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,68,'2025-04-02T07:01:02.000Z','2026-08-27T03:13:29.474Z','2026-08-27T03:13:29.474Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-69','tencent','元宝-研发项目经理(深圳)','1.负责项目的计划制定、进度驱动和跟踪、风险识别以及应对，确保项目按计划完成；','1.负责项目的计划制定、进度驱动和跟踪、风险识别以及应对，确保项目按计划完成；
2.统筹产品-工程-算法团队协作、协调需求对接、资源分配优化、质量管控及敏捷迭代保障全流程；
3.及时发现并跟踪解决项目问题，有效管理项目风险；挖掘项目痛点，提升整体协作和交付效率。','元宝产品部','研发项目管理','深圳',NULL,2,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,69,'2025-02-26T02:44:43.000Z','2026-08-27T03:13:29.475Z','2026-08-27T03:13:29.475Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-70','tencent','腾讯游戏语音-语音算法资深研究员-新星引力计划(上海)','1.负责面向游戏领域语音大模型的构建，研发领先的语音合成解决方案；','1.负责面向游戏领域语音大模型的构建，研发领先的语音合成解决方案；
2.探索语音大模型技术在游戏场景中的应用，负责高质量合成方向前沿问题的探索与研究；
3.优化现有算法，包括并不限于语音合成、语音克隆和歌唱转换以及音乐合成方向等研发工作；
4.跟踪探索大语音模型的前沿技术与应用落地。','基础技术产品部','应用研究','上海',NULL,0,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,70,'2025-01-14T02:12:29.000Z','2026-08-27T03:13:29.476Z','2026-08-27T03:13:29.476Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-71','tencent','3D动作游戏《狩》-3D特效设计师（深圳/上海）(深圳)','1.负责游戏中角色特效、剧情特效、场景特效的设计和制作；','1.负责游戏中角色特效、剧情特效、场景特效的设计和制作；
2.推动项目特效技术的持续提升和优化；
3.与动画，策划，程序进行良好的沟通和对接，对项目推进中遇到的问题进行汇总归纳并及时处理；
4.与团队成员一起解决技术难题和其他挑战。','魔王工作室','特效设计','深圳','深圳/上海',1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,71,'2024-10-17T06:23:55.000Z','2026-08-27T03:13:29.477Z','2026-08-27T03:13:29.477Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-72','tencent','游戏引擎专家(深圳)','1.基于UE5引擎评估，设计，定制项目图形渲染特性；','1.基于UE5引擎评估，设计，定制项目图形渲染特性；
2.指导其他工程师，帮助团队解决引擎技术难题。','光子技术发展部','游戏客户端开发','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,72,'2024-05-08T06:39:50.000Z','2026-08-27T03:13:29.478Z','2026-08-27T03:13:29.478Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-73','tencent','机器学习优化专家(深圳)','1.负责在游戏领域落地AI技术，包括模型训练优化以及在线服务性能提升；','1.负责在游戏领域落地AI技术，包括模型训练优化以及在线服务性能提升；
2.积极关注AI领域的最新学术和行业进展，持续优化技术方案，并推进工作流程及研究效率的提升。','光子技术发展部','后台开发','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,73,'2024-05-08T06:39:50.000Z','2026-08-27T03:13:29.479Z','2026-08-27T03:13:29.479Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-74','tencent','3D动作游戏《狩》-3D动画专家（深圳/上海）(上海)','1.负责游戏中角色的动画制作，包括战斗与表演动画；','1.负责游戏中角色的动画制作，包括战斗与表演动画；
2.负责游戏中怪物的动画制作，包括四足、鸟类、鱼类等怪物制作战斗与表演动画；
3.负责游戏中过场动画制作，通过分镜或者原著参考还原3D动画；
4.跟进和反馈外包进度，按时完成需求。','魔王工作室','动画设计','上海','深圳/上海',1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,74,'2024-03-14T03:20:06.000Z','2026-08-27T03:13:29.480Z','2026-08-27T03:13:29.480Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-75','tencent','腾讯云汽车行业高级大客户销售经理(北京)','1.负责汽车行业客户的销售/客户管理工作；','1.负责汽车行业客户的销售/客户管理工作；
2.面向汽车行业客户，包括：主机厂，TierTier2以及自动驾驶初创公司等进行业务拓展，拓展领域包括但不限于：智能汽车云，导航和地图服务以及车联网业务；完成公司的业绩指标；
3.客户关系发展与维护，建设与管理腾讯公司与客户的长期、信任的合作关系；
4.承担并完成年度销售业绩指标，与售前团队协作，发掘商机，管理商机销售漏斗，完成商务谈判、合同签订、合同回款等工作；
5.善协作：协调内部产研/项目等资源，及时高效协助解决重大客户需求或投诉，维持客户满意度和忠诚度。','智慧出行事业部','直客销售','北京',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,75,'2023-01-13T02:42:50.000Z','2026-08-27T03:13:29.481Z','2026-08-27T03:13:29.481Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-76','tencent','大模型推理GPU性能优化工程师(深圳)','1.负责从GPU优化TTS，LLM，VLM等大模型推理引擎；','1.负责从GPU优化TTS，LLM，VLM等大模型推理引擎；
2.与大模型算法同学深度合作，联合优化，打造行业领先的高性能推理引擎；
3.跟进机器学习前沿技术，将合适成果落地于实际应用。','光子技术发展部','后台开发','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,76,'2026-01-21T06:47:15.000Z','2026-08-27T03:13:29.483Z','2026-08-27T03:13:29.483Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-77','tencent','微信读书-大模型后台开发工程师(广州)','1.负责微信读书 AI 相关功能的后台开发，包括搜推系统、TTS、内容社区等服务端的架构设计与实现；','1.负责微信读书 AI 相关功能的后台开发，包括搜推系统、TTS、内容社区等服务端的架构设计与实现；
2.参与分布式系统架构演进，负责高并发场景下的服务治理、消息总线、多副本一致性等基础设施建设；
3.优化 LLM 推理链路，包括流式响应、上下文压缩、Token 成本控制、降级兜底策略，提升服务稳定性与吞吐；
4.建设 AI 工程提效工具，如智能客服、智能运维等。','读书产品部','后台开发','广州',NULL,2,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,77,'2026-01-22T03:14:07.000Z','2026-08-27T03:13:29.484Z','2026-08-27T03:13:29.484Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-78','tencent','医疗行业KA销售(上海)(上海)','1.岗位职责；','1.岗位职责；
2.负责腾讯智慧医疗行业大客户的拓展和销售业绩的达成；
3.基于医疗行业的各类业务场景和客户需求，挖掘腾讯云基础产品（Iaas/PaaS/SaaS)和智慧医疗解决方案的销售商机，协同内部相关团队，跟进客户开发、项目交付、项目回款等全流程工作，完成团队制定的销售目标；
4.负责所在区域的行业标杆客户开发，整合腾讯云产品和能力，打造智慧医疗新的标杆案例和落地场景，提升腾讯智慧医疗在行业的影响力和市场占比；
5.维持行业标杆客户的长期合作关系，提供长期的技术咨询服务，保持行业标杆客户的满意度、活跃度和推荐意愿；
6.协同标杆客户组织各类大型市场活动，负责所在区域的行业圈层运营，借以推广腾讯智慧医疗解决方案。','医疗健康事业部','直客销售','上海',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,78,'2026-01-30T03:30:14.000Z','2026-08-27T03:13:29.485Z','2026-08-27T03:13:29.485Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-79','tencent','腾讯云-海外算力采购商务经理(深圳)','1.负责海外算力租赁项目运作及商务管理，包括进度管理、需求管理、商务谈判、价格管理、合同管理及执行过程中的问题管理；','1.负责海外算力租赁项目运作及商务管理，包括进度管理、需求管理、商务谈判、价格管理、合同管理及执行过程中的问题管理；
2.负责落实采购成本控制目标，降低综合采购成本；
3.负责供应商的开发、管理及绩效评估与绩效改进；
4.配合项目新需求及新品类，市场调研及分析、供应资源开发及评估、项目采购策略制定并实施（供应商选择、价格谈判、合同签署及交付管理等）；
5.深入了解业务诉求并协助业务梳理需求转化为采购需求；协同业务团队建立相应流程，规范。','云采购供应管理部','采购商务管理','深圳',NULL,3,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,79,'2026-02-02T02:07:41.000Z','2026-08-27T03:13:29.486Z','2026-08-27T03:13:29.486Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-80','tencent','服务器DCDC电源设计专家(深圳)','1.负责服务器系统中DC-DC电源模块的电路设计、仿真、调试及优化，包括但不限于POL、VRM多相并联电源等；','1.负责服务器系统中DC-DC电源模块的电路设计、仿真、调试及优化，包括但不限于POL、VRM多相并联电源等；
2.设计高效率、高功率密度、高可靠性的DC-DC电源方案，满足服务器系统对电源的严苛需求（如动态响应、低纹波、散热性能等）；
3.制定电源模块的测试方案，完成电气性能测试（效率、纹波、瞬态响应等）、可靠性测试（高温、低温、老化、EMC等）及故障分析；
4.与硬件系统工程师、PCB Layout工程师、结构工程师及热设计工程师协作，优化电源模块的布局、布线及散热设计。','星星海实验室','硬件开发','深圳',NULL,0,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,80,'2026-02-06T07:41:56.000Z','2026-08-27T03:13:29.487Z','2026-08-27T03:13:29.487Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-81','tencent','多平台动作搜打撤-高级3D特效设计师(深圳)','1.负责使用UE5引擎游戏内角色技能/场景等各模块特效的设计与制作，符合写实魂系风格和品质要求；','1.负责使用UE5引擎游戏内角色技能/场景等各模块特效的设计与制作，符合写实魂系风格和品质要求；
2.协同2D美术、策划、程序团队，实现特效设计落地与性能优化；
3.主导或参与外包特效资源的审核、反馈与管理，确保外包产出符合项目标准与进度要求；
4.研究和跟进行业前沿的3D特效技术、工具与表现手法，推动项目特效流程提效及品质提升。','量子工作室','特效设计','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,81,'2026-03-05T12:57:34.000Z','2026-08-27T03:13:29.488Z','2026-08-27T03:13:29.488Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-82','tencent','多平台动作搜打撤-高级2D角色原画设计师(深圳)','1.魂系写实风格项目，结合策划需求完成核心角色设定，有一定的世界观塑造能力；','1.魂系写实风格项目，结合策划需求完成核心角色设定，有一定的世界观塑造能力；
2.担任角色接口人，统筹角色团队，具备成熟CP协作经验，撬动CP资源解决美术需求；
3.基于丰富游戏阅历，结合主流游戏体验，串联上下游岗位，从美术角度为玩法做符合项目世界观的包装；
4.配合3D、动作等岗位，提供设计参考，跟进角色3D落地还原，保证其品质；
5.整理角色设计规范与素材库，沉淀标准，提升团队设计效率。','量子工作室','3D场景设计','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,82,'2026-03-05T12:57:34.000Z','2026-08-27T03:13:29.489Z','2026-08-27T03:13:29.489Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-83','tencent','微信小游戏-平台产品经理-全球化(深圳)','1.搭建小游戏出海相关平台能力，包括但不限于框架体验、商业组件、本地化适配等；','1.搭建小游戏出海相关平台能力，包括但不限于框架体验、商业组件、本地化适配等；
2.根据不同的地区市场与平台受众，输出小游戏批量出海运营方案，构建提升新进、复访的场景方案；
3.协同内外部合作方，拆解转化链路、理解用户需求，完善相关平台能力驱动增长；
4.协同多部门研发团队，持续迭代广告/支付/开发者工具等能力，保障项目按期落地与结果达成。','增值业务部','产品策划','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,83,'2026-03-09T16:54:23.000Z','2026-08-27T03:13:29.490Z','2026-08-27T03:13:29.490Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-84','tencent','多平台动作搜打撤-高级3D角色制作(深圳)','1.类魂国风写实角色制作, 商业化时装，武器组件制作；','1.类魂国风写实角色制作, 商业化时装，武器组件制作；
2.制作角色品质标杆，制定美术规范标准，优化工作流程；
3.多端角色资产审核验收；
4.与TA积极合作，持续不断的维护和改进角色在游戏内的品质效果；
5.钻研前沿技术，积累技术资源，共享角色制作内容经验，团队管理，新人培养；
6.主动与上下游各环节同学进行沟通，外部规范外包制作环节。','量子工作室','3D角色设计','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,84,'2026-03-10T09:37:58.000Z','2026-08-27T03:13:29.491Z','2026-08-27T03:13:29.491Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-85','tencent','在研剑来IP单机游戏-场景美术师(深圳)','1.基于UE5引擎搭建高精度仙侠场景，包括地形雕刻、光影构图、建筑布局、植被生态及氛围渲染；','1.基于UE5引擎搭建高精度仙侠场景，包括地形雕刻、光影构图、建筑布局、植被生态及氛围渲染；
2.运用程序化生成工具 （Houdini、World Machine）批量制作自然景观，并适配动态天气系统；
3.优化场景资源性能，熟练应用Nanite虚拟几何体、Lumen全局光照技术，平衡视觉效果与运行效率；
4.协同材质团队开发场景Shader（如古建筑瓦片、竹林植被、水体质感），提升场景细节表现力。','R工作室','3D场景设计','深圳',NULL,0,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,85,'2026-03-20T05:50:06.000Z','2026-08-27T03:13:29.492Z','2026-08-27T03:13:29.492Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-86','tencent','在研剑来IP单机游戏-2D场景原画(深圳)','1.制定场景美术风格、世界观视觉、色彩与光影调性，输出风格标杆、情绪板、关键概念图；','1.制定场景美术风格、世界观视觉、色彩与光影调性，输出风格标杆、情绪板、关键概念图；
2.独立完成氛围图、区域规划、地标建筑、大型地貌、叙事场景等高规格设计；
3.输出可落地设定：建筑拆解、材质规范、细节指引，支撑 3D / 地编 / 关卡制作；
4.协同把控落地还原度，制定验收标准。提炼东方意境、中式构景、仙侠符号，转化为高级原创视觉；
5.平衡艺术表达与项目品质落地。','R工作室','2D场景设计','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,86,'2026-03-23T05:18:13.000Z','2026-08-27T03:13:29.493Z','2026-08-27T03:13:29.493Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-87','tencent','智能投顾资产运营-高级产品经理(深圳)','1.基于市场研判与用户画像，输出面向高净值用户的资产配置专业意见，支撑AI投顾系统的决策逻辑与内容生成；','1.基于市场研判与用户画像，输出面向高净值用户的资产配置专业意见，支撑AI投顾系统的决策逻辑与内容生成；
2.将专家经验转化为可结构化的投顾规则，协同算法团队持续优化策略输出的专业性与适配度，负责固收+等核心策略的资产配置模型分析与优化，提升组合的风险收益匹配能力；
3.推动模型结果在AI投顾系统中的产品化交付，确保配置建议具备可解释性、合规性与个性化推荐能力；
4.围绕高净值用户需求，主导理财专区的产品功能设计与内容策略优化，设计数据驱动的用户陪伴策略，包括持仓解读、市场波动应对建议、调仓提醒等，提升用户持有体验与复投转化；
5.建立分层陪伴机制，借助AI实现规模化、个性化的用户运营，持续提升留存率与资产保有量。','财富管理部','金融产品管理与研究','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,87,'2026-03-25T01:41:12.000Z','2026-08-27T03:13:29.494Z','2026-08-27T03:13:29.494Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-88','tencent','《王者荣耀世界》角色概念设计专家(上海)','1.具备为项目角色风格定调，重点角色及族群势力的设计探索能力，建立设计标杆；','1.具备为项目角色风格定调，重点角色及族群势力的设计探索能力，建立设计标杆；
2.配合产品与项目要求制定角色美术风格，总结和输出美术风格的设计标准；
3.参与角色从前期到落地全流程的设计工作，审核外包提交的原画设计稿；
4.积累和共享原画设计经验，编写课件并培养新人，分享设计经验；
5.能持续探索角色设计风格与方向。','天美L1工作室','2D角色设计','上海',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,88,'2026-03-27T05:09:25.000Z','2026-08-27T03:13:29.495Z','2026-08-27T03:13:29.495Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-89','tencent','在研3D动作游戏-资深UE5引擎开发工程师（深圳/北京）(深圳)','1.负责引擎相关功能开发或修改，攻坚引擎底层疑难问题；','1.负责引擎相关功能开发或修改，攻坚引擎底层疑难问题；
2.负责图形渲染效果开发和协助提升美术制作工艺；
3.优化引擎提高各模块的效果与性能；
4.负责游戏的卡顿、帧率、内存、功耗等性能问题的监控、分析、定位、解决，以及相关规范的制定、监督；
5.负责编辑器、工具链等开发和维护，为团队提供基础设施建设，提升研发效率和质量；
6.跟踪并研究最新的游戏引擎技术和趋势，将其应用到实际项目中，提升产品体验。','魔王工作室','游戏客户端开发','深圳','深圳/北京',2,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,89,'2026-03-30T02:55:34.000Z','2026-08-27T03:13:29.496Z','2026-08-27T03:13:29.496Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-90','tencent','机器学习平台专家/架构师（深圳/北京/上海）(深圳)','1.负责腾讯混元机器学习平台的设计与开发，包括：性能优化，持续提升训练性能，包括多机多卡大规模训练优化，数据交换优化等；','1.负责腾讯混元机器学习平台的设计与开发，包括：性能优化，持续提升训练性能，包括多机多卡大规模训练优化，数据交换优化等；
2.深入理解跟踪业界AIGC动态，优化平台技术方案，提升平台易用性，降低大模型研发门槛，不断推进平台的LLMOps能力升级；
3.积极追踪业内AI动态，优化内部技术方案，改进产品性能，不断推进AI架构升级。','数据计算平台部','后台开发','深圳','深圳/北京/上海',4,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,90,'2026-03-31T01:26:07.000Z','2026-08-27T03:13:29.497Z','2026-08-27T03:13:29.497Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-91','tencent','IDC网络采购商务经理(深圳)','1.运营商网络商务拓展：根据公司总体规划，负责网络节点的选址、考察等前期技术交流、网络节点资源落地实施相关的商务谈判、合同签署、计费支付等商务全流程工作；','1.运营商网络商务拓展：根据公司总体规划，负责网络节点的选址、考察等前期技术交流、网络节点资源落地实施相关的商务谈判、合同签署、计费支付等商务全流程工作；
2.运营商沟通与合作：负责所辖地区的各地运营商商务接口，建立并维护双方长期、深入、全方位的战略合作伙伴关系，支撑公司业务发展与运营商战略落地实施；
3.运维支持：作为公司与电信运营商/供应商的第一接口人，负责建立双方规划、运维、网络团队的沟通机制，协调业务运行过程中的各类运维问题与优化需求。','云采购供应管理部','采购商务管理','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,91,'2026-04-01T09:00:40.000Z','2026-08-27T03:13:29.498Z','2026-08-27T03:13:29.498Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-92','tencent','QQ游戏平台-产品策划-用户体验与活跃提升方向(深圳)','1.负责QQ游戏中心双端整体用户体验打磨与活跃提升，需深度理解结合游戏行业特性，通过用户需求洞察、体验策略设计及数据驱动迭代，探索QQ优势的用户价值，打造高粘性…','1.负责QQ游戏中心双端整体用户体验打磨与活跃提升，需深度理解结合游戏行业特性，通过用户需求洞察、体验策略设计及数据驱动迭代，探索QQ优势的用户价值，打造高粘性、高价值的用户生态，推动平台用户活跃、留存及长期价值增长；
2.用户体验诊断与策略制定 ：主导平台全链路用户链路分析，挖掘核心体验痛点，输出体验优化策略，推动体验从“可用”到“好用”的升级；
3.用户增长场景设计与落地 ：基于用户分层，设计差异化活跃策略，联动游戏/内容/社区资源，提升用户日均使用时长与核心功能渗透率；
4.跨端体验统一与创新 ：统筹PC、移动端等多端体验一致性，结合游戏用户“碎片化+沉浸式”需求，优化跨端功能适配。','社交增值产品部','产品策划','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,92,'2026-04-02T14:18:02.000Z','2026-08-27T03:13:29.499Z','2026-08-27T03:13:29.499Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-93','tencent','预研动作手游-角色原画主笔(深圳)','1.主导游戏角色原画整体风格定位，结合项目世界观、剧情设定，制定角色原画设计标准和美术规范，把控全流程角色设计的统一性和高品质；','1.主导游戏角色原画整体风格定位，结合项目世界观、剧情设定，制定角色原画设计标准和美术规范，把控全流程角色设计的统一性和高品质；
2.独立负责核心角色（主角、关键NPC、核心怪物等）的原画设计全流程，包括人设创意构思、线稿绘制、色彩搭配、细节刻画，输出兼具创意性、观赏性和可落地性的设计作品；
3.深度参与项目美术需求研讨，对接策划、建模等相关部门，准确理解需求并转化为设计方案，为建模、动画等后续环节提供专业美术指导，确保设计方案可落地执行；
4.审核团队内角色原画作品，提出针对性优化建议，指导初级/中级画师提升创作能力，统筹角色原画创作进度，确保符合项目时间节点和美术标准；
5.跟踪行业前沿美术趋势（重点关注二次元、动漫改编类），积累设计灵感，推动角色原画设计创新，优化创作流程，提升团队整体创作效率和作品品质；
6.配合完成项目宣传插画、角色延展设计等相关美术工作，确保宣传物料与游戏整体美术风格统。','魔王工作室','2D角色设计','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,93,'2026-04-10T04:14:23.000Z','2026-08-27T03:13:29.500Z','2026-08-27T03:13:29.500Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-94','tencent','营销与交易产品部-营销云AI产品经理(上海)','1.负责营销云 AI 产品（智能体平台/AI Agent）的产品规划与设计，围绕社媒营销、内容生成、智能投放等场景，将大模型能力转化为可落地的产品方案；','1.负责营销云 AI 产品（智能体平台/AI Agent）的产品规划与设计，围绕社媒营销、内容生成、智能投放等场景，将大模型能力转化为可落地的产品方案；
2.深入理解企业营销场景和用户需求，主导需求调研、竞品分析、用户画像梳理，定义产品方向和优先级；
3.适配 CodeBuddy、Cloud Code 等 AI原生开发工具，探索 AI 原生产品协同模式，推动以 AI 为核心的产品设计与团队协作方式变革，实现需求定义、方案输出、原型验证的 AI 化提效；
4.紧跟 AI/大模型技术前沿，包括但不限于 LLM、AI Agent、RAG、多模态、harness、上下文工程等 等方向，评估新技术对产品的应用价值，将技术能力翻译为产品功能；
5.建立产品数据监控体系，通过数据分析驱动产品迭代，持续优化用户体验和商业效果。','营销与交易产品部','产品策划','上海',NULL,0,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,94,'2026-04-10T04:56:05.000Z','2026-08-27T03:13:29.501Z','2026-08-27T03:13:29.501Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-95','tencent','PUBG Mobile-3D特效设计师-重构(深圳)','1.将视觉做完的效果图通过虚幻引擎的UMG系统进行还原；','1.将视觉做完的效果图通过虚幻引擎的UMG系统进行还原；
2.搭建和推进提升重构工作效率的工具脚本和流程；
3.对接策划交互视觉，梳理整体需求；
4.负责统筹分配重构模块工作，管理重构V岗人员，负责V岗产出和质量。','量子工作室','特效设计','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,95,'2026-04-11T08:05:02.000Z','2026-08-27T03:13:29.502Z','2026-08-27T03:13:29.502Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-96','tencent','营销与交易产品部-云Mall 高级产品经理（电商交易平台方向）(深圳)','1.负责云Mall产品线的整体产品规划，包括版本路线图、优先级决策，从电商交易全链路（商品发现→决策转化→交易履约→售后服务）出发定义产品核心能力和差异化打法；','1.负责云Mall产品线的整体产品规划，包括版本路线图、优先级决策，从电商交易全链路（商品发现→决策转化→交易履约→售后服务）出发定义产品核心能力和差异化打法；
2.主导交易核心模块的产品架构设计，包括商品管理、订单管理、结算引擎、库存管理、营销活动、售后服务等，设计可复用的产品化底座，支撑私有化部署与SaaS双模式交付；
3.从AI原生视角重新定义交易平台的产品形态，思考当AI Agent成为交易参与者时，交易平台的产品架构、交互模式、数据开放方式需要发生怎样的根本性变化，而非在现有产品上叠加AI功能；
4.前瞻性规划面向AI Agent时代的交易基建，定义交易平台如何适配"人+Agent"混合交易场景——商品如何被机器理解、交易流程如何被协议化调用、履约能力如何对外开放；
5.深度洞察品牌客户需求，区分大品牌与中腰部客户的差异化诉求，将客户需求转化为可落地的产品方案；
6.持续跟踪行业趋势与竞品动态（如业内头部标杆产品的AI化演进，AI Agent/MCP等新范式对电商交易场的重塑），转化为产品策略输入。','营销与交易产品部','产品策划','深圳','电商交易平台方向',2,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,96,'2026-04-13T00:05:11.000Z','2026-08-27T03:13:29.503Z','2026-08-27T03:13:29.503Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-97','tencent','《洛克王国：世界》-游戏测试开发工程师(深圳)','1.负责大世界手游产品的测试工作，包括性能、自动化、代码质量等维度；','1.负责大世界手游产品的测试工作，包括性能、自动化、代码质量等维度；
2.负责项目/模块的测试流程优化、测试效率优化、质量改进等；
3.负责项目/模块的测试计划排期和测试任务跟踪执行，及时提出风险项，确保所负责项目/模块的质量；
4.针对游戏业务测试中的盲区和难点提出新的测试方案，引入或开发新的测试方法和测试工具。','技术中心','游戏测试','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,97,'2026-04-17T02:12:47.000Z','2026-08-27T03:13:29.504Z','2026-08-27T03:13:29.504Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-98','tencent','魔方在研轻动作游戏预研项目-客户端负责人(深圳)','1.负责游戏产品需求的技术可行性评估，技术方案的设计和实现；','1.负责游戏产品需求的技术可行性评估，技术方案的设计和实现；
2.负责建立以AI驱动的，高效的游戏内容制作管线，保障运行性能；
3.负责搭建前端开发的AI工作流，完善并持续优化AI相关工具链；
4.与策划、美术、服务端程序紧密合作，完善游戏产品，打磨用户体验。','创新业务中心','游戏客户端开发','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,98,'2026-04-17T03:20:29.000Z','2026-08-27T03:13:29.505Z','2026-08-27T03:13:29.505Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-99','tencent','灰境行者-资深系统策划(上海)','1.负责游戏内各类系统的设计、实现与优化迭代；','1.负责游戏内各类系统的设计、实现与优化迭代；
2.撰写设计文档，协调研发资源，跟进开发过程，对系统的最终质量和体验负责；
3.持续提升游戏内各类系统的体验，捕捉各类痛点，提出各类优化方案；
4.与协作部门进行紧密协作，推动各类系统建设。','北极光A3工作室','游戏策划','上海',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,99,'2026-04-18T12:28:26.000Z','2026-08-27T03:13:29.506Z','2026-08-27T03:13:29.506Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-100','tencent','《灰境行者》-资深角色原画设计师(上海)','1.负责游戏角色服装、枪械及武器外观原画设计；','1.负责游戏角色服装、枪械及武器外观原画设计；
2.对接策划需求，梳理内容并规划设计产出；
3.分析竞品，提供差异化、有辨识度的设计创意；
4.优化跨组协作流程，提升美术研发效率。','北极光A3工作室','2D角色设计','上海',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,100,'2026-04-18T12:29:08.000Z','2026-08-27T03:13:29.507Z','2026-08-27T03:13:29.507Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-101','tencent','Project T UE5 客户端开发工程师（3C）(深圳)','1.负责角色、输入控制、相机、移动物理、技能等模块的开发及相关技术预研；','1.负责角色、输入控制、相机、移动物理、技能等模块的开发及相关技术预研；
2.负责复杂地形下的 Locomotion 实现，如攀爬、跑酷等；
3.负责引擎底层相关功能的开发与维护。','BST创想中心','游戏客户端开发','深圳','3C',1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,101,'2026-04-19T07:37:11.000Z','2026-08-27T03:13:29.508Z','2026-08-27T03:13:29.508Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-102','tencent','Project T  UE5 客户端开发工程师（游戏 AI）(深圳)','1.负责 PC 平台 3A 品质项目中敌人、伙伴等角色 AI 行为逻辑与表现相关开发；','1.负责 PC 平台 3A 品质项目中敌人、伙伴等角色 AI 行为逻辑与表现相关开发；
2.负责 AI 相关系统的开发与优化，包括但不限于感知、寻路、动作表现、状态同步等；
3.参与 AI 行为与动作表现设计，并与动作、策划团队紧密协作，确保最终效果符合项目品质要求；
4.调试并修复 AI 相关问题，对 AI 功能质量与表现效果负责；
5.解决并优化 AI 的性能问题及系统瓶颈；
6.负责构建精细化的 AI 数值分析体系，并持续优化 AI 的实际表现效果。','BST创想中心','游戏客户端开发','深圳','游戏 AI',1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,102,'2026-04-19T07:37:11.000Z','2026-08-27T03:13:29.509Z','2026-08-27T03:13:29.509Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-103','tencent','3D动作策略游戏《虚环》-3D角色设计师(深圳)','1.负责主导项目角色美术风格的定义、研发与实现。深入解构二次元面部美学与形体特征，制定从2D设计到3D模型的风格塑造及品质的美术效果提升方案，输出角色标杆；','1.负责主导项目角色美术风格的定义、研发与实现。深入解构二次元面部美学与形体特征，制定从2D设计到3D模型的风格塑造及品质的美术效果提升方案，输出角色标杆；
2.主导二次元风格化渲染、材质表现（如PBR+NPR材质）等关键技术方案的预研、开发与落地；
3.负责对关键角色资产进行质量把关与效果评审，指导并赋能团队美术师；
4.深度参与角色设计、绑定、动画等环节的协同，提供专业的前置建议与解决方案。关注行业技术与艺术趋势，进行前瞻性技术预研与艺术风格探索。','内容生态部','3D角色设计','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,103,'2026-04-23T08:06:46.000Z','2026-08-27T03:13:29.510Z','2026-08-27T03:13:29.510Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-104','tencent','PUBG Mobile-游戏动作设计师（AI 辅助动画方向）(深圳)','1.负责 PUBG Mobile 项目商城展示动作、局内玩法动作、角色 / 生物动作等内容的设计与制作；','1.负责 PUBG Mobile 项目商城展示动作、局内玩法动作、角色 / 生物动作等内容的设计与制作；
2.负责动画需求对接、动作方案设计、资源制作与交付、引擎合入及最终效果验收；
3.负责与外部合作方 / 外包团队对接，制定反馈标准，进行动作质量审核、修改指导与交付验收；
4.参与 AI 辅助动画制作流程探索与应用，包括视频动捕、AI 辅助补间、动捕数据清理、动作资产检索与复用等；
5.结合日常制作需求，参与历史动作资产、动捕数据和参考视频的整理、标签化与复用流程建设，提升动作资产检索和复用效率。','量子工作室','动画设计','深圳','AI 辅助动画方向',1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,104,'2026-05-02T02:46:10.000Z','2026-08-27T03:13:29.511Z','2026-08-27T03:13:29.511Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-105','tencent','预研动作手游-文案策划（世界观方向）(深圳)','1.负责世界观相关内容的构思创作、世界观的搭建与完善，确保世界观运转逻辑严密；','1.负责世界观相关内容的构思创作、世界观的搭建与完善，确保世界观运转逻辑严密；
2.对世界观构建内容进行考据与文脉溯源，探索世界观、场景独特性以及场景概念POI的呈现；
3.构建体系化与高辨识度的战斗能力体系，为ACT战斗与表现提供设定支撑；
4.维护世界观文档、资源管理工作，参与叙事、表演等模块的构思与创作；
5.与概念美术、场景美术、系统策划、战斗策划等职能合作，将世界观以强记忆点，强张力的方式与游戏内的系统、玩法结合，转化成玩家可感知的视听语言。','魔王工作室','游戏策划','深圳','世界观方向',1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,105,'2026-05-08T04:34:05.000Z','2026-08-27T03:13:29.512Z','2026-08-27T03:13:29.512Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-106','tencent','腾讯云-医疗行业海外项目交付经理-上海(上海)','1.海外医疗项目全生命周期管理：负责腾讯云医疗健康解决方案在海外市场的项目交付，涵盖评估、执行、验收各阶段，确保项目按时按质按预算达成目标；','1.海外医疗项目全生命周期管理：负责腾讯云医疗健康解决方案在海外市场的项目交付，涵盖评估、执行、验收各阶段，确保项目按时按质按预算达成目标；
2.跨团队资源协调与客户管理：统筹协调内部产研、售前、解决方案及外部合作伙伴资源，同时作为面向海外大型药企及医疗集团客户的主要项目接口人，主导客户沟通与期望管理，保障客户满意度；
3.风险识别与合规管控：建立项目风险预警机制，及时发现并解决技术、资源、合规等风险；确保项目交付符合当地医疗数据法规（如HIPAA、GDPR等）要求；
4.交付流程优化与持续改进：推动海外医疗项目协作方式与交付流程的持续优化，沉淀医疗行业项目管理方法论与最佳实践，提升团队整体交付能力。','医疗健康事业部','交付项目管理','上海',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,106,'2026-05-08T12:52:12.000Z','2026-08-27T03:13:29.513Z','2026-08-27T03:13:29.513Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-107','tencent','混元-大模型应用开发工程师（北京/深圳）(深圳)','1.负责大模型应用 APP 的研发工作，参与 iOS/Android 跨端产品从 0 到 1 的架构设计、核心功能开发、上线迭代与体验优化；','1.负责大模型应用 APP 的研发工作，参与 iOS/Android 跨端产品从 0 到 1 的架构设计、核心功能开发、上线迭代与体验优化；
2.围绕 AI 对话、翻译、总结、写作辅助、多轮会话、语音输入/播报、文档处理等场景，完成大模型能力在移动端的产品化落地；
3.负责 APP 与大模型服务的接入与优化，包括流式输出、上下文管理、会话历史、Prompt 模板、模型路由、请求重试、缓存、弱网/无网处理等能力建设；
4.参与端侧大模型能力探索，支持模型文件下载与管理、端侧推理接入、量化模型运行、离线能力、隐私保护、首 Token 延迟、内存与功耗优化等工作；
5.建设高质量移动端工程体系，保障 APP 在多端设备上的稳定性、兼容性、性能、安全性和用户体验；
6.与产品、算法、服务端、设计团队紧密协作，持续打磨面向 C 端用户的 AI 原生应用体验，打造好用、稳定、智能的移动端大模型应用。','基础模型部','应用开发','深圳','北京/深圳',1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,107,'2026-05-11T07:25:16.000Z','2026-08-27T03:13:29.514Z','2026-08-27T03:13:29.514Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-108','tencent','OG项目组-资深大世界关卡策划(深圳)','1.设计并实现大世界相应的POI，区域规划等；','1.设计并实现大世界相应的POI，区域规划等；
2.协同开发和美术，利用程序生成和手工编辑等工作流程，落地世界规划设计；
3.根据玩法流程进行相应的关卡layout，节奏和元素设计等工作；
4.统筹及提出功能资产需求，跟进开发，验收内容，持续产出优化迭代方案。','BST创想中心','游戏策划','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,108,'2026-05-15T04:03:15.000Z','2026-08-27T03:13:29.515Z','2026-08-27T03:13:29.515Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-109','tencent','魔方在研轻动作风格化游戏预研项目关卡策划(深圳)','1.负责设计、跟进与落地国风动作游戏强表现的探索关卡；','1.负责设计、跟进与落地国风动作游戏强表现的探索关卡；
2.根据关卡玩法设计，搭建关卡白模，输出美术需求，配合场景美术完成关卡场景制作；
3.参与完成关卡中战斗内容的制作；
4.参与游戏部分内容切片的 DEMO 制作；
5.参与部分关卡玩法的设计、制作。','XY业务中心','游戏策划','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,109,'2026-05-15T12:49:00.000Z','2026-08-27T03:13:29.516Z','2026-08-27T03:13:29.516Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-110','tencent','魔方在研轻动作风格化游戏预研项目战斗策划(深圳)','1.负责战斗体系的设计、迭代，以及规则机制、角色技能的设计与制作；','1.负责战斗体系的设计、迭代，以及规则机制、角色技能的设计与制作；
2.与程序、美术团队紧密配合，推动怪物、职业技能、地图等从玩法机制、数值设计、美术包装、实机表现的完整落地；
3.设计玩法的经济数值循环系统，确保对局内和跨局间玩家追求与平衡性、数值不膨胀溢出；
4.实时跟踪用户反馈及对战数据，针对潜在问题或风险进行合理分析，并进行及时跟进解决；
5.基于后台数据和玩家反馈，优化和迭代战斗技能设计并复盘制作标准，指导开发新内容，保持玩法的新鲜度和吸引力。','XY业务中心','游戏策划','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,110,'2026-05-15T12:49:00.000Z','2026-08-27T03:13:29.517Z','2026-08-27T03:13:29.517Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-111','tencent','魔方在研轻动作风格化游戏预研项目场景概念设计专家(深圳)','1.主导场景概念和风格探索和定调，擅长偏写实向风格化和强氛围叙事的高概念，并能搭建概念设计的规范与标准；','1.主导场景概念和风格探索和定调，擅长偏写实向风格化和强氛围叙事的高概念，并能搭建概念设计的规范与标准；
2.随着项目阶段深入，负责场景概念团队搭建、梯队建设与日常管理，搭建一个有强设计和风格输出的团队；
3.深度参与世界观共创，根据项目世界观，输出高概念场景设计、氛围图、Key Arts 及资产拆分方案；
4.关注落地，协同策划、场景制作、TA团队，将设计意图落地，推动场景美术风格与玩法、叙事的融合和最高表现；
5.规范梳理能力强，配合关卡和TA共同制定项目标准和复用量产逻辑，结合项目风格输出设计标杆、拆分方案与规划资产分级落地规范规范场景资产生产逻辑，输出设计标杆与量产规范，保障全项目风格统一与品质上限。','XY业务中心','2D场景设计','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,111,'2026-05-15T12:49:11.000Z','2026-08-27T03:13:29.518Z','2026-08-27T03:13:29.518Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-112','tencent','在研剑来IP单机游戏-2D场景原画(杭州)','1.制定场景美术风格、世界观视觉、色彩与光影调性，输出风格标杆、情绪板、关键概念图；','1.制定场景美术风格、世界观视觉、色彩与光影调性，输出风格标杆、情绪板、关键概念图；
2.独立完成氛围图、区域规划、地标建筑、大型地貌、叙事场景等高规格设计；
3.输出可落地设定：建筑拆解、材质规范、细节指引，支撑 3D / 地编 / 关卡制作；
4.协同把控落地还原度，制定验收标准。提炼东方意境、中式构景、仙侠符号，转化为高级原创视觉；
5.平衡艺术表达与项目品质落地。','R工作室','2D场景设计','杭州',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,112,'2026-06-11T12:38:36.000Z','2026-08-27T03:13:29.519Z','2026-08-27T03:13:29.519Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-113','tencent','腾讯健康-医疗行业售前架构师(上海)','1.行业解决方案：洞察医疗行业的数字化发展趋势，整合腾讯各类产品、技术和合作伙伴能力，持续形成具备竞争力的行业解决方案；','1.行业解决方案：洞察医疗行业的数字化发展趋势，整合腾讯各类产品、技术和合作伙伴能力，持续形成具备竞争力的行业解决方案；
2.售前技术支持：面向医疗行业客户，提供全面的腾讯各类产品和解决方案的售前技术咨询工作，在销售团队完成项目合同签订的过程中提供相关技术支持；
3.产品技术支持：协助产品经理，完善行业产品的发展规划、形态模式、需求规格梳理和技术选型设计工作；
4.合作伙伴生态建设：协助销售和项目交付团队，评估和引入合格的合作伙伴，并赋能合作伙伴，进行方案交流和培训。','医疗健康事业部','技术咨询','上海',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,113,'2026-05-18T10:38:06.000Z','2026-08-27T03:13:29.520Z','2026-08-27T03:13:29.520Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-114','tencent','《王者荣耀》游戏客户端开发工程师—图形渲染方向(成都)','1.主导并推动使用Unity建立适合项目美术风格的渲染管线；','1.主导并推动使用Unity建立适合项目美术风格的渲染管线；
2.针对需求定制增改Unity引擎底层功能和框架，开发引擎相关特性 (光照、渲染、管线、GPUDriven、资源管理等)；
3.负责高级图形效果开发，优化美术制作管线，在美术品质和管线效率方面产生价值；
4.探索游戏渲染与机器学习的结合应用，提升团队效率，产出有价值能落地的技术；
5.游戏中图形相关性能优化及兼容性问题解决。','天美L1工作室','游戏客户端开发','成都',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,114,'2026-04-21T14:00:41.000Z','2026-08-27T03:13:29.521Z','2026-08-27T03:13:29.521Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-115','tencent','在研UGC 产品负责人(深圳)','1.主导游戏UGC生态的整体规划与核心设计，制定UGC编辑器、玩法创作、内容分发、用户互动的全链路策略；','1.主导游戏UGC生态的整体规划与核心设计，制定UGC编辑器、玩法创作、内容分发、用户互动的全链路策略；
2.牵头UGC平台产品核心模块设计，基于玩家创作需求、关卡玩法创新及商业化场景；
3.负责核心UGC玩法策略制定，搭建玩法原型并完成逻辑编辑、效果验证；
4.建立UGC生态核心数据监控体系（创作量、内容曝光、用户留存、创作者活跃度等），结合用户反馈、竞品分析与产品战略，制定编辑器及UGC玩法的迭代路线图，持续优化创作体验与内容生态质量；
5.联动运营团队设计创作者分层运营策略、激励体系（如创作者等级、奖励机制、官方合作），挖掘并扶持核心创作者，提升用户创作热情与生态粘性，推动UGC内容与官方玩法深度融合。','XY业务中心','游戏策划','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,115,'2026-05-19T02:13:53.000Z','2026-08-27T03:13:29.522Z','2026-08-27T03:13:29.522Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-116','tencent','IAA休闲类-小游戏策划(深圳)','1.负责项目整体设计工作‌，包括数值设计、系统设计、关卡设计等，并与团队成员配合完成各系统功能交付；','1.负责项目整体设计工作‌，包括数值设计、系统设计、关卡设计等，并与团队成员配合完成各系统功能交付；
2.关注微信、DY、B 站等平台热点，策划游戏与热点结合的更新内容，想出能在游戏中实现的创意，对结果负责；
3.与美术、技术人员进行对接，制定、执行和跟踪游戏关卡的开发周期；
4.跟踪推广效果，收集、研究达人、用户的反馈，根据分析结果制定产品优化方案。','公共数据科学部','游戏策划','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,116,'2026-05-25T03:20:19.000Z','2026-08-27T03:13:29.523Z','2026-08-27T03:13:29.523Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-117','tencent','OG项目组-高级战斗策划(深圳)','1.负责设计游戏中的战斗系统，包括但不限于战斗流程、战斗相关系统、武器（射击&近战）与装备、角色属性等，以确保游戏战斗的深度和多样性；','1.负责设计游戏中的战斗系统，包括但不限于战斗流程、战斗相关系统、武器（射击&近战）与装备、角色属性等，以确保游戏战斗的深度和多样性；
2.编写详尽的游戏战斗机制文档，描述战斗系统的设计思路、机制和实现方法，并持续与设计团队充分讨论迭代完善；
3.追求极致&创新思维。持续了解业内顶尖产品，将优秀的设计理念和品质，特性融入产品设计。持续迭代整体战斗表现效果、战斗体验达到3a水准；
4.与团队内部策划、开发、美术和音频团队紧密合作，共同达成交付目标。','BST创想中心','游戏策划','深圳',NULL,3,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,117,'2026-06-10T03:30:22.000Z','2026-08-27T03:13:29.524Z','2026-08-27T03:13:29.524Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-118','tencent','OG项目组-资深叙事设计师 (深圳)','1.协助首席叙事设计师完成故事的开发和撰写；','1.协助首席叙事设计师完成故事的开发和撰写；
2.为单人或多人角色的游戏人物设计并撰写故事情节；
3.为主角撰写人物对话；
4.与游戏玩法策划协作，将故事整合融入到游戏人物中；
5.与概念创意部门合作，保证视觉故事的统一和完整性；
6.撰写和编辑游戏的脚本和技术文本，包括对话、提示、物品描述等。','BST创想中心','游戏策划','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,118,'2026-06-10T07:03:42.000Z','2026-08-27T03:13:29.526Z','2026-08-27T03:13:29.526Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-119','tencent','在研剑来IP单机游戏-场景美术师(杭州)','1.基于UE5引擎搭建高精度仙侠场景，包括地形雕刻、光影构图、建筑布局、植被生态及氛围渲染；','1.基于UE5引擎搭建高精度仙侠场景，包括地形雕刻、光影构图、建筑布局、植被生态及氛围渲染；
2.运用程序化生成工具 （Houdini、World Machine）批量制作自然景观，并适配动态天气系统；
3.优化场景资源性能，熟练应用Nanite虚拟几何体、Lumen全局光照技术，平衡视觉效果与运行效率；
4.协同材质团队开发场景Shader（如古建筑瓦片、竹林植被、水体质感），提升场景细节表现力。','R工作室','3D场景设计','杭州',NULL,0,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,119,'2026-06-11T12:38:36.000Z','2026-08-27T03:13:29.527Z','2026-08-27T03:13:29.527Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-120','tencent','高级法律顾问-境内支付业务方向(深圳)','1.负责支付业务相关法律文件的起草、审核及谈判工作，包括但不限于各类合作协议、业务合同、用户协议等；','1.负责支付业务相关法律文件的起草、审核及谈判工作，包括但不限于各类合作协议、业务合同、用户协议等；
2.为支付业务的产品创新、运营模式、合规需求提供专业法律意见及解决方案，保障业务合规开展；
3.跟踪并解读支付行业相关法律法规及监管政策，对业务合规性进行前瞻性研判与风险预警；
4.配合开展监管对接沟通、牌照维护及合规审计相关工作，确保业务持续符合监管合规要求；
5.建立并完善支付业务法律风险管控制度及标准合同文本体系，提升法律支持服务效率。','金融法律合规部','法务','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,120,'2026-05-25T06:43:12.000Z','2026-08-27T03:13:29.528Z','2026-08-27T03:13:29.528Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-121','tencent','智能体-产品运营leader-CodeBuddy/WorkBuddy(深圳)','1.负责腾讯云CodeBuddy/WorkBuddy产品的用户增长与产品运营，制定增长目标、策略及落地计划，并推动实施；','1.负责腾讯云CodeBuddy/WorkBuddy产品的用户增长与产品运营，制定增长目标、策略及落地计划，并推动实施；
2.深入理解产品特性与用户需求，通过数据驱动和运营手段提升产品活跃度与用户满意度；
3.设计和执行产品增长实验，依托数据分析和用户反馈持续优化运营策略，实现用户规模化增长；
4.协同产品与技术团队，推动产品迭代与功能优化，并提出运营侧改进建议；
5.策划并输出包括技术文章、解决方案等高质量内容，传递产品价值，提升产品在开发者群体中的影响力。','云产品六部','行业应用','深圳',NULL,0,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,121,'2026-03-17T04:59:23.000Z','2026-08-27T03:13:29.528Z','2026-08-27T03:13:29.528Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-122','tencent','智能体-产品leader-CodeBuddy/WorkBuddy(深圳)','1.负责基于腾讯云CodeBuddy//WorkBuddy产品规划，探索自研或行业大模型的应用方案；','1.负责基于腾讯云CodeBuddy//WorkBuddy产品规划，探索自研或行业大模型的应用方案；
2.对 AI 产品效果负责，对数据和大模型评测有深入理解，能够有效地通过评测集设计选型大模型或引领大模型能力的提升；
3.与研发团队充分沟通协作，保证产品按时、高质上线，关注效果数据、用户体验。','云产品六部','技术产品','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,122,'2026-03-17T04:59:23.000Z','2026-08-27T03:13:29.529Z','2026-08-27T03:13:29.529Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-123','tencent','混元大模型数据交付负责人（北京/深圳）(北京)','1.制定大模型后训练分Topic数据策略，搭建数据质量评估体系与数据生产标准，针对性优化数据短板，提升模型训练效果；','1.制定大模型后训练分Topic数据策略，搭建数据质量评估体系与数据生产标准，针对性优化数据短板，提升模型训练效果；
2.全面管理数据合成、数据质检、数据标注、数据运营小组，负责团队搭建、流程制定、任务统筹与绩效管控，保障数据高效高质量交付；
3.协同算法、研发团队，对齐模型训练需求，落地数据优化方案，跟进数据-模型效果联动优化，推动数据生产智能化升级；
4.把控数据合规与安全，统筹数据项目进度与目标达成，定期复盘数据质量与团队效能。','AI Data部','产品策划','北京','北京/深圳',5,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,123,'2026-04-09T11:44:52.000Z','2026-08-27T03:13:29.530Z','2026-08-27T03:13:29.530Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-124','tencent','混元数据算法工程师（Agent 数据质检方向）(北京)','1.理解并检验"什么是好的 Agent 数据"：针对 Agent 场景特有的多轮交互、长链路规划、工具调用与环境反馈特性,把模型能力目标操作化为可执行的数据质量…','1.理解并检验"什么是好的 Agent 数据"：针对 Agent 场景特有的多轮交互、长链路规划、工具调用与环境反馈特性,把模型能力目标操作化为可执行的数据质量标准与标注规范(rubric、验收准则、轨迹合理性定义),并建设配套的自动化质检体系——识别诸如"在失败策略上反复循环而不切换""工具调用参数凭空构造而非基于环境反馈""规划与实际执行脱节"等深层轨迹缺陷；
2.人机协同的质量流程设计：设计并落地人机协同的数据质量流程——用模型做预标注/预筛、人工聚焦高价值判断与校正、auto-QA 兜底一致性,在保证质量标准的前提下提升轨迹质检与标注的规模化效率；
3.前沿跟踪与能力沉淀，跟踪支撑 Agent 能力提升的前沿方法(轨迹质量评估、Agent 评测方法、可验证 reward 设计等),将其转化为质检与评测能力;并把这套数据质量判断力沉淀、共享给协作的模型团队。','AI Data部','应用研究','北京','Agent 数据质检方向',1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,124,'2026-04-10T02:34:55.000Z','2026-08-27T03:13:29.531Z','2026-08-27T03:13:29.531Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-125','tencent','企业微信-整合营销经理(广州)','1.为企业微信用户增长制定整合营销方案，并完成执行落地，从而提升产品的行业影响力与转化率；','1.为企业微信用户增长制定整合营销方案，并完成执行落地，从而提升产品的行业影响力与转化率；
2.梳理和制定企业微信关键节点产品/品牌定位、积累品牌资产、制定年度营销传播策略；
3.通过内容营销、KOL/媒体/名人合作等方式建立行业影响力；在关键节点建立竞争优势，提升口碑；
4.通过市场培育等方式，帮助企业更高效率数字化。','企业微信产品部','产业互联网营销','广州',NULL,0,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,125,'2026-04-29T13:01:56.000Z','2026-08-27T03:13:29.532Z','2026-08-27T03:13:29.532Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-126','tencent','视频生成数据标注项目管理负责人(北京)','1.标注体系建设：主导视频生成模型数据标注体系从0到1搭建，包括标注规范设计、标注流程制定、质量标准定义、SOP沉淀，覆盖Caption撰写、运镜标注、视频评测…','1.标注体系建设：主导视频生成模型数据标注体系从0到1搭建，包括标注规范设计、标注流程制定、质量标准定义、SOP沉淀，覆盖Caption撰写、运镜标注、视频评测、偏好排序、R2V数据构造等全场景；
2.项目管理与交付：统筹管理多条并行数据管线（Caption管线、精标管线、R2V管线、评估管线），制定项目计划、资源分配、进度管控，确保数据交付的质量和时效性，对齐算法团队的模型迭代节奏；
3.团队建设与管理：组建并管理千人规模的标注团队（含自营专职、众包、外部供应商等多种产能模式），搭建分层人才体系，建立标注人员的招募、培训、考核、激励机制，尤其重视垂类专业人才的引入和培养；
4.质量管理：设计并落地多级质控体系，通过数据分析和工艺改善驱动质量持续提升，确保核心指标达成；
5.算法协同：与模型团队深度协作，理解模型训练各阶段对数据的差异化需求，参与标注规则的共创式建设；
6.效率与成本优化：推动AI辅助标注工具的落地应用（模型预标注、智能分段、Caption自动生成等），提升机审替代率，优化成本和标注效率。','内容服务部','产品运营','北京',NULL,0,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,126,'2026-04-28T10:18:25.000Z','2026-08-27T03:13:29.534Z','2026-08-27T03:13:29.534Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-127','tencent','腾讯视频-动漫衍生品产品企划经理(北京)','1.基于周边市场趋势，用户需求洞察，充分了解并挖掘IP潜力，制定重点IP的衍生品产品规划，明确产品线布局与商业目标，持续打造有竞争力的商品；','1.基于周边市场趋势，用户需求洞察，充分了解并挖掘IP潜力，制定重点IP的衍生品产品规划，明确产品线布局与商业目标，持续打造有竞争力的商品；
2.统筹商品开发全流程，推动商品企划、设计协同、产品设计、打样、监修、生产及销售，保证产品按期上线；
3.协同供应商，优化供应商、供应链效率，建立长期稳定的合作关系；
4.推进与协同部门制定新品推广、销售策略，推动销售目标达成；
5.监控商品动销与用户反馈，分析商品表现，迭代商品开发策略。','视频订阅与商业化部','商业运营与拓展','北京',NULL,2,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,127,'2026-01-04T06:05:04.000Z','2026-08-27T03:13:29.536Z','2026-08-27T03:13:29.536Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-128','tencent','腾讯视频-大模型推荐算法负责人(北京)','1.负责视频基础推荐算法方向，如基础大模型、模型 scaling up、多模态推荐等方向，通过千亿样本、特征，结合模型 scaling up和多模态技术，持续推…','1.负责视频基础推荐算法方向，如基础大模型、模型 scaling up、多模态推荐等方向，通过千亿样本、特征，结合模型 scaling up和多模态技术，持续推动建模技术升级突破；
2.基础大模型建模和优化，基于千亿样本、特征，构建基座大模型，并研发Embedding迁移框架及模型蒸馏等技术，实现基座大模型能力向推荐系统的有效迁移，驱动广告CTR/CVR等核心指标持续提升；
3.通过特征、样本、模型的scaling up，持续探索模型scaling law 的天花板；
4.将多模态技术融入推荐建模中，通过更丰富信息、更泛化的表达，持续提升模型效果；
5.积极跟进AI学术界和业界的最新动态，优化内部技术方案，不断推进推荐算法设计升级。','视频技术部','基础研究','北京',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,128,'2026-02-09T03:51:14.000Z','2026-08-27T03:13:29.537Z','2026-08-27T03:13:29.537Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-129','tencent','腾讯视频-AI视效导演(北京)','1.为腾讯视频的重点自制项目（如科幻、玄幻、古装、创新剧集等）提供基于AIGC技术的整体视觉风格解决方案，主导从概念到落地的视觉创新；','1.为腾讯视频的重点自制项目（如科幻、玄幻、古装、创新剧集等）提供基于AIGC技术的整体视觉风格解决方案，主导从概念到落地的视觉创新；
2.利用AI工具高效产出高质量的概念设计、场景、角色、分镜及动态预演。设计与优化“AI+传统”的混合型视觉开发流程，提升从创意到预览的整体效率。为具体项目负责，联合内部 AI 工具团队，攻克特定视觉难题；
3.与内部制片人、导演、美术指导、后期团队紧密协作，将AI视觉能力深度整合到标准制作管线中。培训和赋能传统美术、视效团队，提升全员AI技能水平，孵化新的创作方法论。探索AI在视觉营销物料（如海报、预告片）生成中的应用；
4.跟踪全球AIGC在影视领域的应用趋势，进行技术评测与前瞻性研究。参与建立腾讯视频内部的AI内容生成质量评估标准规范与工作流程。','影视内容制作部','内容创作','北京',NULL,0,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,129,'2026-01-04T02:46:45.000Z','2026-08-27T03:13:29.538Z','2026-08-27T03:13:29.538Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-130','tencent','腾讯视频-产品leader(深圳)','1.会员产品战略与规划：负责公司会员产品（如订阅制、等级制、付费权益等）的整体战略制定、中长期路线图规划与商业模式设计；','1.会员产品战略与规划：负责公司会员产品（如订阅制、等级制、付费权益等）的整体战略制定、中长期路线图规划与商业模式设计；
2.深度洞察用户需求与市场趋势：构建分层、动态且具有吸引力的会员权益体系，持续提升会员规模、留存率与生命周期总价值。通过数据驱动与实验优化，持续提升会员产品的开通、续费、升级及唤回全链路转化效率；
3.跨部门协同与落地推动：主导会员产品的全流程落地，高效协同技术、运营、市场、销售、客服等团队，整合资源确保项目高质量交付与迭代。推动会员权益的落地与运营，确保权益内容具有竞争力且用户体验流畅，建立高效的权益供应链与履约保障机制。','视频产品部','产品经理','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,130,'2026-02-25T03:43:48.000Z','2026-08-27T03:13:29.539Z','2026-08-27T03:13:29.539Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-131','tencent','腾讯视频-AI动漫制片人(北京)','1.AI技术与动画创意融合：深度结合动画制作需求，探索并引入前沿的AIGC技术与工具（如Runway、Midjourney、Stable Diffusion、可…','1.AI技术与动画创意融合：深度结合动画制作需求，探索并引入前沿的AIGC技术与工具（如Runway、Midjourney、Stable Diffusion、可灵、即梦等），应用于IP的前期创意开发；
2.动画制作流程重构与优化：主导AI技术在动画制作全流程中的落地应用，设计并推行融合AIGC工具的高效动画制作工作流；
3.全流程项目管理与质量把控：负责AI动画项目的全流程制片管理，包括项目策划、预算制定、进度管控、资源协调与风险控制；
4.团队赋能与行业洞察：持续关注AI技术与动画行业的最新动态，挖掘新的应用场景与商业机会，推动团队技术创新与业务增长。','动画内容制作部','内容创作','北京',NULL,2,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,131,'2026-03-03T03:39:20.000Z','2026-08-27T03:13:29.540Z','2026-08-27T03:13:29.540Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-132','tencent','智能体-运营产品经理-CodeBuddy/WorkBuddy(深圳)','1.负责CodeBuddy/WorkBuddy智能体产品的C端用户增长与运营工作，制定并执行整体增长策略与阶段性目标；','1.负责CodeBuddy/WorkBuddy智能体产品的C端用户增长与运营工作，制定并执行整体增长策略与阶段性目标；
2.统筹各产品在社交媒体、内容平台及办公协作生态等多渠道的拉新与转化路径，系统化提升用户规模与活跃度；
3.策划并执行面向开发者与职场人群的运营活动、热点营销事件及内容传播方案，有效扩大产品声量与品牌影响力；
4.深入分析C端用户行为数据与反馈，输出精准的用户画像与需求洞察报告，反向推动产品功能优化与迭代；
5.协同产研、设计、PR/GR等多部门，构建从内容触达、用户下载到激活、留存的全链路增长漏斗；
6.探索AI产品在新兴流量场域（如AI工具聚合平台、社交传播渠道、开发者社区等）的创新增长模式与玩法；
7.定期监测与评估运营活动效果，通过数据复盘持续优化运营策略与执行效率。','云产品六部','产品运营','深圳',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,132,'2026-03-15T13:25:40.000Z','2026-08-27T03:13:29.541Z','2026-08-27T03:13:29.541Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-133','tencent','腾讯视频-AI短剧创作人(北京)','1.负责腾讯视频AI短剧项目的全流程制作，独立或带领团队完成从创意构思、剧本分镜、AI视觉生成（图生视频/文生视频）、音频制作到最终剪辑合成的全过程；','1.负责腾讯视频AI短剧项目的全流程制作，独立或带领团队完成从创意构思、剧本分镜、AI视觉生成（图生视频/文生视频）、音频制作到最终剪辑合成的全过程；
2.负责把控AI短剧的整体视觉美学风格，包括但不限于角色形象统一性、场景氛围营造、色彩光影调性等，解决AI生成视频中常见的“角色一致性”和“画面闪烁”等技术难题，确保成片具备电影级质感；
3.持续探索国内外最前沿的视频生成模型、多模态AI工具及工作流插件，不断测试和优化制作工艺，搭建可复用的标准化AI短剧生产管线，提升内容生产的效率与品质；
4.探索传统实拍无法实现的“想象力内容”，利用AI技术的特性，创作具有独特视觉奇观和创新叙事方式的短剧作品，抢占AI内容赛道的先机。','影视内容制作部','内容创作','北京',NULL,1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,133,'2026-03-23T06:27:55.000Z','2026-08-27T03:13:29.542Z','2026-08-27T03:13:29.542Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-134','tencent','AI管线数据专家/架构师（深圳/北京）(深圳)','1.面向预训练、后训练数据管线，设计并实现高效的数据处理平台。单管线上，通过算子编排形成数据计算、存储、一体化符合大模型训练的管线平台，平台级别上，通过存储、计…','1.面向预训练、后训练数据管线，设计并实现高效的数据处理平台。单管线上，通过算子编排形成数据计算、存储、一体化符合大模型训练的管线平台，平台级别上，通过存储、计算优化实现平台产能提升；
2.计算方向，提升平台级别计算效率，通过海量数据、任务、资源、合理化系统设计，抽象，对各个可编排算子的合并、拆分，达成易用性和计算性能平衡。对热点的算子，考虑单点优化以及公共服务的方式达到平台级性能提升；
3.存储方向，构建服务于整个预训练和后训练的dataset，优化海量存储管理与访问方案（对象存储分层、冷热分层、缓存策略、数据压缩与列式格式优化、读写并发控制、成本与生命周期管理）；
4.编写技术文档、最佳实践与性能评估报告，推动能力沉淀与工具链升级。','数据计算平台部','数据工程','深圳','深圳/北京',1,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'OPEN',true,134,'2025-07-16T01:27:39.000Z','2026-08-27T03:13:29.543Z','2026-08-27T03:13:29.543Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-135','tencent','资深后台高级工程师(杭州)','1.负责游戏服务器后台的功能设计和开发工作，保障版本平稳上线；','1.负责游戏服务器后台的功能设计和开发工作，保障版本平稳上线；
2.及时响应并解决外网环境中的各类技术问题，保障游戏服务的稳定性与流畅性；
3.对服务器端相关模块的承载、稳定性、安全性、效能和质量负责；
4.建立完善的监控和分析系统，保证业务高质量运行，并及时响应各种突发事件。','生态发展部','后台开发','杭州',NULL,0,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,135,'2026-03-12T02:32:15.000Z','2026-08-27T03:13:29.544Z','2026-08-27T03:13:29.544Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";

INSERT INTO "Job" ("id","campaign","title","summary","description","department","jobType","location","locationNote","headcount","salaryText","publisherName","publisherNote","requirements","status","listed","sortOrder","publishedAt","createdAt","updatedAt")
VALUES ('job-tencent-136','tencent','元宝-大模型后训练算法工程师(北京)','1.面向AI应用场景的大模型微调，优化PostTraining (SFT/RM/RL) 算法的训练效率和实际用户体验效果；','1.面向AI应用场景的大模型微调，优化PostTraining (SFT/RM/RL) 算法的训练效率和实际用户体验效果；
2.研究各领域高质量数据的自动化合成方法，建设高效的线上数据飞轮链路；
3.配合产品和工程，探索LLM在创作、教育、金融、代码等场景下的创新应用。','元宝产品部','应用研究','北京',NULL,3,'面议','腾讯','本岗位为腾讯正式编制，由北斗领航协助对接。请扫码添加企业微信沟通投递，站内暂不收简历。',ARRAY[]::TEXT[],'CLOSED',false,136,'2026-03-20T12:48:26.000Z','2026-08-27T03:13:29.545Z','2026-08-27T03:13:29.545Z')
ON CONFLICT ("id") DO UPDATE SET
"campaign"=EXCLUDED."campaign",
"title"=EXCLUDED."title",
"summary"=EXCLUDED."summary",
"description"=EXCLUDED."description",
"department"=EXCLUDED."department",
"jobType"=EXCLUDED."jobType",
"location"=EXCLUDED."location",
"locationNote"=EXCLUDED."locationNote",
"headcount"=EXCLUDED."headcount",
"salaryText"=EXCLUDED."salaryText",
"publisherName"=EXCLUDED."publisherName",
"publisherNote"=EXCLUDED."publisherNote",
"requirements"=EXCLUDED."requirements",
"status"=EXCLUDED."status",
"listed"=EXCLUDED."listed",
"sortOrder"=EXCLUDED."sortOrder",
"publishedAt"=EXCLUDED."publishedAt",
"updatedAt"=EXCLUDED."updatedAt";
