"use client";

import { useTrendScopeWorkspace } from "@/src/hooks/useTrendScopeWorkspace";
import { TrendScopeHeader } from "./TrendScopeHeader";
import {
  BriefingSection,
  CommunitySection,
  HomeSection,
  MyPageSection,
  OnboardingSection,
  PostSection,
  WritePostSection,
} from "./TrendScopeSections";

export function TrendScopeApp() {
  const workspace = useTrendScopeWorkspace();

  return (
    <div className="app-shell">
      <TrendScopeHeader
        activeSection={workspace.activeSection}
        authStatus={workspace.authStatus}
        currentUser={workspace.currentUser}
        onLogin={workspace.login}
        onLogout={workspace.logout}
        onNavigate={workspace.goToSection}
      />

      <main>
        <HomeSection isActive={workspace.activeSection === "home"} />
        <OnboardingSection
          canSubmitKeywords={workspace.canSubmitOnboardingKeywords}
          isActive={workspace.activeSection === "onboarding"}
          keywordDraft={workspace.onboardingKeywordDraft}
          selectedKeywordNames={workspace.selectedOnboardingKeywordNames}
          onAddCustomKeyword={workspace.addCustomOnboardingKeyword}
          onKeywordDraftChange={workspace.setOnboardingKeywordDraft}
          onNavigate={workspace.goToSection}
          onSkipKeywords={workspace.startLoginWithoutOnboardingKeywords}
          onStartLogin={workspace.startLoginWithOnboardingKeywords}
          onToggleKeyword={workspace.toggleOnboardingKeyword}
        />
        <BriefingSection
          isActive={workspace.activeSection === "briefing"}
          newsRecommendation={workspace.newsRecommendation}
          newsSummariesByArticleId={workspace.newsSummariesByArticleId}
          newsSyncMessage={workspace.newsSyncMessage}
          newsSyncStatus={workspace.newsSyncStatus}
          summarizingNewsId={workspace.summarizingNewsId}
          trendAnalysisSummary={workspace.trendAnalysisSummary}
          trendAnalysisSyncMessage={workspace.trendAnalysisSyncMessage}
          trendAnalysisSyncStatus={workspace.trendAnalysisSyncStatus}
          onRefreshNews={workspace.refreshNewsRecommendations}
          onSummarizeNews={workspace.summarizeRecommendedNews}
        />
        <MyPageSection
          currentUser={workspace.currentUser}
          isActive={workspace.activeSection === "mypage"}
          keywordDraft={workspace.keywordDraft}
          keywordSyncMessage={workspace.keywordSyncMessage ?? workspace.authMessage}
          keywordSyncStatus={workspace.keywordSyncStatus}
          keywords={workspace.keywords}
          onAddKeyword={workspace.addKeyword}
          onKeywordDraftChange={workspace.setKeywordDraft}
        />
        <CommunitySection
          activeBoardSectionId={workspace.activeCommunityBoardSectionId}
          allBoardPosts={workspace.communityPosts}
          boardPosts={workspace.visibleCommunityPosts}
          boardSections={workspace.communityBoardSections}
          syncMessage={workspace.communitySyncMessage}
          syncStatus={workspace.communitySyncStatus}
          isActive={workspace.activeSection === "community"}
          onBoardSectionChange={workspace.setCommunityBoardSection}
          onNavigate={workspace.goToSection}
          onOpenPost={workspace.openPost}
        />
        <WritePostSection
          boardSections={workspace.communityBoardSections}
          canSubmitPostDraft={workspace.canSubmitPostDraft}
          isActive={workspace.activeSection === "writePost"}
          postDraft={workspace.postDraft}
          onDraftFieldChange={workspace.setPostDraftField}
          onNavigate={workspace.goToSection}
          onSubmitPostDraft={workspace.submitPostDraft}
        />
        <PostSection
          canSubmitComment={workspace.canSubmitPostComment}
          commentDraft={workspace.postCommentDraft}
          syncMessage={workspace.communitySyncMessage}
          syncStatus={workspace.communitySyncStatus}
          isActive={workspace.activeSection === "post"}
          post={workspace.activePost}
          onCommentDraftChange={workspace.setPostCommentDraft}
          onNavigate={workspace.goToSection}
          onSubmitComment={workspace.submitPostComment}
          onToggleLike={workspace.toggleActivePostLike}
        />
      </main>

      <footer className="footer">
        <strong>TrendScope</strong> · AI 기반 뉴스 트렌드 브리핑 서비스
      </footer>
    </div>
  );
}
