"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Smartphone, X } from "lucide-react";
import { loginWithSms, sendSms, type AuthUser } from "@/lib/auth-client";

type Props = {
  open: boolean;
  next?: string;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void | Promise<void>;
};

export function LoginModal({ open, next, onClose, onSuccess }: Props) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hint, setHint] = useState("验证码将发送至你的手机，5 分钟内有效");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setPhone("");
    setCode("");
    setCountdown(0);
    setError("");
    setHint("验证码将发送至你的手机，5 分钟内有效");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const onSend = async () => {
    setError("");
    setSending(true);
    try {
      const result = await sendSms(phone);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setHint(result.message);
      setCountdown(60);
    } finally {
      setSending(false);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await loginWithSms(phone, code);
      if (!result.ok || !result.user) {
        setError(result.message);
        return;
      }
      await onSuccess(result.user);
      router.refresh();
      if (next) {
        router.push(next);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="关闭登录弹窗"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--color-border)]/70 bg-white p-6 shadow-xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-primary)]"
          aria-label="关闭"
        >
          <X className="size-4" aria-hidden />
        </button>

        <div className="flex items-center gap-2 text-[var(--color-primary)]">
          <Smartphone className="size-5" aria-hidden />
          <h2 id="login-modal-title" className="text-xl font-bold">
            手机号登录
          </h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
          未注册将自动完成注册并登录，无需设置密码。
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">
              手机号
            </span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={11}
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
              }
              className="mt-1.5 h-11 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">
              验证码
            </span>
            <div className="mt-1.5 flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="6 位验证码"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="h-11 min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
              />
              <button
                type="button"
                onClick={() => void onSend()}
                disabled={sending || countdown > 0 || phone.length !== 11}
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg border border-[var(--color-primary)] px-3 text-sm font-medium text-[var(--color-primary)] transition hover:bg-[var(--color-primary-soft)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending
                  ? "发送中…"
                  : countdown > 0
                    ? `${countdown}s`
                    : "获取验证码"}
              </button>
            </div>
          </label>

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : (
            <p className="text-xs leading-5 text-[var(--color-accent-hover)]">
              {hint}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || phone.length !== 11 || code.length < 4}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                登录中…
              </>
            ) : (
              "登录 / 注册"
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-xs leading-5 text-[var(--color-text-secondary)]">
          登录即表示同意
          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-0.5 text-[var(--color-primary)] hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            《用户协议》
          </Link>
          与
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-0.5 text-[var(--color-primary)] hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            《隐私政策》
          </Link>
        </p>
      </div>
    </div>
  );
}
