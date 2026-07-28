"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Lock, X } from "lucide-react";
import {
  getSkillGuideInfo,
  resolveSkillGuideAction,
  type SkillGuideInfo,
} from "@/lib/skill-guide";
import { fetchSkillCatalog } from "@/lib/skills-client";

type Props = {
  open: boolean;
  skillName: string | null;
  /** 若已有完整节点信息可直接传入，避免再查 */
  info?: SkillGuideInfo | null;
  lit?: boolean;
  unlockedAt?: string;
  onClose: () => void;
};

export function SkillGuideSheet({
  open,
  skillName,
  info: infoProp,
  lit = false,
  unlockedAt,
  onClose,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open && skillName) {
      void fetchSkillCatalog().catch(() => undefined);
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
    const timer = window.setTimeout(() => setMounted(false), 280);
    return () => window.clearTimeout(timer);
  }, [open, skillName]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, onClose]);

  if (!mounted || !skillName) return null;

  const info = infoProp ?? getSkillGuideInfo(skillName);
  const action = resolveSkillGuideAction(info, lit);

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="关闭"
        className={[
          "absolute inset-0 bg-[rgba(26,26,32,0.4)] transition-opacity duration-250",
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      <div
        className={[
          "absolute inset-x-0 bottom-0 mx-auto w-full max-w-lg",
          "transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]",
          visible ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
      >
        <div className="rounded-t-2xl border border-[var(--color-border)]/70 bg-[var(--color-bg)] px-5 pb-6 pt-4 shadow-[0_-12px_40px_rgba(47,49,139,0.12)]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <span
                className={[
                  "inline-flex size-11 shrink-0 items-center justify-center rounded-full",
                  lit
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]",
                ].join(" ")}
                aria-hidden
              >
                {lit ? (
                  <BadgeCheck className="size-5" />
                ) : (
                  <Lock className="size-5" />
                )}
              </span>
              <div className="min-w-0">
                <p className="text-base font-semibold text-[var(--color-text)]">
                  {info.name}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span
                    className={
                      lit
                        ? "rounded-md bg-[var(--color-primary-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-primary)]"
                        : "rounded-md bg-[var(--color-accent-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-accent-hover)]"
                    }
                  >
                    {lit ? "已点亮" : "待点亮"}
                  </span>
                  <span className="text-[10px] text-[var(--color-text-secondary)]">
                    {info.group}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
              aria-label="关闭"
            >
              <X className="size-4" />
            </button>
          </div>

          <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
            {info.desc}
          </p>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="shrink-0 text-[var(--color-text-secondary)]">
                点亮途径
              </dt>
              <dd className="text-[var(--color-text)]">{info.source}</dd>
            </div>
            {lit && unlockedAt ? (
              <div className="flex gap-2">
                <dt className="shrink-0 text-[var(--color-text-secondary)]">
                  点亮时间
                </dt>
                <dd className="text-[var(--color-text)]">{unlockedAt}</dd>
              </div>
            ) : null}
            {!lit && info.actionHint ? (
              <div className="flex gap-2">
                <dt className="shrink-0 text-[var(--color-text-secondary)]">
                  如何点亮
                </dt>
                <dd className="text-[var(--color-text)]">{info.actionHint}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link
              href={action.href}
              onClick={onClose}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-md bg-[var(--color-primary)] text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)]"
            >
              {action.label}
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-md border border-[var(--color-border)] bg-white/70 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-white"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
