"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Loader2, X } from "lucide-react";
import { opcAgreementTitle } from "@/content/opc-agreement";
import {
  bindMyBankCard,
  type BankCardView,
} from "@/lib/bank-card-client";

type Props = {
  open: boolean;
  phone: string | null;
  binding: BankCardView | null;
  onClose: () => void;
  onSaved: (binding: BankCardView) => void;
};

export function BankCardModal({
  open,
  phone,
  binding,
  onClose,
  onSaved,
}: Props) {
  const [name, setName] = useState("");
  const [idCard, setIdCard] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [mobile, setMobile] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(binding?.holderName ?? "");
    setIdCard("");
    setAccountNo("");
    setMobile(phone ?? "");
    setAgreed(false);
    setError("");
  }, [open, binding, phone]);

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
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, submitting]);

  if (!open) return null;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError("请先阅读并勾选协议");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const result = await bindMyBankCard({
        name,
        idCard,
        accountNo,
        mobile,
        agreed,
      });
      if (!result.ok || !result.bankCard) {
        setError(result.message);
        return;
      }
      onSaved(result.bankCard);
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
        aria-label="关闭绑定银行卡弹窗"
        onClick={() => {
          if (!submitting) onClose();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bank-card-modal-title"
        className="relative z-10 max-h-[min(92vh,760px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--color-border)]/70 bg-white p-6 shadow-xl sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-primary)] disabled:opacity-40"
          aria-label="关闭"
        >
          <X className="size-4" aria-hidden />
        </button>

        <h2
          id="bank-card-modal-title"
          className="text-lg font-bold text-[var(--color-primary)]"
        >
          绑定银行卡
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
          需与银行预留信息一致：姓名、身份证号、银行卡号、预留手机号。
        </p>

        {binding ? (
          <p className="mt-3 rounded-lg bg-[var(--color-primary-soft)] px-3 py-2 text-xs leading-5 text-[var(--color-primary)]">
            当前已绑定 {binding.bankName || "银行卡"} {binding.cardMask}
            {binding.cardType ? ` · ${binding.cardType}` : ""}
            。再次提交将重新校验并覆盖。
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <Field
            label="持卡人姓名"
            value={name}
            autoFocus
            autoComplete="name"
            placeholder="请输入真实姓名"
            onChange={setName}
          />
          <Field
            label="身份证号"
            value={idCard}
            autoComplete="off"
            placeholder="请输入身份证号"
            maxLength={18}
            onChange={(value) => setIdCard(value.toUpperCase())}
          />
          <Field
            label="银行卡号"
            value={accountNo}
            inputMode="numeric"
            autoComplete="off"
            placeholder="请输入银行卡号"
            maxLength={23}
            onChange={(value) => setAccountNo(value.replace(/[^\d\s]/g, ""))}
          />
          <Field
            label="银行预留手机号"
            value={mobile}
            inputMode="numeric"
            autoComplete="tel"
            placeholder="请输入预留手机号"
            maxLength={11}
            onChange={(value) => setMobile(value.replace(/\D/g, ""))}
          />

          <label className="flex items-start gap-2 text-xs leading-5 text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-[var(--color-primary)]"
            />
            <span>
              我已阅读并同意
              <a
                href="/opc-agreement"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-0.5 text-[var(--color-primary)] underline-offset-2 hover:underline"
              >
                《{opcAgreementTitle}》
              </a>
            </span>
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
              disabled={submitting}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] transition hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] disabled:opacity-40"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={submitting || !agreed}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  校验中…
                </>
              ) : (
                "验证并绑定"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  autoFocus,
  autoComplete,
  inputMode,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoFocus?: boolean;
  autoComplete?: string;
  inputMode?: "numeric" | "text";
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-[var(--color-text-secondary)]">
        {label}
      </span>
      <input
        type="text"
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 h-11 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
      />
    </label>
  );
}
