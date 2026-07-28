"use client";

import { useEffect, useState } from "react";

const slogans = [
  "AI 任务与创作者平台",
  "接真实 AI 商单，赢创作与机会",
  "用交付与作品证明能力",
];

export function BrandSlogan() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % slogans.length);
        setVisible(true);
      }, 280);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className="relative hidden h-5 w-[13.5rem] shrink-0 overflow-hidden border-l border-[var(--color-border)]/70 pl-3 sm:block lg:w-[16rem]"
      aria-live="polite"
    >
      <p
        key={index}
        className={[
          "absolute inset-y-0 left-3 right-0 truncate text-xs font-medium leading-5 tracking-wide text-[var(--color-accent)] transition-all duration-300 sm:text-sm",
          visible
            ? "translate-y-0 opacity-100"
            : "-translate-y-2.5 opacity-0",
        ].join(" ")}
      >
        {slogans[index]}
      </p>
    </div>
  );
}
