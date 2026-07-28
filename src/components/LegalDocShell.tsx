import type { ReactNode } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

type Props = {
  title: string;
  updatedAt: string;
  children: ReactNode;
};

export function LegalDocShell({ title, updatedAt, children }: Props) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
        <p className="text-xs text-[var(--color-text-secondary)]">
          <Link href="/" className="hover:text-[var(--color-primary)]">
            首页
          </Link>
          <span className="mx-1.5">/</span>
          <span>{title}</span>
        </p>
        <h1 className="mt-4 text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          更新日期：{updatedAt}　|　生效日期：{updatedAt}
        </p>
        <article className="legal-doc mt-8 space-y-6 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-[15px]">
          {children}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
