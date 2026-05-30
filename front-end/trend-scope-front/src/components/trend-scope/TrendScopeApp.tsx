"use client";

import { useTrendScopeWorkspace } from "@/src/hooks/useTrendScopeWorkspace";
import { TrendScopeHeader } from "./TrendScopeHeader";
import {
  BriefingSection,
  CommunitySection,
  DashboardSection,
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
          batchNewsSummary={workspace.batchNewsSummary}
          bookmarkedNewsIds={workspace.bookmarkedNewsIds}
          isSummarizingNewsBatch={workspace.isSummarizingNewsBatch}
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
          onSummarizeNewsBatch={workspace.summarizeRecommendedNewsBatch}
          onSummarizeNews={workspace.summarizeRecommendedNews}
          onToggleNewsBookmark={workspace.toggleNewsBookmark}
        />
        <DashboardSection
          dashboard={workspace.newsDashboard}
          isActive={workspace.activeSection === "dashboard"}
          syncMessage={workspace.newsDashboardSyncMessage}
          syncStatus={workspace.newsDashboardSyncStatus}
          onRefreshDashboard={workspace.refreshNewsDashboard}
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
          canSubmitCommentEdit={workspace.canSubmitCommentEdit}
          canSubmitPostEdit={workspace.canSubmitPostEdit}
          commentDraft={workspace.postCommentDraft}
          commentEditDraft={workspace.commentEditDraft}
          editingCommentId={workspace.editingCommentId}
          isEditingPost={workspace.isEditingActivePost}
          syncMessage={workspace.communitySyncMessage}
          syncStatus={workspace.communitySyncStatus}
          isActive={workspace.activeSection === "post"}
          post={workspace.activePost}
          postEditDraft={workspace.postEditDraft}
          onCancelCommentEdit={workspace.cancelEditingComment}
          onCancelPostEdit={workspace.cancelEditingActivePost}
          onCommentDraftChange={workspace.setPostCommentDraft}
          onCommentEditDraftChange={workspace.setCommentEditDraft}
          onDeleteComment={workspace.deleteComment}
          onDeletePost={workspace.deleteActivePost}
          onEditDraftFieldChange={workspace.setPostEditDraftField}
          onNavigate={workspace.goToSection}
          onStartCommentEdit={workspace.startEditingComment}
          onStartPostEdit={workspace.startEditingActivePost}
          onSubmitComment={workspace.submitPostComment}
          onSubmitCommentEdit={workspace.submitCommentEdit}
          onSubmitPostEdit={workspace.submitPostEdit}
          onToggleLike={workspace.toggleActivePostLike}
        />
      </main>

      <footer className="footer">
        <strong>TrendScope</strong> · AI 기반 뉴스 트렌드 브리핑 서비스
      </footer>
    </div>
  );
}
