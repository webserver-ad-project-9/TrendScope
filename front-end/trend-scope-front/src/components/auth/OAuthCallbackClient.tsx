"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { completeOAuthLogin, type OAuthSignupHint } from "@/src/services/authService";

/**
 * 백엔드 OAuth redirect URL의 token query를 저장하고 홈으로 복귀한다.
 */
export function OAuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("token");

  useEffect(() => {
    if (accessToken === null || accessToken.trim().length === 0) {
      router.replace("/");
      return;
    }

    completeOAuthLogin(accessToken, readOAuthSignupHint(searchParams));
    router.replace("/");
  }, [accessToken, router, searchParams]);

  return (
    <main className="oauth-callback-page">
      <span className="badge">OAuth</span>
      <h1 className="card-title">로그인 처리 중</h1>
      <p className="body-copy">잠시 후 TrendScope로 이동합니다.</p>
    </main>
  );
}

function readOAuthSignupHint(searchParams: { get: (name: string) => string | null }): OAuthSignupHint {
  const rawValue =
    searchParams.get("isNewUser") ??
    searchParams.get("isSignup") ??
    searchParams.get("newUser") ??
    searchParams.get("signup");

  if (rawValue === null) {
    return "unknown";
  }

  const normalizedValue = rawValue.trim().toLowerCase();

  if (["true", "1", "yes", "signup", "new"].includes(normalizedValue)) {
    return "signup";
  }

  if (["false", "0", "no", "login", "existing"].includes(normalizedValue)) {
    return "login";
  }

  return "unknown";
}
