import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

type Props = {
  title?: string;
  description?: string;
  children?: ReactNode;
  mainClassName?: string;
};

export function StaticPageShell({
  title,
  description,
  children,
  mainClassName = "page-wrap flex-1 py-12",
}: Props) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className={mainClassName}>
        {title ? (
          <h1 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
            {title}
          </h1>
        ) : null}
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
            {description}
          </p>
        ) : null}
        {children ?? (
          <p className="mt-10 rounded-lg border border-dashed border-[var(--color-border)] bg-white/35 px-5 py-8 text-sm text-[var(--color-text-secondary)] backdrop-blur-sm">
            静态占位页，后续接入真实列表与详情。
          </p>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
