"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  CircleAlert,
  GraduationCap,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { SkillGuideSheet } from "@/components/skills/SkillGuideSheet";
import { fetchSkillCatalog } from "@/lib/skills-client";

type Props = {
  requiredSkills: string[];
  /** 当前用户已点亮技能名；未登录传空数组 */
  ownedSkills: string[];
};

const skillIcons: Record<string, LucideIcon> = {
  中文表达: Sparkles,
  对话质量判断: BadgeCheck,
  基础标注规范: BadgeCheck,
  语料规范: CircleAlert,
  敏感词意识: CircleAlert,
  表格整理: Sparkles,
  分镜叙事: Sparkles,
  "AI 图像/视频工具": Sparkles,
  品牌理解: Sparkles,
  "Agent / 工具调用理解": CircleAlert,
  逻辑拆解: CircleAlert,
  技术写作: CircleAlert,
  短视频剪辑: Sparkles,
  "AI 视频工具": CircleAlert,
  产品表达: CircleAlert,
  安全意识: BadgeCheck,
  中文造句: BadgeCheck,
  规则执行: BadgeCheck,
};

function SkillTagFace({
  skill,
  hasSkill,
}: {
  skill: string;
  hasSkill: boolean;
}) {
  const Icon = skillIcons[skill] ?? (hasSkill ? BadgeCheck : CircleAlert);

  return (
    <span
      className={[
        "inline-flex max-w-full items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-sm font-semibold shadow-sm",
        hasSkill
          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
          : "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent-hover)]",
      ].join(" ")}
    >
      <Icon className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
      <span className="truncate">{skill}</span>
      <span
        className={[
          "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold tracking-wide",
          hasSkill
            ? "bg-white/20 text-white"
            : "bg-[var(--color-accent)] text-white",
        ].join(" ")}
      >
        {hasSkill ? "已掌握" : "待学习"}
      </span>
    </span>
  );
}

export function SkillTag({
  skill,
  hasSkill,
  onOpenGuide,
}: {
  skill: string;
  hasSkill: boolean;
  onOpenGuide?: (skill: string) => void;
}) {
  if (hasSkill) {
    return <SkillTagFace skill={skill} hasSkill />;
  }

  return (
    <button
      type="button"
      onClick={() => onOpenGuide?.(skill)}
      className="inline-flex transition hover:opacity-90"
      title={`查看如何点亮：${skill}`}
    >
      <SkillTagFace skill={skill} hasSkill={false} />
    </button>
  );
}

export function SkillTagRow({
  skills,
  ownedSkills,
}: {
  skills: string[];
  ownedSkills: string[];
}) {
  const owned = new Set(ownedSkills);
  const [guideSkill, setGuideSkill] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-2.5">
        {skills.map((skill) => (
          <SkillTag
            key={skill}
            skill={skill}
            hasSkill={owned.has(skill)}
            onOpenGuide={setGuideSkill}
          />
        ))}
      </div>
      <SkillGuideSheet
        open={Boolean(guideSkill)}
        skillName={guideSkill}
        lit={guideSkill ? owned.has(guideSkill) : false}
        onClose={() => setGuideSkill(null)}
      />
    </>
  );
}

export function SkillMatchPanel({ requiredSkills, ownedSkills }: Props) {
  const owned = new Set(ownedSkills);
  const matched = requiredSkills.filter((skill) => owned.has(skill));
  const missing = requiredSkills.filter((skill) => !owned.has(skill));
  const ready = missing.length === 0 && requiredSkills.length > 0;
  const [guideSkill, setGuideSkill] = useState<string | null>(null);

  useEffect(() => {
    void fetchSkillCatalog().catch(() => undefined);
  }, []);

  return (
    <section className="rounded-xl border border-[var(--color-border)]/70 bg-white/55 px-4 py-4 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text)]">
          <Sparkles
            className="size-4 text-[var(--color-accent)]"
            aria-hidden
          />
          技能匹配
        </h3>
        <span
          className={[
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
            ready
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-accent)] text-white",
          ].join(" ")}
        >
          {ready ? (
            <>
              <BadgeCheck className="size-3.5" aria-hidden />
              可报名
            </>
          ) : (
            <>
              <CircleAlert className="size-3.5" aria-hidden />
              缺 {missing.length} 项
            </>
          )}
        </span>
      </div>

      <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
        {ready
          ? "所需技能均已点亮，可以直接报名领取。"
          : "点击橙色「待学习」查看如何点亮，补齐后再报名。"}
      </p>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {requiredSkills.map((skill) => (
          <SkillTag
            key={skill}
            skill={skill}
            hasSkill={owned.has(skill)}
            onOpenGuide={setGuideSkill}
          />
        ))}
      </div>

      {!ready && missing.length > 0 ? (
        <button
          type="button"
          onClick={() => setGuideSkill(missing[0])}
          className="mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-[var(--color-accent)] text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
        >
          <GraduationCap className="size-4" aria-hidden />
          查看如何点亮
        </button>
      ) : null}

      <p className="mt-3 text-[11px] text-[var(--color-text-secondary)]">
        已点亮 {matched.length}/{requiredSkills.length} 个技能
      </p>

      <SkillGuideSheet
        open={Boolean(guideSkill)}
        skillName={guideSkill}
        lit={guideSkill ? owned.has(guideSkill) : false}
        onClose={() => setGuideSkill(null)}
      />
    </section>
  );
}

export function canEnrollWithSkills(
  requiredSkills: string[],
  ownedSkills: string[],
) {
  const owned = new Set(ownedSkills);
  return (
    requiredSkills.length > 0 &&
    requiredSkills.every((skill) => owned.has(skill))
  );
}

export function EnrollButton({
  ready,
  applied,
  loading,
  loggedIn,
  onEnroll,
  onLogin,
  className = "",
}: {
  ready: boolean;
  applied?: boolean;
  loading?: boolean;
  loggedIn?: boolean;
  onEnroll?: () => void;
  onLogin?: () => void;
  className?: string;
}) {
  if (applied) {
    return (
      <button
        type="button"
        disabled
        className={[
          "inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-primary-soft)] px-6 text-sm font-semibold text-[var(--color-primary)]",
          className,
        ].join(" ")}
      >
        已报名
      </button>
    );
  }

  if (!loggedIn) {
    return (
      <button
        type="button"
        onClick={onLogin}
        className={[
          "inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-primary)] px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(47,49,139,0.28)] transition hover:bg-[var(--color-primary-hover)]",
          className,
        ].join(" ")}
      >
        登录后报名
      </button>
    );
  }

  if (!ready) {
    return (
      <button
        type="button"
        disabled
        className={[
          "inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-border)] px-6 text-sm font-semibold text-[var(--color-text-secondary)]",
          className,
        ].join(" ")}
      >
        技能未齐，暂不可报名
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={onEnroll}
      className={[
        "inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-primary)] px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(47,49,139,0.28)] transition hover:bg-[var(--color-primary-hover)] disabled:opacity-60",
        className,
      ].join(" ")}
    >
      {loading ? "报名中…" : "立即报名"}
    </button>
  );
}
