import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)]/60 bg-transparent">
      <div className="page-wrap flex flex-col gap-8 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-base font-semibold text-[var(--color-primary)]">
            百万职场
          </p>
          <p className="mt-1 max-w-sm text-sm leading-6 text-[var(--color-text-secondary)]">
            连接 AI 真实需求与超级创作者。接商单、参加活动，用交付积累机会。
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)]">
            <Link href="/tasks" className="hover:text-[var(--color-primary)]">
              AI 任务
            </Link>
            <Link href="/jobs" className="hover:text-[var(--color-primary)]">
              岗位
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
        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-center">
          <Image
            src="/wecom-qr.png"
            alt="企业微信二维码"
            width={112}
            height={112}
            className="size-28 rounded-lg border border-[var(--color-border)]/70 bg-white p-1"
          />
          <p className="text-xs text-[var(--color-text-secondary)]">
            企业微信 · 扫码联系
          </p>
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
