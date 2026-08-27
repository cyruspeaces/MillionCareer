"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  LayoutDashboard,
  ListTodo,
  LogIn,
  LogOut,
  Network,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { BrandSlogan } from "@/components/BrandSlogan";
import {
  avatarInitials,
  logout,
  maskPhone,
} from "@/lib/auth-client";

type NavItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
  badge?: string;
  match: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
  {
    href: "/",
    label: "首页",
    match: (pathname) => pathname === "/",
  },
  {
    href: "/tasks",
    label: "任务",
    icon: ListTodo,
    match: (pathname) => pathname.startsWith("/tasks"),
  },
  {
    href: "/jobs",
    label: "岗位",
    icon: Briefcase,
    badge: "HOT · 腾讯专场",
    match: (pathname) => pathname.startsWith("/jobs"),
  },
  {
    href: "/activities",
    label: "活动",
    icon: CalendarDays,
    match: (pathname) => pathname.startsWith("/activities"),
  },
];

function NavLink({
  item,
  pathname,
  compact = false,
}: {
  item: NavItem;
  pathname: string;
  compact?: boolean;
}) {
  const active = item.match(pathname);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={[
        "relative inline-flex items-center rounded-full font-medium transition",
        compact ? "gap-1 px-2.5 py-1.5 text-xs" : "gap-1.5 px-3.5 py-1.5 text-sm",
        active
          ? "bg-white/55 text-[var(--color-primary)] shadow-[inset_0_0_0_1px_rgba(47,49,139,0.1)] backdrop-blur-sm"
          : "text-[var(--color-text-secondary)] hover:bg-white/35 hover:text-[var(--color-primary)]",
      ].join(" ")}
    >
      {Icon ? (
        <Icon
          className={compact ? "size-3.5" : "size-4"}
          strokeWidth={active ? 2.25 : 1.75}
          aria-hidden
        />
      ) : null}
      <span>{item.label}</span>
      {item.badge ? (
        <span
          className={[
            "nav-hot-badge absolute z-10 whitespace-nowrap rounded-full font-semibold tracking-wide text-white",
            compact
              ? "-right-4 -top-2 translate-x-[30px] px-1.5 py-px text-[8px]"
              : "-right-7 -top-2.5 translate-x-[30px] px-1.5 py-px text-[9px]",
          ].join(" ")}
        >
          {compact ? "HOT" : item.badge}
        </span>
      ) : null}
    </Link>
  );
}

const menuLinks: {
  href: string;
  label: string;
  icon: LucideIcon;
}[] = [
  { href: "/me?section=overview", label: "概览", icon: LayoutDashboard },
  { href: "/me?section=tasks", label: "任务", icon: ClipboardList },
  { href: "/me?section=skills", label: "技能树", icon: Network },
  { href: "/me?section=earnings", label: "结算", icon: CircleDollarSign },
  { href: "/tasks", label: "领任务", icon: ListTodo },
];

const AVATAR_COLOR = "#F08519";

function UserMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, openLogin, setUser, refreshUser } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (event.target instanceof Node && !el.contains(event.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const onLogout = async () => {
    setOpen(false);
    await logout();
    setUser(null);
    await refreshUser();
    router.push("/");
    router.refresh();
  };

  if (user === undefined) {
    return (
      <span
        className="inline-flex size-9 animate-pulse rounded-full bg-[var(--color-bg-muted)] sm:size-10"
        aria-hidden
      />
    );
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => openLogin({ next: pathname.startsWith("/me") ? "/me" : undefined })}
        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-3.5 text-sm font-medium text-white transition hover:opacity-90 sm:h-10"
      >
        <LogIn className="size-3.5" aria-hidden />
        登录
      </button>
    );
  }

  const name = user.nickname || maskPhone(user.phone) || "创作者";
  const initials = avatarInitials(user.nickname, user.phone);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-9 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm outline-none transition hover:opacity-95 sm:size-10"
        style={{ backgroundColor: AVATAR_COLOR }}
        aria-label={`${name}的账户菜单`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initials}
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-50 pt-2" role="menu">
          <div className="w-56 overflow-hidden rounded-xl border border-[var(--color-border)]/70 bg-white/95 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-3 border-b border-[var(--color-border)]/60 px-4 py-3.5">
              <span
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: AVATAR_COLOR }}
              >
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--color-primary)]">
                  {name}
                </p>
                <p className="truncate text-xs text-[var(--color-text-secondary)]">
                  {maskPhone(user.phone) || "AI 任务创作者"}
                </p>
              </div>
            </div>

            <div className="p-1.5">
              {menuLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-[var(--color-border)]/60 p-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={() => void onLogout()}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-primary)]"
              >
                <LogOut className="size-4 shrink-0" aria-hidden />
                登出
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)]/50 bg-transparent backdrop-blur-[10px]">
      <div className="page-wrap grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-3 sm:h-16">
        <div className="flex min-w-0 items-center gap-3 justify-self-start">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              src="/logo.png"
              alt="百万职场"
              width={148}
              height={40}
              priority
              className="h-8 w-auto sm:h-9"
            />
          </Link>
          <BrandSlogan />
        </div>

        <nav className="hidden items-center justify-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="col-start-3 flex items-center justify-end justify-self-end">
          <UserMenu />
        </div>
      </div>

      <nav className="flex items-center justify-around border-t border-[var(--color-border)]/50 px-2 py-2 md:hidden">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} compact />
        ))}
      </nav>
    </header>
  );
}
