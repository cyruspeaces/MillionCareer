"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  CircleDollarSign,
  ClipboardList,
  LayoutDashboard,
  ListTodo,
  Lock,
  LogIn,
  LogOut,
  MapPin,
  Network,
  Pencil,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { NicknameModal } from "@/components/auth/NicknameModal";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  avatarInitials,
  logout,
  maskPhone,
} from "@/lib/auth-client";
import {
  assessmentArchetypes,
  type AssessmentResult,
} from "@/data/assessment";
import {
  fetchLatestAssessment,
  fetchMySkills,
  type UserSkillDto,
} from "@/lib/assessment-client";
import {
  fetchMyApplications,
  type MyApplicationDto,
} from "@/lib/tasks-client";
import {
  fetchMySettlements,
  formatMoney,
  type MySettlementsResult,
} from "@/lib/settlements-client";
import { SkillGuideSheet } from "@/components/skills/SkillGuideSheet";
import {
  catalogItemToGuide,
  deriveSkillActionHint,
  deriveSkillSource,
} from "@/lib/skill-guide";
import { fetchSkillCatalog } from "@/lib/skills-client";
import {
  SKILL_GROUP_ORDER,
  type SkillCatalogItem,
  type SkillTreeNode,
} from "@/types/skill";

const DEFAULT_TITLE = "AI 任务创作者";
const DEFAULT_LOCATION = "远程 · 中国";
const AVATAR_COLORS = [
  "#F08519",
  "#2F318B",
  "#5B6ABF",
  "#C96A10",
  "#3A3C9A",
  "#E8A04A",
];

function avatarColorFromId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h + id.charCodeAt(i) * (i + 1)) % AVATAR_COLORS.length;
  }
  return AVATAR_COLORS[h] ?? AVATAR_COLORS[0];
}

type SectionId = "overview" | "tasks" | "skills" | "earnings";

const sectionIds: SectionId[] = ["overview", "tasks", "skills", "earnings"];

function parseSection(value: string | null): SectionId {
  if (value && sectionIds.includes(value as SectionId)) {
    return value as SectionId;
  }
  return "overview";
}

const navItems: {
  id: SectionId;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "overview", label: "概览", icon: LayoutDashboard },
  { id: "tasks", label: "我的任务", icon: ClipboardList },
  { id: "skills", label: "技能树", icon: Network },
  { id: "earnings", label: "结算", icon: CircleDollarSign },
];

