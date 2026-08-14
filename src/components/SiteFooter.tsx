import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)]/60 bg-transparent">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="text-base font-semibold text-[var(--color-primary)]">
            百万职场
          </p>
          <p className="mt-1 max-w-sm text-sm leading-6 text-[var(--color-text-secondary)]">
            连接 AI 真实需求与超级创作者。接商单、参加活动，用交付积累机会。
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)]">
          <Link href="/tasks" className="hover:text-[var(--color-primary)]">
            AI 任务
          </Link>
          <Link href="/activities" className="hover:text-[var(--color-primary)]">
            活动
          </Link>
          <Link href="/terms" className="hover:text-[var(--color-primary)]">
            用户协议
          </Link>
          <Link href="/privacy" className="hover:text-[var(--color-primary)]">
            隐私政策
          </Link>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)] py-4 text-center text-xs text-[var(--color-text-secondary)]">
        <p>© {new Date().getFullYear()} 百万职场 · Million Career</p>
        <p className="mt-1.5">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-[var(--color-primary)]"
          >
            京ICP备17001001号-12
          </a>
        </p>
      </div>
    </footer>
  );
}
