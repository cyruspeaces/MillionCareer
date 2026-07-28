"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

function LoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openLogin, user } = useAuth();
  const next = searchParams.get("next") || "/me";

  useEffect(() => {
    if (user === undefined) return;
    if (user) {
      router.replace(next);
      return;
    }
    openLogin({ next });
    router.replace("/");
  }, [user, openLogin, router, next]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--color-text-secondary)]">
      正在打开登录…
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--color-text-secondary)]">
          加载中…
        </div>
      }
    >
      <LoginRedirect />
    </Suspense>
  );
}
