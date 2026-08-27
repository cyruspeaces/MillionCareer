"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { TaskCard } from "@/components/home/TaskCard";
import { TaskDetailDrawer } from "@/components/home/TaskDetailDrawer";
import type { TaskView } from "@/types/task";

type Props = {
  tasks: TaskView[];
};

export function TaskListSection({ tasks: initialTasks }: Props) {
  const [tasks, setTasks] = useState(initialTasks);
  const [selected, setSelected] = useState<TaskView | null>(null);

  return (
    <section className="py-12 sm:py-16">
      <div className="page-wrap">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
            {["全部", "对话训练", "数据达标", "内容创作", "评测标注"].map(
              (label, i) => (
                <span
                  key={label}
                  className={
                    i === 0
                      ? "inline-flex h-8 items-center rounded-full bg-[var(--color-primary)] px-3.5 font-medium text-white"
                      : "inline-flex h-8 items-center rounded-full bg-white/45 px-3.5 font-medium text-[var(--color-primary)] backdrop-blur-sm"
                  }
                >
                  {label}
                </span>
              ),
            )}
          </div>
          <Link
            href="/tasks"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[var(--color-accent)] hover:underline"
          >
            查看全部任务
            <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} onSelect={setSelected} />
            </li>
          ))}
        </ul>
      </div>

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
    </section>
  );
}
