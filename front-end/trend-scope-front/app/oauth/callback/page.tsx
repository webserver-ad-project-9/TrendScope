import { Suspense } from "react";
import { OAuthCallbackClient } from "@/src/components/auth/OAuthCallbackClient";

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="oauth-callback-page">
          <span className="badge">OAuth</span>
          <h1 className="card-title">로그인 처리 중</h1>
          <p className="body-copy">잠시 후 TrendScope로 이동합니다.</p>
        </main>
      }
    >
      <OAuthCallbackClient />
    </Suspense>
  );
}
