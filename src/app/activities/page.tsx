import Link from "next/link";
import { StaticPageShell } from "@/components/StaticPageShell";
import { listActivities } from "@/server/activity/service";

export const dynamic = "force-dynamic";

export default async function ActivitiesPage() {
  const activities = await listActivities();

  return (
    <StaticPageShell>
      {activities.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--color-text-secondary)]">
          暂无进行中的活动，稍后再来看看。
        </p>
      ) : (
        <ul className="space-y-4">
          {activities.map((act) => (
            <li key={act.id}>
              <Link
                href={`/activities/${act.id}`}
                className="block rounded-lg border border-[var(--color-border)]/70 bg-white/45 px-5 py-5 backdrop-blur-sm transition hover:border-[var(--color-primary)]/40 hover:bg-white/65"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-medium text-[var(--color-accent)]">
                    {act.statusLabel}
                  </p>
                  <span className="rounded-md bg-[var(--color-primary-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-primary)]">
                    {act.category}
                  </span>
                </div>
                <h2 className="mt-2 text-lg font-semibold text-[var(--color-primary)]">
                  {act.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                  {act.summary}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {act.benefit}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {act.quota} · 已有 {act.joinedCount} 人报名
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-sm">
        <Link href="/" className="text-[var(--color-primary)] hover:underline">
          返回首页
        </Link>
      </p>
    </StaticPageShell>
  );
}
