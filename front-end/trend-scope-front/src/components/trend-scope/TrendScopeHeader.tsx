import Image from "next/image";
import { Button } from "@/src/components/ui/Button";
import type { AuthStatus, CurrentUserViewModel } from "@/src/types/auth";
import type { TrendScopeSection } from "@/src/types/trend";

interface NavigationItem {
  readonly label: string;
  readonly section: TrendScopeSection;
}

interface TrendScopeHeaderProps {
  readonly activeSection: TrendScopeSection;
  readonly authStatus: AuthStatus;
  readonly currentUser: CurrentUserViewModel | null;
  readonly onLogin: () => void;
  readonly onLogout: () => Promise<void>;
  readonly onNavigate: (section: TrendScopeSection) => void;
}

const navigationItems: readonly NavigationItem[] = [
  { label: "홈", section: "home" },
  { label: "AI 브리핑", section: "briefing" },
  { label: "뉴스 대시보드", section: "dashboard" },
  { label: "커뮤니티", section: "community" },
  { label: "마이페이지", section: "mypage" },
];

export function TrendScopeHeader({
  activeSection,
  authStatus,
  currentUser,
  onLogin,
  onLogout,
  onNavigate,
}: TrendScopeHeaderProps) {
  return (
    <header className="topbar">
      <button
        aria-label="홈으로 이동"
        className="brand"
        type="button"
        onClick={() => onNavigate("home")}
      >
        <Image
          alt="TrendScope"
          className="brand-logo"
          height={32}
          priority
          src="/trend-scope-logo.png"
          width={124}
        />
      </button>

      <nav aria-label="주요 화면" className="nav-list">
        {navigationItems.map((item) => (
          <button
            className="nav-tab"
            data-active={activeSection === item.section}
            key={item.section}
            type="button"
            onClick={() => onNavigate(item.section)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="auth-actions">
        {currentUser === null ? (
          <>
            <Button disabled={authStatus === "checking"} variant="ghost" onClick={onLogin}>
              {authStatus === "checking" ? "확인 중" : (
                <>
                  <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true" style={{ flexShrink: 0 }}>
                    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Google 로그인
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <span className="user-pill">{currentUser.name}</span>
            <Button variant="ghost" onClick={() => void onLogout()}>
              로그아웃
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
