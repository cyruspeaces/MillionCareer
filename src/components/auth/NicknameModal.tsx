"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Loader2, X } from "lucide-react";
import { updateNickname, type AuthUser } from "@/lib/auth-client";

type Props = {
  open: boolean;
  currentNickname: string;
  onClose: () => void;
  onSaved: (user: AuthUser) => void;
};

export function NicknameModal({
  open,
  currentNickname,
  onClose,
  onSaved,
}: Props) {
  const [nickname, setNickname] = useState(currentNickname);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setNickname(currentNickname);
    setError("");
  }, [open, currentNickname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await updateNickname(nickname);
      if (!result.ok || !result.user) {
        setError(result.message);
        return;
      }
      onSaved(result.user);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="关闭修改用户名弹窗"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="nickname-modal-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--color-border)]/70 bg-white p-6 shadow-xl sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-primary)]"
          aria-label="关闭"
        >
          <X className="size-4" aria-hidden />
        </button>

        <h2
          id="nickname-modal-title"
          className="text-lg font-bold text-[var(--color-primary)]"
        >
          修改用户名
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          2～20 个字符，将展示在个人中心与导航。
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">
              用户名
            </span>
            <input
              type="text"
              autoFocus
              maxLength={20}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="请输入用户名"
              className="mt-1.5 h-11 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
            />
          </label>

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] transition hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={submitting || nickname.trim().length < 2}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  保存中…
                </>
              ) : (
                "保存"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
