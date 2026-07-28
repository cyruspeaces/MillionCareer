import Link from "next/link";
import { StaticPageShell } from "@/components/StaticPageShell";

/** 旧「技能学习」入口保留路由，导向测评 / 技能树，避免再进空占位 */
export default function SkillsPage() {
  return (
    <StaticPageShell
      title="技能"
      description="技能进度在「我的 · 技能树」查看；多数起步技能可通过测评点亮。"
    >
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/assessment"
          className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-primary)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)]"
        >
          去测评
        </Link>
        <Link
          href="/me?section=skills"
          className="inline-flex h-11 items-center justify-center rounded-md border border-[var(--color-border)] bg-white/70 px-5 text-sm font-medium text-[var(--color-primary)] transition hover:bg-white"
        >
          我的 · 技能树
        </Link>
      </div>
    </StaticPageShell>
  );
}
