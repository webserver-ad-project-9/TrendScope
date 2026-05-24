import { Button } from "@/src/components/ui/Button";
import type { TrendScopeSection } from "@/src/types/trend";

interface NavigationItem {
  readonly label: string;
  readonly section: TrendScopeSection;
}

interface TrendScopeHeaderProps {
  readonly activeSection: TrendScopeSection;
  readonly onNavigate: (section: TrendScopeSection) => void;
}

const navigationItems: readonly NavigationItem[] = [
  { label: "홈", section: "home" },
  { label: "AI 브리핑", section: "briefing" },
  { label: "키워드 검색", section: "search" },
  { label: "마이페이지", section: "mypage" },
  { label: "커뮤니티", section: "community" },
];

export function TrendScopeHeader({ activeSection, onNavigate }: TrendScopeHeaderProps) {
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

      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => onNavigate("mypage")}>
          로그인
        </Button>
        <Button variant="primary" onClick={() => onNavigate("mypage")}>
          시작하기
        </Button>
      </div>
    </header>
  );
}
