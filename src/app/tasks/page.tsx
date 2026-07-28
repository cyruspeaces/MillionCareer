"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TaskCard } from "@/components/home/TaskCard";
import { TaskDetailDrawer } from "@/components/home/TaskDetailDrawer";
import { StaticPageShell } from "@/components/StaticPageShell";
import { fetchTasks } from "@/lib/tasks-client";
import type { TaskView } from "@/types/task";

const filters = ["全部", "对话训练", "数据达标", "内容创作", "评测标注", "AI 漫剧"];

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<TaskView | null>(null);
  const [activeFilter, setActiveFilter] = useState("全部");

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
    if (activeFilter === "全部") return tasks;
    return tasks.filter((task) => task.category === activeFilter);
  }, [activeFilter, tasks]);

  return (
    <StaticPageShell title="AI 任务">
      <div className="mt-6 flex flex-wrap gap-2 text-xs sm:text-sm">
        {filters.map((label) => {
          const active = label === activeFilter;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActiveFilter(label)}
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
