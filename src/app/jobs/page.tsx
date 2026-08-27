"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { JobCard } from "@/components/jobs/JobCard";
import { JobDetailDrawer } from "@/components/jobs/JobDetailDrawer";
import { TencentJobsBanner } from "@/components/jobs/TencentJobsBanner";
import { StaticPageShell } from "@/components/StaticPageShell";
import { fetchJobs } from "@/lib/jobs-client";
import type { JobView } from "@/types/job";

export default function JobsPage() {
  return (
    <Suspense>
      <JobsPageContent />
    </Suspense>
  );
}

function JobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobFromQuery = searchParams.get("job");
  const [jobs, setJobs] = useState<JobView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLocation, setActiveLocation] = useState("全部");
  const [activeJobType, setActiveJobType] = useState("全部");
  const [selected, setSelected] = useState<JobView | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchJobs()
      .then((data) => {
        if (!cancelled) setJobs(data);
      })
      .catch(() => {
        if (!cancelled) setError("岗位加载失败，请稍后重试");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!jobFromQuery || jobs.length === 0) return;
    const match = jobs.find((j) => j.id === jobFromQuery);
    if (match) setSelected(match);
  }, [jobFromQuery, jobs]);

  const locations = useMemo(() => {
    const set = new Set(jobs.map((j) => j.location).filter(Boolean));
    return ["全部", ...Array.from(set)];
  }, [jobs]);

  const jobTypes = useMemo(() => {
    const set = new Set(jobs.map((j) => j.jobType).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "zh"));
  }, [jobs]);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const matchLoc =
        activeLocation === "全部" || job.location === activeLocation;
      const matchType =
        activeJobType === "全部" || job.jobType === activeJobType;
      return matchLoc && matchType;
    });
  }, [jobs, activeLocation, activeJobType]);

  return (
    <StaticPageShell>
      <div className="overflow-hidden rounded-xl">
        <TencentJobsBanner />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex flex-wrap gap-2">
          {locations.map((label) => {
            const active = label === activeLocation;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setActiveLocation(label)}
                className={
                  active
                    ? "inline-flex h-8 items-center rounded-full bg-[var(--color-primary)] px-3.5 font-medium text-white"
                    : "inline-flex h-8 items-center rounded-full bg-white/45 px-3.5 font-medium text-[var(--color-primary)] backdrop-blur-sm transition hover:bg-white/70"
                }
              >
                {label}
              </button>
            );
          })}
        </div>
        <label className="relative inline-flex">
          <span className="sr-only">职类</span>
          <select
            value={activeJobType}
            onChange={(e) => setActiveJobType(e.target.value)}
            className="h-8 appearance-none rounded-full border-0 bg-white/45 py-0 pl-3.5 pr-8 font-medium text-[var(--color-primary)] backdrop-blur-sm outline-none transition hover:bg-white/70"
          >
            <option value="全部">职类</option>
            {jobTypes.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[var(--color-primary)]"
            aria-hidden
          />
        </label>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-[var(--color-text-secondary)]">
          加载岗位中…
        </p>
      ) : null}

      {error ? (
        <p className="mt-8 text-sm text-[var(--color-accent-hover)]">{error}</p>
      ) : null}

      {!loading && !error ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((job) => (
            <li key={job.id}>
              <JobCard
                job={job}
                onSelect={(item) => {
                  setSelected(item);
                  router.replace(`/jobs?job=${item.id}`, { scroll: false });
                }}
              />
            </li>
          ))}
        </ul>
      ) : null}

      {!loading && !error && filtered.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--color-text-secondary)]">
          该筛选下暂无岗位。
        </p>
      ) : null}

      <JobDetailDrawer
        job={selected}
        onClose={() => {
          setSelected(null);
          if (jobFromQuery) router.replace("/jobs", { scroll: false });
        }}
      />
    </StaticPageShell>
  );
}