function formatAppliedAt(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${m}-${day} ${hh}:${mm}`;
}

/** 勋章格卡片：点击打开点亮引导弹层，不跳转学习页 */
function SkillTreeNodeCard({
  node,
  onOpen,
}: {
  node: SkillTreeNode;
  onOpen: (node: SkillTreeNode) => void;
}) {
  if (node.lit) {
    return (
      <li>
        <button
          type="button"
          onClick={() => onOpen(node)}
          className="flex h-full w-full flex-col items-center rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary-soft)] px-3 py-4 text-center transition hover:border-[var(--color-primary)]/40"
        >
          <span
            className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-sm"
            aria-hidden
          >
            <BadgeCheck className="size-5" />
          </span>
          <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-[var(--color-primary)]">
            {node.name}
          </p>
          <span className="mt-2 rounded-md bg-white/70 px-2 py-0.5 text-[10px] font-medium text-[var(--color-primary)]">
            已点亮
          </span>
          <span className="mt-2 text-[10px] text-[var(--color-text-secondary)]">
            T{node.tier}
          </span>
        </button>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(node)}
        className="flex h-full w-full flex-col items-center rounded-xl border border-dashed border-[var(--color-border)] bg-white/50 px-3 py-4 text-center transition hover:border-[var(--color-accent)]"
      >
        <span
          className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]"
          aria-hidden
        >
          <Lock className="size-5" />
        </span>
        <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-[var(--color-text-secondary)]">
          {node.name}
        </p>
        <span className="mt-2 rounded-md bg-[var(--color-accent-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-accent-hover)]">
          待点亮
        </span>
        <span className="mt-2 text-[11px] font-medium text-[var(--color-accent)]">
          查看如何点亮
        </span>
      </button>
    </li>
  );
}

function AssessmentEntryCard({
  result,
  compact,
}: {
  result: AssessmentResult | null;
  compact?: boolean;
}) {
  if (result) {
    const archetype = assessmentArchetypes[result.archetypeId];
    return (
      <Link
        href="/assessment"
        className={[
          "flex items-center gap-4 rounded-2xl border border-[var(--color-primary)]/25 bg-[var(--color-primary-soft)] transition hover:border-[var(--color-primary)]/60",
          compact ? "px-5 py-4" : "p-5",
        ].join(" ")}
      >
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
          <Brain className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--color-primary)]">
            {archetype.code} · {archetype.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-[var(--color-text-secondary)]">
            {archetype.tagline} · 测于 {result.completedAt}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-[var(--color-primary)]">
          查看报告
          <ArrowRight className="size-3.5" aria-hidden />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/assessment"
      className={[
        "flex items-center gap-4 rounded-2xl border border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)] transition hover:border-[var(--color-accent)]",
        compact ? "px-5 py-4" : "p-5",
      ].join(" ")}
    >
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-white">
        <Brain className="size-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--color-accent-hover)]">
          免费 AI 能力测评 · 约 8 分钟
        </p>
        <p className="mt-0.5 truncate text-xs text-[var(--color-text-secondary)]">
          16 道情景题生成能力报告，测完直接点亮技能树起步节点
        </p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[var(--color-accent-hover)]">
        去测评
        <ArrowRight className="size-3.5" aria-hidden />
      </span>
    </Link>
  );
}

const skillSourceLabel: Record<string, string> = {
  ASSESSMENT: "测评通过",
  COURSE: "课程考核",
  TASK: "任务履约",
  ACTIVITY: "活动",
  MILESTONE: "赚钱里程碑",
  ADMIN: "系统发放",
};

function MePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser, openLogin, refreshUser } = useAuth();
  const [section, setSection] = useState<SectionId>(() =>
    parseSection(searchParams.get("section")),
  );
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [userSkills, setUserSkills] = useState<UserSkillDto[]>([]);
  const [skillCatalog, setSkillCatalog] = useState<SkillCatalogItem[]>([]);
  const [myApplications, setMyApplications] = useState<MyApplicationDto[]>([]);
  const [settlements, setSettlements] = useState<MySettlementsResult>({
    summary: {
      earnedTotal: 0,
      earnedMonth: 0,
      pendingTotal: 0,
      paidCount: 0,
    },
    items: [],
  });
  const [guideNode, setGuideNode] = useState<SkillTreeNode | null>(null);
  const [nicknameOpen, setNicknameOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchSkillCatalog()
      .then((skills) => {
        if (!cancelled) setSkillCatalog(skills);
      })
      .catch(() => {
        if (!cancelled) setSkillCatalog([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setAssessment(null);
      setUserSkills([]);
      setMyApplications([]);
      setSettlements({
        summary: {
          earnedTotal: 0,
          earnedMonth: 0,
          pendingTotal: 0,
          paidCount: 0,
        },
        items: [],
      });
      return;
    }
    let cancelled = false;
    Promise.all([
      fetchLatestAssessment(),
      fetchMySkills(),
      fetchMyApplications(),
      fetchMySettlements(),
    ])
      .then(([latest, skills, apps, settle]) => {
        if (cancelled) return;
        setAssessment(latest);
        setUserSkills(skills);
        setMyApplications(apps);
        setSettlements(settle);
      })
      .catch(() => {
        if (!cancelled) {
          setAssessment(null);
          setUserSkills([]);
          setMyApplications([]);
          setSettlements({
            summary: {
              earnedTotal: 0,
              earnedMonth: 0,
              pendingTotal: 0,
              paidCount: 0,
            },
            items: [],
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    setSection(parseSection(searchParams.get("section")));
  }, [searchParams]);

  // 目录来自 Skill 表；点亮态来自 UserSkill
  const skillTree = useMemo((): SkillTreeNode[] => {
    const byName = new Map(userSkills.map((s) => [s.name, s]));
    return skillCatalog.map((item) => {
      const hit = byName.get(item.name);
      if (!hit) {
        return {
          ...item,
          lit: false,
          sourceLabel: deriveSkillSource(item.kind, item.tier),
          actionHint: deriveSkillActionHint(item.kind, item.tier),
        };
      }
      return {
        ...item,
        lit: true,
        sourceLabel: skillSourceLabel[hit.source] ?? hit.source,
        unlockedAt: hit.unlockedAt,
      };
    });
  }, [skillCatalog, userSkills]);

  const litSkillTotal = useMemo(
    () => skillTree.filter((n) => n.lit).length,
    [skillTree],
  );

  const skillTreeByGroup = useMemo(() => {
    const groups = [
      ...SKILL_GROUP_ORDER,
      ...skillCatalog
        .map((s) => s.group)
        .filter((g) => !(SKILL_GROUP_ORDER as readonly string[]).includes(g)),
    ];
    const unique = Array.from(new Set(groups));
    return unique.map((group) => ({
      group,
      nodes: skillTree.filter((n) => n.group === group),
    }));
  }, [skillCatalog, skillTree]);

  const displayName =
    user?.nickname || maskPhone(user?.phone) || "创作者";
  const initials = avatarInitials(user?.nickname, user?.phone);
  const avatarColor = user ? avatarColorFromId(user.id) : AVATAR_COLORS[0];
  const joinedLabel = user?.createdAt
    ? user.createdAt.slice(0, 7)
    : "—";

  const onLogout = async () => {
    await logout();
    setUser(null);
    await refreshUser();
    router.push("/");
    router.refresh();
  };

  if (user === undefined) {
    return (
      <div className="flex min-h-full flex-1 flex-col">
        <SiteHeader />
        <div className="page-wrap flex-1 py-16 text-center text-sm text-[var(--color-text-secondary)]">
          加载中…
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-full flex-1 flex-col">
        <SiteHeader />
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center">
          <p className="text-lg font-semibold text-[var(--color-primary)]">
            登录后查看个人中心
          </p>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            手机号验证码一键登录，未注册将自动完成注册
          </p>
          <button
            type="button"
            onClick={() => openLogin({ next: "/me" })}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 text-sm font-semibold text-white"
          >
            <LogIn className="size-4" aria-hidden />
            去登录
          </button>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />

      <div className="page-wrap flex-1 py-8 sm:py-10">
        {/* 移动端横向导航 */}
        <div className="mb-5 md:hidden">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="inline-flex size-8 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: avatarColor }}
            >
              {initials}
            </span>
            <p className="truncate text-sm font-semibold text-[var(--color-primary)]">
              {displayName}
            </p>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  className={[
                    "inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium",
                    active
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-white/55 text-[var(--color-primary)]",
                  ].join(" ")}
                >
                  <Icon className="size-3.5" aria-hidden />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[15rem_minmax(0,1fr)] lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
          {/* 左侧导航 */}
          <aside className="hidden md:block">
            <div className="sticky top-24 rounded-2xl border border-[var(--color-border)]/70 bg-white/45 p-4 backdrop-blur-sm">
              <Link href="/me" className="flex items-center gap-3 px-1 py-1">
                <span
                  className="inline-flex size-11 items-center justify-center rounded-full text-base font-bold text-white"
                  style={{ backgroundColor: avatarColor }}
                >
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--color-primary)]">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-[var(--color-text-secondary)]">
                    {maskPhone(user.phone) || DEFAULT_TITLE}
                  </p>
                </div>
              </Link>

              <nav className="mt-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = section === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSection(item.id)}
                      className={[
                        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition",
                        active
                          ? "bg-[var(--color-primary)] text-white shadow-sm"
                          : "text-[var(--color-text-secondary)] hover:bg-white/70 hover:text-[var(--color-primary)]",
                      ].join(" ")}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-4 space-y-2 border-t border-[var(--color-border)]/60 pt-4">
                <Link
                  href="/tasks"
                  className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md border border-[var(--color-primary)] bg-transparent text-sm font-medium text-[var(--color-primary)] transition hover:bg-[var(--color-primary-soft)]"
                >
                  <ListTodo className="size-4" aria-hidden />
                  去领任务
                </Link>
                <button
                  type="button"
                  onClick={() => void onLogout()}
                  className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md border border-[var(--color-border)] bg-transparent text-sm font-medium text-[var(--color-text-secondary)] transition hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]"
                >
                  <LogOut className="size-4" aria-hidden />
                  登出
                </button>
              </div>
            </div>
          </aside>

          {/* 右侧内容 */}
          <main className="min-w-0">
            {section === "overview" ? (
              <div className="space-y-5">
                <AssessmentEntryCard result={assessment} />
                <section className="rounded-2xl border border-[var(--color-border)]/70 bg-white/50 p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <span
                      className="inline-flex size-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-[var(--color-primary)]">
                          {displayName}
                        </h2>
                        <button
                          type="button"
                          onClick={() => setNicknameOpen(true)}
                          className="inline-flex size-8 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
                          aria-label="修改用户名"
                          title="修改用户名"
                        >
                          <Pencil className="size-4" aria-hidden />
                        </button>
                        <span className="rounded-full bg-[var(--color-primary-soft)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-primary)]">
                          {DEFAULT_TITLE}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {maskPhone(user.phone)}
                      </p>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
                        {user.bio ||
                          "欢迎来到百万职场。完成测评、领取任务，用技能与交付说话。"}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--color-text-secondary)]">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3.5" aria-hidden />
                          {DEFAULT_LOCATION}
                        </span>
                        <span>加入于 {joinedLabel}</span>
                      </div>
                    </div>
                  </div>

                  <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                      {
                        label: "累计结算",
                        value: formatMoney(settlements.summary.earnedTotal),
                      },
                      {
                        label: "本月结算",
                        value: formatMoney(settlements.summary.earnedMonth),
                      },
                      {
                        label: "完成任务",
                        value: String(settlements.summary.paidCount),
                      },
                      {
                        label: "已点亮技能",
                        value: String(litSkillTotal),
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl border border-[var(--color-border)]/60 bg-white/60 px-4 py-3"
                      >
                        <dt className="text-xs text-[var(--color-text-secondary)]">
                          {item.label}
                        </dt>
                        <dd className="mt-1 text-lg font-bold text-[var(--color-primary)]">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>

                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setSection("tasks")}
                    className="rounded-2xl border border-[var(--color-border)]/70 bg-white/50 p-5 text-left transition hover:border-[var(--color-primary)]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2">
                        <ClipboardList
                          className="size-5 text-[var(--color-primary)]"
                          aria-hidden
                        />
                        <span className="font-semibold text-[var(--color-text)]">
                          我的任务
                        </span>
                      </span>
                      <span className="text-xs text-[var(--color-text-secondary)]">
                        已报名 {myApplications.length} 个
                      </span>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {myApplications.length === 0 ? (
                        <li className="rounded-lg border border-dashed border-[var(--color-border)]/60 bg-white/40 px-3 py-3 text-xs text-[var(--color-text-secondary)]">
                          还没有报名任务，去任务广场看看
                        </li>
                      ) : (
                        myApplications.slice(0, 3).map((app) => (
                          <li
                            key={app.id}
                            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)]/50 bg-white/55 px-3 py-2"
                          >
                            <span className="size-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                            <span className="min-w-0 flex-1 truncate text-xs text-[var(--color-text-secondary)]">
                              {app.task.title}
                            </span>
                            <span className="shrink-0 text-[10px] font-medium text-[var(--color-primary)]">
                              已报名
                            </span>
                          </li>
                        ))
                      )}
                    </ul>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSection("skills")}
                    className="rounded-2xl border border-[var(--color-border)]/70 bg-white/50 p-5 text-left transition hover:border-[var(--color-primary)]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2">
                        <Network
                          className="size-5 text-[var(--color-primary)]"
                          aria-hidden
                        />
                        <span className="font-semibold text-[var(--color-text)]">
                          技能树
                        </span>
                      </span>
                      <span className="text-xs text-[var(--color-text-secondary)]">
                        已点亮 {litSkillTotal} 个
                      </span>
                    </div>
                    <ul className="mt-4 grid grid-cols-3 gap-2">
                      {skillTree
                        .filter((n) => n.lit)
                        .slice(0, 6)
                        .map((node) => (
                          <li
                            key={node.code}
                            className="flex flex-col items-center gap-1.5 rounded-lg border border-[var(--color-primary)]/15 bg-[var(--color-primary-soft)] px-2 py-2.5"
                            title={node.name}
                          >
                            <span className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                              <BadgeCheck className="size-4" aria-hidden />
                            </span>
                            <span className="w-full truncate text-center text-[10px] font-medium text-[var(--color-primary)]">
                              {node.name}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </button>
                </div>
              </div>
            ) : null}

            {section === "tasks" ? (
              <section className="rounded-2xl border border-[var(--color-border)]/70 bg-white/50 p-5 sm:p-6">
                <h2 className="text-base font-semibold text-[var(--color-text)]">
                  已报名 {myApplications.length} 个
                </h2>

                <ul className="mt-5 space-y-3">
                  {myApplications.map((app) => (
                    <li
                      key={app.id}
                      className="rounded-xl border border-[var(--color-border)]/70 bg-white/60 px-4 py-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-[var(--color-accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-accent-hover)]">
                              {app.task.category}
                            </span>
                            <span className="rounded-md bg-[var(--color-primary-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
                              已报名
                            </span>
                            <span className="rounded-md bg-[var(--color-bg-muted)] px-2 py-0.5 text-xs font-medium text-[var(--color-text-secondary)]">
                              {app.task.status}
                            </span>
                          </div>
                          <h3 className="mt-2 text-base font-semibold text-[var(--color-text)]">
                            {app.task.title}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[var(--color-accent)]">
                            {app.task.reward}
                          </p>
                          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                            报名于 {formatAppliedAt(app.createdAt)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {myApplications.length === 0 ? (
                  <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
                    还没有报名任务。
                    <Link
                      href="/tasks"
                      className="ml-1 text-[var(--color-primary)] hover:underline"
                    >
                      去任务广场看看
                    </Link>
                  </p>
                ) : null}
              </section>
            ) : null}

            {section === "skills" ? (
              <section className="space-y-6">
                <AssessmentEntryCard result={assessment} compact />
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)]/70 bg-white/50 px-5 py-4">
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    已点亮{" "}
                    <span className="font-semibold text-[var(--color-primary)]">
                      {litSkillTotal}
                    </span>{" "}
                    / {skillTree.length}{" "}
                    个技能。点亮后以勋章样式展示，可解锁对应任务。
                  </p>
                  <Link
                    href="/assessment"
                    className="shrink-0 text-sm font-medium text-[var(--color-accent)] hover:underline"
                  >
                    去测评
                  </Link>
                </div>

                {skillTreeByGroup.map(({ group, nodes }) => {
                  if (nodes.length === 0) return null;
                  const litInGroup = nodes.filter((n) => n.lit).length;
                  const progress =
                    nodes.length > 0 ? (litInGroup / nodes.length) * 100 : 0;
                  return (
                    <div key={group}>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[var(--color-primary)]">
                          {group}
                        </h3>
                        <span className="text-xs text-[var(--color-text-secondary)]">
                          {litInGroup}/{nodes.length} 已点亮
                        </span>
                      </div>
                      <div
                        className="mb-3 h-1 overflow-hidden rounded-full bg-[var(--color-border)]/60"
                        aria-hidden
                      >
                        <div
                          className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {nodes.map((node) => (
                          <SkillTreeNodeCard
                            key={node.code}
                            node={node}
                            onOpen={setGuideNode}
                          />
                        ))}
                      </ul>
                    </div>
                  );
                })}

                <SkillGuideSheet
                  open={Boolean(guideNode)}
                  skillName={guideNode?.name ?? null}
                  info={
                    guideNode
                      ? {
                          ...catalogItemToGuide(guideNode),
                          source: guideNode.sourceLabel,
                          actionHint: guideNode.actionHint,
                        }
                      : null
                  }
                  lit={guideNode?.lit ?? false}
                  unlockedAt={guideNode?.unlockedAt}
                  onClose={() => setGuideNode(null)}
                />
              </section>
            ) : null}

            {section === "earnings" ? (
              <section className="space-y-4">
                <ul className="grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      label: "本月结算",
                      value: formatMoney(settlements.summary.earnedMonth),
                    },
                    {
                      label: "累计结算",
                      value: formatMoney(settlements.summary.earnedTotal),
                    },
                    {
                      label: "待结算",
                      value: formatMoney(settlements.summary.pendingTotal),
                    },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="rounded-xl border border-[var(--color-border)]/60 bg-white/60 px-4 py-4"
                    >
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {item.label}
                      </p>
                      <p className="mt-2 text-2xl font-bold text-[var(--color-primary)]">
                        {item.value}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="rounded-2xl border border-[var(--color-border)]/70 bg-white/50 p-5 sm:p-6">
                  <h2 className="text-base font-semibold text-[var(--color-text)]">
                    结算流水
                  </h2>

                  <ul className="mt-5 space-y-3">
                    {settlements.items.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-xl border border-[var(--color-border)]/70 bg-white/60 px-4 py-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={
                                  item.status === "PAID"
                                    ? "rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                                    : item.status === "PENDING"
                                      ? "rounded-md bg-[var(--color-accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-accent-hover)]"
                                      : "rounded-md bg-[var(--color-bg-muted)] px-2 py-0.5 text-xs font-medium text-[var(--color-text-secondary)]"
                                }
                              >
                                {item.statusLabel}
                              </span>
                            </div>
                            <h3 className="mt-2 text-base font-semibold text-[var(--color-text)]">
                              {item.taskTitle || "平台结算"}
                            </h3>
                            {item.note ? (
                              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                                {item.note}
                              </p>
                            ) : null}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-[var(--color-accent)]">
                              {item.amount == null
                                ? "金额待定"
                                : formatMoney(item.amount)}
                            </p>
                            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                              {item.updatedAt.slice(0, 10)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {settlements.items.length === 0 ? (
                    <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
                      暂无结算记录。
                    </p>
                  ) : null}
                </div>
              </section>
            ) : null}
          </main>
        </div>
      </div>

      <NicknameModal
        open={nicknameOpen}
        currentNickname={user.nickname || ""}
        onClose={() => setNicknameOpen(false)}
        onSaved={(next) => {
          setUser(next);
          void refreshUser();
        }}
      />
      <SiteFooter />
    </div>
  );
}

export default function MePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full flex-1 flex-col">
          <SiteHeader />
          <div className="page-wrap flex-1 py-8" />
          <SiteFooter />
        </div>
      }
    >
      <MePageContent />
    </Suspense>
  );
}
