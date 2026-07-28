"use client";

import { ArrowUpRight, UserPlus } from "lucide-react";
import BorderGlow from "@/components/bits/BorderGlow";
import { ParticipantAvatars } from "@/components/home/ParticipantAvatars";
import type { TaskView } from "@/types/task";

type Props = {
  task: TaskView;
  onSelect?: (task: TaskView) => void;
};

/** 品牌色：主色蓝 / 辅色橙 / 浅蓝 */
const cardGlowColors = ["#6B6FBF", "#F08519", "#A8AED8"];

export function TaskCard({ task, onSelect }: Props) {
  return (
    <BorderGlow
      className="h-full w-full"
      backgroundColor="rgba(255, 255, 255, 0.78)"
      borderRadius={12}
      glowColor="238 55 68"
      colors={cardGlowColors}
      glowRadius={28}
      glowIntensity={0.9}
      fillOpacity={0.28}
      edgeSensitivity={22}
      coneSpread={28}
      animated={false}
    >
      <button
        type="button"
        onClick={() => onSelect?.(task)}
        className="group flex h-full w-full flex-col p-5 text-left sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-base font-semibold leading-snug text-[var(--color-text)] transition group-hover:text-[var(--color-primary)] sm:text-[17px]">
            {task.title}
          </h3>
          <span className="inline-flex shrink-0 items-center gap-0.5 text-sm font-medium text-[var(--color-primary)]">
            领取
            <ArrowUpRight className="size-3.5" aria-hidden />
          </span>
        </div>

        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          {task.reward}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-[var(--color-accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-accent-hover)]">
            {task.category}
          </span>
          <span className="rounded-md bg-[var(--color-primary-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
            {task.status}
          </span>
          <span className="text-xs text-[var(--color-text-secondary)]">
            {task.deadline}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div className="flex min-w-0 items-center gap-2">
            <ParticipantAvatars
              participants={task.participants}
              joinedCount={task.joinedCount}
              max={5}
            />
            <span className="truncate text-xs text-[var(--color-text-secondary)] sm:text-sm">
              已有 {task.joinedCount} 人参与
            </span>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1 text-xs text-[var(--color-text-secondary)] sm:text-sm">
            <UserPlus className="size-3.5" aria-hidden />
            {task.quota}
          </span>
        </div>
      </button>
    </BorderGlow>
  );
}
