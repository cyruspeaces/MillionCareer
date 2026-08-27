"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Briefcase,
  MapPin,
  UserRound,
  X,
} from "lucide-react";
import type { JobView } from "@/types/job";

type Props = {
  job: JobView | null;
  onClose: () => void;
};

export function JobDetailDrawer({ job, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [displayJob, setDisplayJob] = useState<JobView | null>(null);

  useEffect(() => {
    if (job) {
      setDisplayJob(job);
      setMounted(true);
      setVisible(false);
      let frame2 = 0;
      const frame1 = window.requestAnimationFrame(() => {
        frame2 = window.requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        window.cancelAnimationFrame(frame1);
        window.cancelAnimationFrame(frame2);
      };
    }

    setVisible(false);
    const timer = window.setTimeout(() => {
      setMounted(false);
      setDisplayJob(null);
    }, 420);
    return () => window.clearTimeout(timer);
  }, [job]);

  useEffect(() => {
    if (!mounted) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mounted, onClose]);

  if (!mounted || !displayJob) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="关闭岗位详情"
        className={[
          "absolute inset-0 bg-[rgba(26,26,32,0.45)] transition-opacity duration-[400ms]",
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      <div
        className={[
          "absolute inset-x-0 bottom-0 top-[4.75rem] flex flex-col sm:top-[5.5rem]",
          "will-change-transform transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          visible ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
      >
        <div className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-t-2xl border-t border-[var(--color-border)]/70 bg-[var(--color-bg)] shadow-[0_-12px_40px_rgba(47,49,139,0.12)]">
          <div className="flex w-full items-center justify-between border-b border-[var(--color-border)]/70 px-4 py-3 sm:px-8 lg:px-10">
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              岗位详情
            </p>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-8 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
              aria-label="关闭"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="min-w-0 flex-1 overflow-y-auto">
            <div className="grid gap-6 px-4 py-5 sm:px-8 sm:py-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8 lg:px-10 xl:grid-cols-[minmax(0,1fr)_26rem]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[var(--color-accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-accent-hover)]">
                    {displayJob.campaignLabel}
                  </span>
                  <span className="rounded-md bg-[var(--color-primary-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
                    {displayJob.jobType}
                  </span>
                  <span className="rounded-md bg-white/60 px-2 py-0.5 text-xs font-medium text-[var(--color-text-secondary)]">
                    {displayJob.statusLabel}
                  </span>
                </div>

                <h2 className="mt-3 text-xl font-bold tracking-tight text-[var(--color-primary)] sm:text-2xl lg:text-3xl">
                  {displayJob.title}
                </h2>
                <p className="mt-2 text-base font-semibold text-[var(--color-accent)] sm:text-lg">
                  {displayJob.salaryText}
                </p>
                {displayJob.summary ? (
                  <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
                    {displayJob.summary}
                  </p>
                ) : null}

                <section className="mt-8">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">
                    职位描述
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[var(--color-text-secondary)]">
                    {displayJob.description}
                  </p>
                </section>

                {displayJob.requirements.length > 0 ? (
                  <section className="mt-8">
                    <h3 className="text-sm font-semibold text-[var(--color-text)]">
                      任职要求
                    </h3>
                    <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                      {displayJob.requirements.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </div>

              <aside className="min-w-0 space-y-4 lg:sticky lg:top-0 lg:self-start">
                <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary-soft)] px-4 py-4">
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    薪酬
                  </p>
                  <p className="mt-1 text-lg font-bold text-[var(--color-accent)]">
                    {displayJob.salaryText}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    {displayJob.headcount} · {displayJob.locationNote || displayJob.location}
                  </p>
                </div>

                <section className="rounded-xl border border-[var(--color-border)]/70 bg-white/45 px-4 py-4">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">
                    关键信息
                  </h3>
                  <ul className="mt-3 space-y-2.5 text-sm text-[var(--color-text-secondary)]">
                    <li className="flex items-start gap-2">
                      <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                      <span>{displayJob.locationNote || displayJob.location}</span>
                    </li>
                    {displayJob.department ? (
                      <li className="flex items-start gap-2">
                        <Briefcase
                          className="mt-0.5 size-3.5 shrink-0"
                          aria-hidden
                        />
                        <span>{displayJob.department}</span>
                      </li>
                    ) : null}
                    <li className="flex items-start gap-2">
                      <UserRound
                        className="mt-0.5 size-3.5 shrink-0"
                        aria-hidden
                      />
                      <span>招聘 {displayJob.headcount}</span>
                    </li>
                  </ul>
                </section>

                <section className="rounded-xl border border-[var(--color-border)]/70 bg-white/45 px-4 py-4">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">
                    发布方
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-text)]">
                    {displayJob.publisherName}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
                    {displayJob.publisherNote ||
                      "本岗位为腾讯正式编制，由北斗领航协助对接。"}
                  </p>
                </section>

                <section className="rounded-xl border border-[var(--color-border)]/70 bg-white/45 px-4 py-4">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">
                    投递说明
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                    扫码添加企业微信沟通投递，站内暂不收简历。岗位信息来自腾讯猎头平台委托，非腾讯官方招聘站。
                  </p>
                  <div className="mt-4 flex flex-col items-start gap-2">
                    <Image
                      src="/wecom-qr.png"
                      alt="企业微信二维码"
                      width={112}
                      height={112}
                      className="size-28 rounded-lg border border-[var(--color-border)]/70 bg-white p-1"
                    />
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      企业微信 · 扫码联系猎头对接
                    </p>
                  </div>
                </section>
              </aside>
            </div>

            <div className="h-24" />
          </div>

          <div className="w-full border-t border-[var(--color-border)]/70 bg-[var(--color-bg)]/95 px-4 py-3 backdrop-blur-md sm:px-8 lg:px-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                  {displayJob.title}
                </p>
                <p className="mt-0.5 text-sm font-medium text-[var(--color-accent)]">
                  {displayJob.salaryText}
                  <span className="ml-2 font-normal text-[var(--color-text-secondary)]">
                    {displayJob.headcount} · 扫码沟通投递
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
