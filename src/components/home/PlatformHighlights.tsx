import {
  BadgeCheck,
  BriefcaseBusiness,
  Sparkles,
  Trophy,
  type LucideIcon,
} from "lucide-react";

const highlights: {
  icon: LucideIcon;
  title: string;
  desc: string;
}[] = [
  {
    icon: BriefcaseBusiness,
    title: "真实 AI 商单",
    desc: "对话训练、数据评测、内容交付——接的是可验收的真实需求。",
  },
  {
    icon: Trophy,
    title: "活动聚拢创作者",
    desc: "挑战赛与评测周筛出超级创作者，用作品进入优质机会池。",
  },
  {
    icon: BadgeCheck,
    title: "交付即信用",
    desc: "不是投简历，而是用一次次验收通过的交付证明能力。",
  },
  {
    icon: Sparkles,
    title: "作品沉淀机会",
    desc: "履约与作品进入档案，解锁更高阶商单与长期合作。",
  },
];

export function PlatformHighlights() {
  return (
    <section className="pt-6 sm:pt-8">
      <div className="page-wrap grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className="rounded-xl border border-[var(--color-border)]/70 bg-white/45 px-4 py-4 backdrop-blur-sm sm:px-5 sm:py-5"
            >
              <div className="inline-flex size-9 items-center justify-center rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <Icon className="size-4" strokeWidth={1.75} aria-hidden />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-[var(--color-primary)] sm:text-base">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-[var(--color-text-secondary)] sm:text-sm sm:leading-6">
                {item.desc}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
