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
  { label: "마이페이지", section: "mypage" },
  { label: "커뮤니티", section: "community" },
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
        <span className="brand-mark" aria-hidden="true">
          TS
        </span>
        <span>TrendScope</span>
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
              {authStatus === "checking" ? "확인 중" : "Google 로그인"}
            </Button>
            <Button variant="primary" onClick={onLogin}>
              시작하기
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
