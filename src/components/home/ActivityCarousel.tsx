"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { ActivityTone, ActivityView } from "@/types/activity";

const Ribbons = dynamic(() => import("@/components/bits/Ribbons"), {
  ssr: false,
});

const ribbonColors = ["#ffffff", "#F08519"];

const toneStyles: Record<
  ActivityTone,
  { panel: string; glow: string }
> = {
  primary: {
    panel:
      "from-[var(--color-primary)] via-[#3a3c9a] to-[#1e2060]",
    glow: "rgba(240, 133, 25, 0.35)",
  },
  accent: {
    panel: "from-[#c96a10] via-[var(--color-accent)] to-[#8a4a0c]",
    glow: "rgba(47, 49, 139, 0.35)",
  },
  mix: {
    panel: "from-[var(--color-primary)] via-[#4a3a7a] to-[#b86a20]",
    glow: "rgba(255, 255, 255, 0.2)",
  },
};

type Props = {
  activities: ActivityView[];
};

export function ActivityCarousel({ activities }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (activities.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % activities.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [activities.length]);

  const current = activities[index];
  if (!current) return null;

  const tone = toneStyles[current.tone];

  return (
    <section className="px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="relative min-h-[200px] overflow-hidden rounded-xl sm:min-h-[240px]">
          <div
            aria-hidden
            className={`absolute inset-0 bg-gradient-to-br ${tone.panel}`}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage: `
                linear-gradient(135deg, transparent 40%, ${tone.glow} 100%),
                repeating-linear-gradient(
                  -20deg,
                  rgba(255,255,255,0.06) 0px,
                  rgba(255,255,255,0.06) 1px,
                  transparent 1px,
                  transparent 14px
                )
              `,
            }}
          />

          <div aria-hidden className="absolute inset-0 z-[1]">
            <Ribbons
              baseThickness={28}
              colors={ribbonColors}
              speedMultiplier={0.5}
              maxAge={500}
              enableFade={false}
              enableShaderEffect
              effectAmplitude={1.2}
            />
          </div>

          <div
            key={current.id}
            className="home-slide-in pointer-events-none relative z-10 flex max-w-2xl flex-col gap-3 px-5 py-6 text-white sm:px-10 sm:py-9"
          >
            <span className="inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              {current.statusLabel}
            </span>
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {current.title}
            </h3>
            <p className="text-sm leading-6 text-white/85 sm:text-base">
              {current.summary}
            </p>
            <p className="text-sm font-medium text-[var(--color-accent)] sm:text-base">
              {current.benefit}
            </p>
            <div className="pt-2">
              <Link
                href={`/activities/${current.id}`}
                className="pointer-events-auto inline-flex h-10 items-center rounded-md bg-white px-4 text-sm font-medium text-[var(--color-primary)] transition hover:bg-white/90"
              >
                查看活动
              </Link>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 z-10 flex gap-2 sm:bottom-6 sm:right-8">
            {activities.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`切换到 ${item.title}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-[var(--color-accent)]"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
