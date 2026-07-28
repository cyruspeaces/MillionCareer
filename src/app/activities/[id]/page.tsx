"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  CalendarRange,
  CheckCircle2,
  Users,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  fetchActivityById,
  fetchActivityRegistered,
  registerActivity,
} from "@/lib/activities-client";
import type { ActivityView } from "@/types/activity";

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--color-border)]/70 bg-white/50 px-4 py-4 sm:px-5">
      <h2 className="text-sm font-semibold text-[var(--color-text)]">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
        {children}
      </div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p>暂无</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ActivityDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { user, openLogin } = useAuth();

  const [activity, setActivity] = useState<ActivityView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchActivityById(id)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setError("活动不存在或已下架");
          setActivity(null);
          return;
        }
        setActivity(data);
      })
      .catch(() => {
        if (!cancelled) setError("加载失败，请稍后重试");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!id || !user || !activity) {
      setRegistered(false);
      return;
    }
    let cancelled = false;
    fetchActivityRegistered(id)
      .then((v) => {
        if (!cancelled) setRegistered(v);
      })
      .catch(() => {
        if (!cancelled) setRegistered(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, user, activity]);

  const onRegister = async () => {
    if (!id || registering) return;
    setRegistering(true);
    setRegisterError(null);
    try {
      await registerActivity(id);
      setRegistered(true);
      setActivity((prev) =>
        prev
          ? {
              ...prev,
              joinedCount: prev.joinedCount + 1,
              canRegister: false,
            }
          : prev,
      );
    } catch (e) {
      const err = e as Error & { code?: string };
      setRegisterError(err.message || "报名失败");
      if (err.code === "ALREADY_REGISTERED") setRegistered(true);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href="/activities"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          返回活动列表
        </Link>

        {loading ? (
          <p className="mt-8 text-sm text-[var(--color-text-secondary)]">
            加载中…
          </p>
        ) : null}

        {error ? (
          <p className="mt-8 text-sm text-[var(--color-accent-hover)]">{error}</p>
        ) : null}

        {activity ? (
          <>
            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-[var(--color-accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-accent-hover)]">
                  {activity.statusLabel}
                </span>
                <span className="rounded-md bg-[var(--color-primary-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
                  {activity.category}
                </span>
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-[var(--color-primary)] sm:text-3xl">
                {activity.title}
              </h1>
              <p className="mt-2 text-base font-semibold text-[var(--color-accent)]">
                {activity.benefit}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)]">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarRange className="size-3.5" aria-hidden />
                  {activity.startsAtLabel} — {activity.endsAtLabel}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-3.5" aria-hidden />
                  已有 {activity.joinedCount} 人报名 · {activity.quota}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-4 pb-28">
              <Section title="活动说明">
                <p>{activity.description}</p>
              </Section>

              <Section title="权益">
                <BulletList items={activity.benefitItems} />
              </Section>

              {activity.rules ? (
                <Section title="规则">
                  <p className="whitespace-pre-wrap">{activity.rules}</p>
                </Section>
              ) : null}

              <Section title="时间线">
                <ol className="space-y-2">
                  {activity.timeline.map((step, i) => (
                    <li key={step} className="flex items-start gap-2">
                      <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[10px] font-semibold text-[var(--color-primary)]">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </Section>

              <Section title="如何参与">
                <BulletList items={activity.howToJoin} />
              </Section>

              <Section title="参与要求">
                <BulletList items={activity.requirements} />
              </Section>

              {activity.judgingNote ? (
                <Section title="评审说明">
                  <p>{activity.judgingNote}</p>
                </Section>
              ) : null}
            </div>

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)]/70 bg-[var(--color-bg)]/95 px-4 py-3 backdrop-blur-md">
              <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                    {activity.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                    {registered
                      ? "已报名"
                      : activity.canRegister
                        ? activity.quota
                        : "当前不可报名"}
                  </p>
                  {registerError ? (
                    <p className="mt-1 text-xs text-red-600">{registerError}</p>
                  ) : null}
                </div>

                {registered ? (
                  <button
                    type="button"
                    disabled
                    className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md bg-[var(--color-primary-soft)] px-6 text-sm font-semibold text-[var(--color-primary)]"
                  >
                    <CheckCircle2 className="size-4" aria-hidden />
                    已报名
                  </button>
                ) : !user ? (
                  <button
                    type="button"
                    onClick={() =>
                      openLogin({ next: `/activities/${activity.id}` })
                    }
                    className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-primary)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)]"
                  >
                    登录后报名
                  </button>
                ) : activity.canRegister ? (
                  <button
                    type="button"
                    disabled={registering}
                    onClick={() => void onRegister()}
                    className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-primary)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
                  >
                    {registering ? "报名中…" : "立即报名"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-border)] px-6 text-sm font-semibold text-[var(--color-text-secondary)]"
                  >
                    暂不可报名
                  </button>
                )}
              </div>
            </div>
          </>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
