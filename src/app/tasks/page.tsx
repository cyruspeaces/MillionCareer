"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { TaskCard } from "@/components/home/TaskCard";
import { TaskDetailDrawer } from "@/components/home/TaskDetailDrawer";
import { StaticPageShell } from "@/components/StaticPageShell";
import { fetchTasks } from "@/lib/tasks-client";
import type { TaskView } from "@/types/task";

const categoryFilters = [
  "全部",
  "对话训练",
  "数据达标",
  "内容创作",
  "评测标注",
  "AI 漫剧",
];
const workTypeFilters = [
  "远程兼职",
  "远程项目制",
  "驻场兼职",
  "驻场项目制",
  "全职",
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<TaskView | null>(null);
  const [activeCategory, setActiveCategory] = useState("全部");
  const [activeWorkType, setActiveWorkType] = useState("全部");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchTasks()
      .then((data) => {
        if (!cancelled) setTasks(data);
      })
      .catch(() => {
        if (!cancelled) setError("任务加载失败，请稍后重试");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchCategory =
        activeCategory === "全部" || task.category === activeCategory;
      const matchWorkType =
        activeWorkType === "全部" || task.workType === activeWorkType;
      return matchCategory && matchWorkType;
    });
  }, [activeCategory, activeWorkType, tasks]);

  return (
    <StaticPageShell>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex flex-wrap gap-2">
          {categoryFilters.map((label) => {
            const active = label === activeCategory;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setActiveCategory(label)}
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
          <span className="sr-only">工作方式</span>
          <select
            value={activeWorkType}
            onChange={(e) => setActiveWorkType(e.target.value)}
            className="h-8 appearance-none rounded-full border-0 bg-white/45 py-0 pl-3.5 pr-8 font-medium text-[var(--color-primary)] backdrop-blur-sm outline-none transition hover:bg-white/70"
          >
            <option value="全部">工作方式</option>
            {workTypeFilters.map((label) => (
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
          加载任务中…
        </p>
      ) : null}

      {error ? (
        <p className="mt-8 text-sm text-[var(--color-accent-hover)]">{error}</p>
      ) : null}

      {!loading && !error ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} onSelect={setSelected} />
            </li>
          ))}
        </ul>
      ) : null}

      {!loading && !error && filteredTasks.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--color-text-secondary)]">
          该分类下暂无任务。
        </p>
      ) : null}

      <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
        <Link href="/" className="text-[var(--color-primary)] hover:underline">
          返回首页
        </Link>
      </p>

      <TaskDetailDrawer
        task={selected}
        onClose={() => setSelected(null)}
        onApplied={(taskId) => {
          setTasks((prev) =>
            prev.map((t) =>
              t.id === taskId
                ? { ...t, joinedCount: t.joinedCount + 1 }
                : t,
            ),
          );
          setSelected((cur) =>
            cur && cur.id === taskId
              ? { ...cur, joinedCount: cur.joinedCount + 1 }
              : cur,
          );
        }}
      />
    </StaticPageShell>
  );
}
