"use client";

import { useTrendScopeWorkspace } from "@/src/hooks/useTrendScopeWorkspace";
import { getDefaultBriefingViewModel } from "@/src/services/trendDashboardService";
import type { TrendDashboardSnapshot } from "@/src/types/trend";
import { TrendScopeHeader } from "./TrendScopeHeader";
import {
  BriefingSection,
  CommunitySection,
  HomeSection,
  MyPageSection,
  PostSection,
  SearchSection,
  WritePostSection,
} from "./TrendScopeSections";

interface TrendScopeAppProps {
  readonly initialSnapshot: TrendDashboardSnapshot;
}

export function TrendScopeApp({ initialSnapshot }: TrendScopeAppProps) {
  const workspace = useTrendScopeWorkspace(initialSnapshot);
  const defaultBriefing = getDefaultBriefingViewModel({
    ...initialSnapshot,
    keywords: workspace.keywords,
  });

  return (
    <div className="app-shell">
      <TrendScopeHeader
        activeSection={workspace.activeSection}
        onNavigate={workspace.goToSection}
      />

      <main>
        <HomeSection
          featureChips={initialSnapshot.featureChips}
          isActive={workspace.activeSection === "home"}
          metrics={initialSnapshot.heroMetrics}
          searchDraft={workspace.searchDraft}
          onNavigate={workspace.goToSection}
          onRequestKeywordSearch={workspace.requestKeywordSearch}
          onSearchDraftChange={workspace.setSearchDraft}
        />
        <BriefingSection
          briefing={defaultBriefing}
          isActive={workspace.activeSection === "briefing"}
        />
        <SearchSection
          isActive={workspace.activeSection === "search"}
          searchBriefing={workspace.searchBriefing}
          searchDraft={workspace.searchDraft}
          onRequestKeywordSearch={workspace.requestKeywordSearch}
          onSearchDraftChange={workspace.setSearchDraft}
        />
        <MyPageSection
          isActive={workspace.activeSection === "mypage"}
          keywordDraft={workspace.keywordDraft}
          keywords={workspace.keywords}
          onAddKeyword={workspace.addKeyword}
          onDeleteKeyword={workspace.deleteKeyword}
          onEditKeyword={workspace.editKeyword}
          onKeywordDraftChange={workspace.setKeywordDraft}
        />
        <CommunitySection
          activeBoardSectionId={workspace.activeCommunityBoardSectionId}
          allBoardPosts={workspace.communityPosts}
          boardPosts={workspace.visibleCommunityPosts}
          boardSections={initialSnapshot.communityBoardSections}
          isActive={workspace.activeSection === "community"}
          onBoardSectionChange={workspace.setCommunityBoardSection}
          onNavigate={workspace.goToSection}
          onOpenPost={workspace.openPost}
        />
        <WritePostSection
          boardSections={initialSnapshot.communityBoardSections}
          canSubmitPostDraft={workspace.canSubmitPostDraft}
          isActive={workspace.activeSection === "writePost"}
          postDraft={workspace.postDraft}
          onDraftFieldChange={workspace.setPostDraftField}
          onNavigate={workspace.goToSection}
          onSubmitPostDraft={workspace.submitPostDraft}
        />
        <PostSection
          isActive={workspace.activeSection === "post"}
          post={workspace.activePost}
          onNavigate={workspace.goToSection}
        />
      </main>

      <footer className="footer">
        <strong>TrendScope</strong> · AI 기반 뉴스 트렌드 브리핑 서비스
      </footer>
    </div>
  );
}
