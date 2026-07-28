"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Clock3,
  ExternalLink,
  FileText,
  FolderOpen,
  MapPin,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ParticipantAvatars } from "@/components/home/ParticipantAvatars";
import {
  canEnrollWithSkills,
  EnrollButton,
  SkillMatchPanel,
  SkillTagRow,
} from "@/components/home/SkillMatchPanel";
import { fetchMySkills } from "@/lib/assessment-client";
import {
  applyToTask,
  fetchTaskApplied,
} from "@/lib/tasks-client";
import type { TaskView } from "@/types/task";

type Props = {
  task: TaskView | null;
  onClose: () => void;
  /** 报名成功后回调（如刷新列表头像数） */
  onApplied?: (taskId: string) => void;
};

function ProgressTimeline({
  task,
  applied,
}: {
  task: TaskView;
  applied: boolean;
}) {
  const steps = useMemo(() => {
    if (!applied) return task.steps;
    return task.steps.map((step, index) =>
      index === 0 ? { ...step, done: true } : step,
    );
  }, [task.steps, applied]);

  const doneCount = steps.filter((step) => step.done).length;
  const currentIndex = steps.findIndex((step) => !step.done);

  return (
    <section className="rounded-xl border border-[var(--color-border)]/70 bg-white/55 px-4 py-4 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">
          领取进度
        </h3>
        <span className="text-xs text-[var(--color-text-secondary)]">
          {doneCount} / {steps.length} 步
        </span>
      </div>

      <ol className="mt-5 flex w-full items-start">
        {steps.map((step, index) => {
          const isDone = step.done;
          const isCurrent =
            currentIndex === index ||
            (currentIndex === -1 && index === steps.length - 1);
          const lineDone =
            index < steps.length - 1 && steps[index].done;

          return (
            <li
              key={step.label}
              className="relative flex min-w-0 flex-1 flex-col items-center text-center"
            >
              {index < steps.length - 1 ? (
                <span
                  aria-hidden
                  className={[
                    "absolute top-[11px] left-[calc(50%+12px)] right-[calc(-50%+12px)] h-0.5",
                    lineDone
                      ? "bg-[var(--color-primary)]"
                      : "bg-[var(--color-border)]",
                  ].join(" ")}
                />
              ) : null}

              <span
                className={[
                  "relative z-[1] inline-flex size-6 items-center justify-center rounded-full text-[11px] font-semibold",
                  isDone
                    ? "bg-[var(--color-primary)] text-white"
                    : isCurrent
                      ? "bg-[var(--color-accent)] text-white"
                      : "bg-white text-[var(--color-text-secondary)] shadow-[inset_0_0_0_1.5px_var(--color-border)]",
                ].join(" ")}
              >
                {index + 1}
              </span>

              <p
                className={[
                  "mt-2.5 px-0.5 text-[11px] font-medium leading-4 sm:text-xs",
                  isDone || isCurrent
                    ? "text-[var(--color-text)]"
                    : "text-[var(--color-text-secondary)]",
                ].join(" ")}
              >
                {step.label}
              </p>

              <div className="mt-1 flex flex-wrap items-center justify-center gap-1">
                {step.tag ? (
                  <span className="rounded bg-[var(--color-accent-soft)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-accent-hover)]">
                    {step.tag}
                  </span>
                ) : null}
                <span className="text-[10px] text-[var(--color-text-secondary)]">
                  {isDone ? "已完成" : isCurrent ? "进行中" : "未完成"}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function SideList({
  title,
  icon,
  items,
}: {
  title: string;
  icon: ReactNode;
  items: string[];
}) {
  return (
    <section className="rounded-xl border border-[var(--color-border)]/70 bg-white/45 px-4 py-4">
      <h3 className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text)]">
        {icon}
        {title}
      </h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--color-text-secondary)]">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TaskDetailDrawer({ task, onClose, onApplied }: Props) {
  const { user, openLogin } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [displayTask, setDisplayTask] = useState<TaskView | null>(null);
  const [ownedSkills, setOwnedSkills] = useState<string[]>([]);
  const [applied, setApplied] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setDisplayTask(task);
      setMounted(true);
      setVisible(false);
      setEnrollError(null);
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
      setDisplayTask(null);
      setOwnedSkills([]);
      setApplied(false);
      setEnrollError(null);
    }, 420);
    return () => window.clearTimeout(timer);
  }, [task]);

  useEffect(() => {
    if (!mounted || !displayTask) return;

    if (!user) {
      setOwnedSkills([]);
      setApplied(false);
      return;
    }

    let cancelled = false;
    Promise.all([fetchMySkills(), fetchTaskApplied(displayTask.id)])
      .then(([skills, isApplied]) => {
        if (cancelled) return;
        setOwnedSkills(skills.map((s) => s.name));
        setApplied(isApplied);
      })
      .catch(() => {
        if (!cancelled) {
          setOwnedSkills([]);
          setApplied(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [mounted, displayTask, user]);

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

  if (!mounted || !displayTask) return null;

  const canEnroll = canEnrollWithSkills(displayTask.skills, ownedSkills);
  const loggedIn = Boolean(user);

  const handleEnroll = async () => {
    if (!displayTask || enrolling) return;
    setEnrolling(true);
    setEnrollError(null);
    try {
      await applyToTask(displayTask.id);
      setApplied(true);
      onApplied?.(displayTask.id);
    } catch (e) {
      const err = e as Error & { code?: string };
      setEnrollError(err.message || "报名失败，请稍后重试");
      if (err.code === "ALREADY_APPLIED") setApplied(true);
    } finally {
      setEnrolling(false);
    }
  };

  const enrollProps = {
    ready: canEnroll,
    applied,
    loading: enrolling,
    loggedIn,
    onEnroll: () => void handleEnroll(),
    onLogin: () => openLogin({ next: "/tasks" }),
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="关闭任务详情"
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
              任务详情
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
                    {displayTask.category}
                  </span>
                  <span className="rounded-md bg-[var(--color-primary-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
                    {displayTask.status}
                  </span>
                </div>

                <h2 className="mt-3 text-xl font-bold tracking-tight text-[var(--color-primary)] sm:text-2xl lg:text-3xl">
                  {displayTask.title}
                </h2>
                <p className="mt-2 text-base font-semibold text-[var(--color-accent)] sm:text-lg">
                  {displayTask.reward}
                </p>

                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold tracking-wide text-[var(--color-text-secondary)]">
                    所需技能
                  </p>
                  <SkillTagRow
                    skills={displayTask.skills}
                    ownedSkills={ownedSkills}
                  />
                </div>

                <section className="mt-8">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">
                    任务说明
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
                    {displayTask.about}
                  </p>
                </section>

                <section className="mt-8">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">
                    验收标准
                  </h3>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                    {displayTask.acceptance.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="mt-8">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">
                    交付物
                  </h3>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                    {displayTask.deliverables.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="mt-8">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">
                    适合谁
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
                    {displayTask.suitFor}
                  </p>
                </section>
              </div>

              <aside className="min-w-0 space-y-4 lg:sticky lg:top-0 lg:self-start">
                <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary-soft)] px-4 py-4">
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    报酬
                  </p>
                  <p className="mt-1 text-lg font-bold text-[var(--color-accent)]">
                    {displayTask.reward}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    {displayTask.quota} · {displayTask.deadline}
                  </p>
                  <EnrollButton {...enrollProps} className="mt-4 w-full" />
                  {enrollError ? (
                    <p className="mt-2 text-xs text-red-600">{enrollError}</p>
                  ) : null}
                </div>

                <SkillMatchPanel
                  requiredSkills={displayTask.skills}
                  ownedSkills={ownedSkills}
                />

                <section className="rounded-xl border border-[var(--color-border)]/70 bg-white/45 px-4 py-4">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">
                    关键信息
                  </h3>
                  <ul className="mt-3 space-y-2.5 text-sm text-[var(--color-text-secondary)]">
                    <li className="flex items-start gap-2">
                      <Clock3 className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                      <span>
                        {displayTask.workType} · {displayTask.deadline}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                      <span>{displayTask.location}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <UserRound
                        className="mt-0.5 size-3.5 shrink-0"
                        aria-hidden
                      />
                      <span>
                        已有 {displayTask.joinedCount} 人参与 ·{" "}
                        {displayTask.quota}
                      </span>
                    </li>
                  </ul>
                </section>

                <section className="rounded-xl border border-[var(--color-border)]/70 bg-white/45 px-4 py-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-[var(--color-text)]">
                      已参与人员
                    </h3>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {displayTask.joinedCount} 人
                    </span>
                  </div>
                  <div className="mt-3">
                    <ParticipantAvatars
                      participants={displayTask.participants}
                      joinedCount={displayTask.joinedCount}
                      size="md"
                      max={8}
                    />
                  </div>
                  <p className="mt-3 text-xs leading-5 text-[var(--color-text-secondary)]">
                    已有创作者报名参与，名额有限，尽早锁定机会。
                  </p>
                </section>

                <ProgressTimeline task={displayTask} applied={applied} />

                <SideList
                  title="作品 / 交付规范"
                  icon={
                    <FileText
                      className="size-3.5 text-[var(--color-primary)]"
                      aria-hidden
                    />
                  }
                  items={displayTask.specs}
                />

                <SideList
                  title="所需资料"
                  icon={
                    <FolderOpen
                      className="size-3.5 text-[var(--color-accent)]"
                      aria-hidden
                    />
                  }
                  items={displayTask.requirements}
                />

                <section className="rounded-xl border border-[var(--color-border)]/70 bg-white/45 px-4 py-4">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">
                    参考素材
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {displayTask.references.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary)] hover:underline"
                        >
                          {item.label}
                          <ExternalLink className="size-3.5" aria-hidden />
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-xl border border-[var(--color-border)]/70 bg-white/45 px-4 py-4">
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">
                    发包方
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-text)]">
                    {displayTask.publisher}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    {displayTask.publisherNote}
                  </p>
                </section>
              </aside>
            </div>

            <div className="h-24" />
          </div>

          <div className="w-full border-t border-[var(--color-border)]/70 bg-[var(--color-bg)]/95 px-4 py-3 backdrop-blur-md sm:px-8 lg:px-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                  {displayTask.title}
                </p>
                <p className="mt-0.5 text-sm font-medium text-[var(--color-accent)]">
                  {displayTask.reward}
                  <span className="ml-2 font-normal text-[var(--color-text-secondary)]">
                    {applied
                      ? "已报名"
                      : canEnroll
                        ? displayTask.quota
                        : "需先补齐技能后再报名"}
                  </span>
                </p>
                {enrollError ? (
                  <p className="mt-1 text-xs text-red-600 sm:hidden">
                    {enrollError}
                  </p>
                ) : null}
              </div>
              <EnrollButton {...enrollProps} className="w-full sm:w-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
