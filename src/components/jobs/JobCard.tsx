"use client";

import { ArrowUpRight, MapPin, Users } from "lucide-react";
import BorderGlow from "@/components/bits/BorderGlow";
import type { JobView } from "@/types/job";

const cardGlowColors = ["#6B6FBF", "#F08519", "#A8AED8"];

type Props = {
  job: JobView;
  onSelect?: (job: JobView) => void;
};

export function JobCard({ job, onSelect }: Props) {
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
        onClick={() => onSelect?.(job)}
        className="group flex h-full w-full flex-col p-5 text-left sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-base font-semibold leading-snug text-[var(--color-text)] transition group-hover:text-[var(--color-primary)] sm:text-[17px]">
            {job.title}
          </h3>
          <span className="inline-flex shrink-0 items-center gap-0.5 text-sm font-medium text-[var(--color-primary)]">
            查看
            <ArrowUpRight className="size-3.5" aria-hidden />
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-[var(--color-text-secondary)]">
          {job.summary || job.salaryText}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-[var(--color-accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-accent-hover)]">
            {job.campaignLabel}
          </span>
          <span className="rounded-md bg-[var(--color-primary-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
            {job.jobType}
          </span>
          <span className="text-xs text-[var(--color-text-secondary)]">
            {job.salaryText}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs text-[var(--color-text-secondary)] sm:text-sm">
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{job.locationNote || job.location}</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1">
            <Users className="size-3.5" aria-hidden />
            {job.headcount}
          </span>
        </div>
      </button>
    </BorderGlow>
  );
}
