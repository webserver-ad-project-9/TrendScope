import type { FormEvent } from "react";
import { Button } from "@/src/components/ui/Button";
import type { CurrentUserViewModel, KeywordSyncStatus } from "@/src/types/auth";
import type {
  BoardPostViewModel,
  CommunityBoardFilterId,
  CommunityBoardSectionViewModel,
  CommunityPostDraftViewModel,
  CommunitySyncStatus,
  KeywordViewModel,
  NewsBookmarkViewModel,
  NewsClusterViewModel,
  NewsDashboardSyncStatus,
  NewsDashboardViewModel,
  NewsSentiment,
  NewsRiskLevel,
  NewsRecommendationViewModel,
  NewsSummaryViewModel,
  NewsSyncStatus,
  RecommendedNewsArticleViewModel,
  TrendAnalysisSummaryViewModel,
  TrendAnalysisSyncStatus,
  TrendScopeSection,
} from "@/src/types/trend";

interface HomeSectionProps {
  readonly isActive: boolean;
}

interface BriefingSectionProps {
  readonly isActive: boolean;
  readonly batchNewsSummary: NewsSummaryViewModel | null;
  readonly bookmarkedNewsIds: readonly string[];
  readonly isSummarizingNewsBatch: boolean;
  readonly newsRecommendation: NewsRecommendationViewModel | null;
  readonly newsSummariesByArticleId: Readonly<Record<string, NewsSummaryViewModel>>;
  readonly newsSyncMessage: string | null;
  readonly newsSyncStatus: NewsSyncStatus;
  readonly summarizingNewsId: string | null;
  readonly trendAnalysisSummary: TrendAnalysisSummaryViewModel | null;
  readonly trendAnalysisSyncMessage: string | null;
  readonly trendAnalysisSyncStatus: TrendAnalysisSyncStatus;
  readonly onRefreshNews: () => Promise<void>;
  readonly onSummarizeNewsBatch: () => Promise<void>;
  readonly onSummarizeNews: (newsId: string) => Promise<void>;
  readonly onToggleNewsBookmark: (newsId: string) => Promise<void>;
}

interface DashboardSectionProps {
  readonly isActive: boolean;
  readonly dashboard: NewsDashboardViewModel | null;
  readonly syncMessage: string | null;
  readonly syncStatus: NewsDashboardSyncStatus;
  readonly onRefreshDashboard: () => Promise<void>;
}

interface OnboardingSectionProps {
  readonly isActive: boolean;
  readonly canSubmitKeywords: boolean;
  readonly keywordDraft: string;
  readonly selectedKeywordNames: readonly string[];
  readonly onAddCustomKeyword: () => void;
  readonly onKeywordDraftChange: (value: string) => void;
  readonly onNavigate: (section: TrendScopeSection) => void;
  readonly onSkipKeywords: () => void;
  readonly onStartLogin: () => Promise<void>;
  readonly onToggleKeyword: (keywordName: string) => void;
}

interface MyPageSectionProps {
  readonly isActive: boolean;
  readonly currentUser: CurrentUserViewModel | null;
  readonly keywords: readonly KeywordViewModel[];
  readonly keywordDraft: string;
  readonly keywordSyncMessage: string | null;
  readonly keywordSyncStatus: KeywordSyncStatus;
  readonly onKeywordDraftChange: (value: string) => void;
  readonly onAddKeyword: () => Promise<void>;
}

interface CommunitySectionProps {
  readonly isActive: boolean;
  readonly activeBoardSectionId: CommunityBoardFilterId;
  readonly boardSections: readonly CommunityBoardSectionViewModel[];
  readonly allBoardPosts: readonly BoardPostViewModel[];
  readonly boardPosts: readonly BoardPostViewModel[];
  readonly syncMessage: string | null;
  readonly syncStatus: CommunitySyncStatus;
  readonly onBoardSectionChange: (sectionId: CommunityBoardFilterId) => void;
  readonly onOpenPost: (postId: string) => void;
  readonly onNavigate: (section: TrendScopeSection) => void;
}

interface WritePostSectionProps {
  readonly isActive: boolean;
  readonly boardSections: readonly CommunityBoardSectionViewModel[];
  readonly postDraft: CommunityPostDraftViewModel;
  readonly canSubmitPostDraft: boolean;
  readonly onDraftFieldChange: (field: keyof CommunityPostDraftViewModel, value: string) => void;
  readonly onSubmitPostDraft: () => Promise<void>;
  readonly onNavigate: (section: TrendScopeSection) => void;
}

interface PostSectionProps {
  readonly isActive: boolean;
  readonly post: BoardPostViewModel | null;
  readonly postEditDraft: CommunityPostDraftViewModel;
  readonly isEditingPost: boolean;
  readonly canSubmitComment: boolean;
  readonly canSubmitPostEdit: boolean;
  readonly canSubmitCommentEdit: boolean;
  readonly commentDraft: string;
  readonly commentEditDraft: string;
  readonly editingCommentId: string | null;
  readonly syncMessage: string | null;
  readonly syncStatus: CommunitySyncStatus;
  readonly onCommentDraftChange: (value: string) => void;
  readonly onCommentEditDraftChange: (value: string) => void;
  readonly onEditDraftFieldChange: (field: keyof CommunityPostDraftViewModel, value: string) => void;
  readonly onNavigate: (section: TrendScopeSection) => void;
  readonly onSubmitComment: () => Promise<void>;
  readonly onSubmitPostEdit: () => Promise<void>;
  readonly onSubmitCommentEdit: () => Promise<void>;
  readonly onStartPostEdit: () => void;
  readonly onCancelPostEdit: () => void;
  readonly onDeletePost: () => Promise<void>;
  readonly onStartCommentEdit: (commentId: string) => void;
  readonly onCancelCommentEdit: () => void;
  readonly onDeleteComment: (commentId: string) => Promise<void>;
  readonly onToggleLike: () => Promise<void>;
}

interface TrendAnalysisPanelProps {
  readonly summary: TrendAnalysisSummaryViewModel | null;
  readonly syncMessage: string | null;
  readonly syncStatus: TrendAnalysisSyncStatus;
}

interface RecommendedNewsPanelProps {
  readonly batchSummary: NewsSummaryViewModel | null;
  readonly bookmarkedNewsIds: readonly string[];
  readonly isSummarizingBatch: boolean;
  readonly recommendation: NewsRecommendationViewModel | null;
  readonly summariesByArticleId: Readonly<Record<string, NewsSummaryViewModel>>;
  readonly syncMessage: string | null;
  readonly syncStatus: NewsSyncStatus;
  readonly summarizingNewsId: string | null;
  readonly onRefreshNews: () => Promise<void>;
  readonly onSummarizeBatch: () => Promise<void>;
  readonly onSummarizeNews: (newsId: string) => Promise<void>;
  readonly onToggleBookmark: (newsId: string) => Promise<void>;
}

interface RecommendedNewsCardProps {
  readonly article: RecommendedNewsArticleViewModel;
  readonly isBookmarked: boolean;
  readonly isSummarizing: boolean;
  readonly summary: NewsSummaryViewModel | null;
  readonly onSummarizeNews: (newsId: string) => Promise<void>;
  readonly onToggleBookmark: (newsId: string) => Promise<void>;
}

const communityBoardSectionOptions: readonly CommunityBoardSectionViewModel[] = [
  { id: "politics", label: "정치" },
  { id: "economy", label: "경제" },
  { id: "society", label: "사회" },
  { id: "it", label: "IT/과학" },
  { id: "global", label: "세계" },
  { id: "sports", label: "스포츠" },
  { id: "entertainment", label: "연예" },
];

export function HomeSection({ isActive }: HomeSectionProps) {
  return (
    <section className="page" data-active={isActive} id="home">
      <div className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="signal-dot" aria-hidden="true" />
            AI 기반 뉴스 트렌드 브리핑
          </span>
          <h1 className="hero-title">
            관심 키워드의 뉴스 흐름을 <span className="accent-text">한 화면에서</span>
          </h1>
          <p className="body-copy">
            키워드를 저장하고, 주요 뉴스와 요약, 커뮤니티 반응을 한곳에서 확인하세요.
          </p>
        </div>

        <article className="hero-card home-brief-card">
          <div className="hero-card-header">
            <div>
              <h2 className="card-title">오늘의 브리핑</h2>
              <p className="body-copy">관심사에 맞춘 뉴스 흐름을 정리합니다.</p>
            </div>
            <span className="badge">Personalized</span>
          </div>
          <div className="hero-card-body">
            <div className="home-step-list" aria-label="브리핑 흐름">
              <div className="home-step-item">
                <span>01</span>
                <strong>키워드</strong>
              </div>
              <div className="home-step-item">
                <span>02</span>
                <strong>뉴스</strong>
              </div>
              <div className="home-step-item">
                <span>03</span>
                <strong>요약</strong>
              </div>
            </div>
            <div className="home-card-note">
              <span className="signal-dot" aria-hidden="true" />
              <span>브리핑은 로그인 후 개인 키워드를 기준으로 준비됩니다.</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export function BriefingSection({
  batchNewsSummary,
  bookmarkedNewsIds,
  isSummarizingNewsBatch,
  isActive,
  newsRecommendation,
  newsSummariesByArticleId,
  newsSyncMessage,
  newsSyncStatus,
  onRefreshNews,
  onSummarizeNewsBatch,
  onSummarizeNews,
  onToggleNewsBookmark,
  summarizingNewsId,
  trendAnalysisSummary,
  trendAnalysisSyncMessage,
  trendAnalysisSyncStatus,
}: BriefingSectionProps) {
  return (
    <section className="page" data-active={isActive} id="briefing">
      <div className="section-heading">
        <h2 className="section-title">AI 브리핑</h2>
        <p className="body-copy">관심 키워드의 흐름과 추천 뉴스를 확인하세요.</p>
      </div>

      <TrendAnalysisPanel
        summary={trendAnalysisSummary}
        syncMessage={trendAnalysisSyncMessage}
        syncStatus={trendAnalysisSyncStatus}
      />

      <RecommendedNewsPanel
        batchSummary={batchNewsSummary}
        bookmarkedNewsIds={bookmarkedNewsIds}
        isSummarizingBatch={isSummarizingNewsBatch}
        recommendation={newsRecommendation}
        summariesByArticleId={newsSummariesByArticleId}
        summarizingNewsId={summarizingNewsId}
        syncMessage={newsSyncMessage}
        syncStatus={newsSyncStatus}
        onRefreshNews={onRefreshNews}
        onSummarizeBatch={onSummarizeNewsBatch}
        onSummarizeNews={onSummarizeNews}
        onToggleBookmark={onToggleNewsBookmark}
      />
    </section>
  );
}

export function DashboardSection({
  dashboard,
  isActive,
  onRefreshDashboard,
  syncMessage,
  syncStatus,
}: DashboardSectionProps) {
  const maxDailyCount = Math.max(
    1,
    ...(dashboard?.dailyNewsCounts.map((item) => item.count) ?? [0]),
  );

  return (
    <section className="page" data-active={isActive} id="dashboard">
      <div className="section-toolbar">
        <div className="section-heading !mb-0">
          <h2 className="section-title">뉴스 대시보드</h2>
          <p className="body-copy">
            back-docs의 뉴스 분석 API 응답을 기준으로 키워드별 흐름을 확인합니다.
          </p>
        </div>
        <Button
          disabled={syncStatus === "loading" || syncStatus === "saving"}
          variant="primary"
          onClick={() => void onRefreshDashboard()}
        >
          {syncStatus === "loading" ? "새로고침 중" : "대시보드 새로고침"}
        </Button>
      </div>

      {syncMessage !== null ? (
        <p className="sync-message dashboard-sync-message" data-state={syncStatus}>
          {syncMessage}
        </p>
      ) : null}

      {syncStatus === "loading" && dashboard === null ? (
        <div className="empty-briefing">
          <span className="badge">준비 중</span>
          <h3 className="card-title mt-5">뉴스 대시보드를 불러오는 중입니다</h3>
        </div>
      ) : dashboard === null ? (
        <div className="empty-briefing">
          <span className="badge">API 응답 없음</span>
          <h3 className="card-title mt-5">표시할 대시보드 데이터가 없습니다</h3>
        </div>
      ) : (
        <div className="dashboard-layout">
          <article className="card dashboard-card dashboard-card-wide">
            <div className="dashboard-card-heading">
              <div>
                <span className="badge">Keyword briefings</span>
                <h3 className="card-title">키워드별 뉴스 브리핑</h3>
              </div>
              <span className="muted">
                {dashboard.keywordBriefing.date} · 기사 {dashboard.keywordBriefing.totalCollectedCount}
              </span>
            </div>

            {dashboard.keywordBriefing.summaries.length === 0 ? (
              <p className="body-copy">등록된 활성 키워드의 브리핑이 없습니다.</p>
            ) : (
              <div className="keyword-briefing-grid">
                {dashboard.keywordBriefing.summaries.map((group) => (
                  <section className="keyword-briefing-card" key={group.keyword}>
                    <div className="recommended-news-meta">
                      <span className="badge">{group.keyword}</span>
                      <span>기사 {group.collectedCount}</span>
                    </div>
                    <p>{group.summary}</p>
                    {group.articles.length > 0 ? (
                      <div className="summary-source-list">
                        {group.articles.map((article) => (
                          <a
                            href={article.originUrl}
                            key={`${group.keyword}-${article.originUrl}`}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {article.title} · {article.publishedAtLabel}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </section>
                ))}
              </div>
            )}
          </article>

          <article className="card dashboard-card">
            <div className="dashboard-card-heading">
              <div>
                <span className="badge">Frequency</span>
                <h3 className="card-title">자주 나오는 키워드</h3>
              </div>
              <span className="muted">기사 {dashboard.keywordFrequency.articleCount}</span>
            </div>
            {dashboard.keywordFrequency.keywords.length === 0 ? (
              <p className="body-copy">분석할 뉴스 데이터가 없습니다.</p>
            ) : (
              <div className="frequency-list">
                {dashboard.keywordFrequency.keywords.map((item) => (
                  <div className="frequency-row" key={item.keyword}>
                    <div className="frequency-row-header">
                      <strong>{item.keyword}</strong>
                      <span>{item.count}</span>
                    </div>
                    <div className="bar-track" aria-hidden="true">
                      <span style={{ width: `${Math.min(100, item.weight)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="card dashboard-card">
            <div className="dashboard-card-heading">
              <div>
                <span className="badge">Trend scores</span>
                <h3 className="card-title">키워드별 트렌드 점수</h3>
              </div>
            </div>
            {dashboard.trendScores.length === 0 ? (
              <p className="body-copy">트렌드 점수 응답이 없습니다.</p>
            ) : (
              <div className="dashboard-mini-grid">
                {dashboard.trendScores.map((trend) => (
                  <div className="trend-score-tile" key={trend.keywordId}>
                    <strong>{trend.trendScoreLabel}</strong>
                    <span>{trend.keyword}</span>
                    <small>기사 {trend.articleCount}</small>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="card dashboard-card">
            <div className="dashboard-card-heading">
              <div>
                <span className="badge">Today</span>
                <h3 className="card-title">오늘의 핵심 이슈</h3>
              </div>
            </div>
            {dashboard.todayIssues.issues.length === 0 ? (
              <p className="body-copy">오늘의 핵심 이슈가 없습니다.</p>
            ) : (
              <ol className="issue-list">
                {dashboard.todayIssues.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ol>
            )}
          </article>

          <article className="card dashboard-card">
            <div className="dashboard-card-heading">
              <div>
                <span className="badge">Suggested</span>
                <h3 className="card-title">추천 키워드</h3>
              </div>
            </div>
            {dashboard.suggestedKeywords.length === 0 ? (
              <p className="body-copy">추천 키워드가 없습니다.</p>
            ) : (
              <div className="chip-row">
                {dashboard.suggestedKeywords.map((keyword) => (
                  <span className="chip" key={keyword.keyword}>
                    {keyword.keyword} · {keyword.count}
                  </span>
                ))}
              </div>
            )}
          </article>

          <article className="card dashboard-card">
            <div className="dashboard-card-heading">
              <div>
                <span className="badge">Daily counts</span>
                <h3 className="card-title">일자별 뉴스 수</h3>
              </div>
            </div>
            {dashboard.dailyNewsCounts.length === 0 ? (
              <p className="body-copy">일자별 뉴스 수가 없습니다.</p>
            ) : (
              <div className="daily-count-list">
                {dashboard.dailyNewsCounts.map((item) => (
                  <div className="daily-count-row" key={item.date}>
                    <span>{item.date}</span>
                    <div className="bar-track" aria-hidden="true">
                      <span style={{ width: `${(item.count / maxDailyCount) * 100}%` }} />
                    </div>
                    <strong>{item.count}</strong>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="card dashboard-card dashboard-card-wide">
            <div className="dashboard-card-heading">
              <div>
                <span className="badge">Clusters</span>
                <h3 className="card-title">뉴스 클러스터</h3>
              </div>
            </div>
            {dashboard.clusters.length === 0 ? (
              <p className="body-copy">뉴스 클러스터가 없습니다.</p>
            ) : (
              <div className="cluster-grid">
                {dashboard.clusters.map((cluster) => (
                  <ClusterCard cluster={cluster} key={cluster.topic} />
                ))}
              </div>
            )}
          </article>

          <article className="card dashboard-card">
            <div className="dashboard-card-heading">
              <div>
                <span className="badge">Sentiment</span>
                <h3 className="card-title">감성/리스크</h3>
              </div>
            </div>
            {dashboard.sentiments.length === 0 ? (
              <p className="body-copy">감성 분석 응답이 없습니다.</p>
            ) : (
              <div className="sentiment-list">
                {dashboard.sentiments.map((item) => (
                  <div className="sentiment-row" key={item.keywordId}>
                    <div>
                      <strong>{item.keyword}</strong>
                      <p>{item.reason}</p>
                    </div>
                    <span className="badge" data-sentiment={item.sentiment}>
                      {getSentimentLabel(item.sentiment)}
                    </span>
                    <span className="badge badge-muted" data-risk={item.riskLevel}>
                      {getRiskLevelLabel(item.riskLevel)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="card dashboard-card">
            <div className="dashboard-card-heading">
              <div>
                <span className="badge">Bookmarks</span>
                <h3 className="card-title">저장한 뉴스</h3>
              </div>
            </div>
            <BookmarkList bookmarks={dashboard.bookmarks} />
          </article>
        </div>
      )}
    </section>
  );
}

export function OnboardingSection({
  canSubmitKeywords,
  isActive,
  keywordDraft,
  onAddCustomKeyword,
  onKeywordDraftChange,
  onNavigate,
  onSkipKeywords,
  onStartLogin,
  onToggleKeyword,
  selectedKeywordNames,
}: OnboardingSectionProps) {
  function submitCustomKeyword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAddCustomKeyword();
  }

  return (
    <section className="page" data-active={isActive} id="onboarding">
      <div className="onboarding-hero">
        <div className="section-heading !mb-0">
          <span className="eyebrow">
            <span className="signal-dot" aria-hidden="true" />
            First briefing
          </span>
          <h2 className="section-title">첫 브리핑 키워드</h2>
          <p className="body-copy">관심 키워드를 입력해 첫 브리핑을 준비하세요.</p>
        </div>
        <Button variant="ghost" onClick={() => onNavigate("home")}>
          돌아가기
        </Button>
      </div>

      <div className="onboarding-layout">
        <article className="onboarding-panel">
          <h3 className="card-title">키워드 입력</h3>
          <form className="input-row" onSubmit={submitCustomKeyword}>
            <input
              className="input"
              placeholder="예: 반도체"
              type="text"
              value={keywordDraft}
              onChange={(event) => onKeywordDraftChange(event.target.value)}
            />
            <Button type="submit" variant="ghost">
              추가
            </Button>
          </form>
        </article>

        <aside className="onboarding-summary">
          <span className="badge">선택 {selectedKeywordNames.length}</span>
          <h3 className="card-title">저장될 키워드</h3>
          <div className="selected-keyword-list">
            {selectedKeywordNames.length === 0 ? (
              <span className="muted">선택된 키워드가 없습니다.</span>
            ) : (
              selectedKeywordNames.map((keywordName) => (
                <button
                  className="selected-keyword-chip"
                  key={keywordName}
                  type="button"
                  onClick={() => onToggleKeyword(keywordName)}
                >
                  {keywordName}
                </button>
              ))
            )}
          </div>
          <div className="onboarding-actions">
            <Button
              disabled={!canSubmitKeywords}
              variant="primary"
              onClick={() => void onStartLogin()}
            >
              선택한 키워드 저장
            </Button>
            <Button variant="ghost" onClick={onSkipKeywords}>
              나중에 설정
            </Button>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function MyPageSection({
  currentUser,
  isActive,
  keywordDraft,
  keywordSyncMessage,
  keywordSyncStatus,
  keywords,
  onAddKeyword,
  onKeywordDraftChange,
}: MyPageSectionProps) {
  function submitKeyword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onAddKeyword();
  }

  return (
    <section className="page" data-active={isActive} id="mypage">
      <div className="section-heading">
        <h2 className="section-title">마이페이지</h2>
        <p className="body-copy">AI 브리핑으로 받을 키워드를 등록하고 관리합니다.</p>
      </div>

      <article className="card manage-card">
        <h3 className="card-title">내 키워드 관리</h3>
        <div className="account-strip">
          {currentUser === null ? (
            <span className="muted">로그인이 필요합니다.</span>
          ) : (
            <>
              <strong>{currentUser.name}</strong>
              <span className="muted">{currentUser.email}</span>
            </>
          )}
        </div>
        <form className="input-row" onSubmit={submitKeyword}>
          <input
            className="input"
            placeholder="새 키워드 입력"
            type="text"
            value={keywordDraft}
            onChange={(event) => onKeywordDraftChange(event.target.value)}
          />
          <Button disabled={keywordSyncStatus === "saving"} type="submit" variant="primary">
            {keywordSyncStatus === "saving" ? "등록 중" : "등록"}
          </Button>
        </form>

        {keywordSyncMessage !== null ? (
          <p className="sync-message" data-state={keywordSyncStatus}>
            {keywordSyncMessage}
          </p>
        ) : null}

        <div className="keyword-list">
          {keywords.length === 0 ? (
            <div className="keyword-row">
              <span className="muted">등록된 키워드가 없습니다.</span>
            </div>
          ) : (
            keywords.map((keyword) => (
              <div className="keyword-row" key={keyword.id}>
                <strong>{keyword.label}</strong>
                <span className="keyword-state">
                  {keywordSyncStatus === "ready" ? "저장됨" : "처리 중"}
                </span>
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
}

export function CommunitySection({
  activeBoardSectionId,
  allBoardPosts,
  boardPosts,
  boardSections,
  isActive,
  syncMessage,
  syncStatus,
  onBoardSectionChange,
  onNavigate,
  onOpenPost,
}: CommunitySectionProps) {
  const boardSectionLabelById = new Map(
    boardSections.map((section) => [section.id, section.label]),
  );
  const activeBoardSection =
    activeBoardSectionId === "all"
      ? null
      : boardSections.find((section) => section.id === activeBoardSectionId) ?? null;
  const postCountsBySection = new Map(
    boardSections.map((section) => [
      section.id,
      allBoardPosts.filter((post) => post.boardSectionId === section.id).length,
    ]),
  );
  const totalCommentCount = allBoardPosts.reduce((total, post) => total + post.commentCount, 0);
  const featuredPost =
    [...boardPosts].sort((firstPost, secondPost) => secondPost.commentCount - firstPost.commentCount)[0] ??
    null;

  return (
    <section className="page" data-active={isActive} id="community">
      <div className="community-hero">
        <div className="community-hero-copy">
          <span className="eyebrow">
            <span className="signal-dot" aria-hidden="true" />
            TrendScope Community
          </span>
          <h2 className="section-title">커뮤니티</h2>
          <p className="body-copy">분야별 이슈를 빠르게 훑고, 관심 있는 흐름에 의견을 남깁니다.</p>
        </div>

        <div className="community-hero-actions">
          <div className="community-stat">
            <strong>{allBoardPosts.length}</strong>
            <span>게시글</span>
          </div>
          <div className="community-stat">
            <strong>{totalCommentCount}</strong>
            <span>댓글</span>
          </div>
          <Button variant="primary" onClick={() => onNavigate("writePost")}>
            글쓰기
          </Button>
        </div>
      </div>

      {syncMessage !== null ? (
        <p className="sync-message community-sync-message" data-state={syncStatus}>
          {syncMessage}
        </p>
      ) : null}

      <div className="community-layout">
        <aside className="community-board-panel">
          <div className="community-panel-heading">
            <h3 className="card-title">게시판</h3>
            <span className="muted">{boardSections.length}개 섹션</span>
          </div>
          <div className="board-filter" aria-label="커뮤니티 게시판 섹션">
            <button
              className="board-filter-tab"
              data-active={activeBoardSectionId === "all"}
              type="button"
              onClick={() => onBoardSectionChange("all")}
            >
              <span>전체</span>
              <small>{allBoardPosts.length}</small>
            </button>
            {boardSections.map((section) => (
              <button
                className="board-filter-tab"
                data-active={activeBoardSectionId === section.id}
                key={section.id}
                type="button"
                onClick={() => onBoardSectionChange(section.id)}
              >
                <span>{section.label}</span>
                <small>{postCountsBySection.get(section.id) ?? 0}</small>
              </button>
            ))}
          </div>
        </aside>

        <section className="discussion-panel">
          <div className="discussion-panel-header">
            <div>
              <span className="badge">{activeBoardSection?.label ?? "전체"}</span>
              <h3 className="discussion-title">{activeBoardSection?.label ?? "전체 게시글"}</h3>
            </div>
            <span className="muted">{boardPosts.length}개 글</span>
          </div>

          {syncStatus === "loading" && allBoardPosts.length === 0 ? (
            <div className="community-empty">
              <h3 className="card-title">게시글을 준비하고 있습니다</h3>
            </div>
          ) : boardPosts.length === 0 ? (
            <div className="community-empty">
              <h3 className="card-title">아직 게시글이 없습니다</h3>
              <p className="body-copy">첫 게시글을 작성해 이 섹션의 흐름을 시작하세요.</p>
            </div>
          ) : (
            <div className="discussion-list">
              {boardPosts.map((post) => (
                <button
                  className="discussion-row"
                  key={post.id}
                  type="button"
                  onClick={() => onOpenPost(post.id)}
                >
                  <span className="discussion-board">
                    {boardSectionLabelById.get(post.boardSectionId)}
                  </span>
                  <span className="discussion-main">
                    <span className="discussion-meta">
                      <span>{post.author}</span>
                      <span>조회 {post.viewCount}</span>
                      <span>좋아요 {post.likeCount}</span>
                      <span>{post.createdAt}</span>
                    </span>
                    <strong>{post.title}</strong>
                  </span>
                  <span className="discussion-comments">
                    <strong>{post.commentCount}</strong>
                    <span>댓글</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <aside className="community-side-panel">
          <h3 className="card-title">지금 많이 보는 글</h3>
          {featuredPost === null ? (
            <p className="body-copy">표시할 게시글이 없습니다.</p>
          ) : (
            <button
              className="featured-post"
              type="button"
              onClick={() => onOpenPost(featuredPost.id)}
            >
              <span className="badge badge-muted">
                {boardSectionLabelById.get(featuredPost.boardSectionId)}
              </span>
              <strong>{featuredPost.title}</strong>
              <span className="muted">
                {featuredPost.author} · 댓글 {featuredPost.commentCount} · 좋아요{" "}
                {featuredPost.likeCount}
              </span>
            </button>
          )}
        </aside>
      </div>
    </section>
  );
}

export function WritePostSection({
  boardSections,
  canSubmitPostDraft,
  isActive,
  onDraftFieldChange,
  onNavigate,
  onSubmitPostDraft,
  postDraft,
}: WritePostSectionProps) {
  function submitPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmitPostDraft();
  }

  const selectedBoardSection =
    boardSections.find((section) => section.id === postDraft.boardSectionId) ?? null;

  return (
    <section className="page" data-active={isActive} id="write-post">
      <div className="write-hero">
        <div className="section-heading !mb-0">
          <h2 className="section-title">게시글 작성</h2>
          <p className="body-copy">관심 이슈를 정리해 분야별 게시판에 공유합니다.</p>
        </div>
        <Button variant="ghost" onClick={() => onNavigate("community")}>
          목록으로
        </Button>
      </div>

      <div className="write-post-layout">
        <article className="write-post-card">
          <form className="stack" onSubmit={submitPost}>
            <div className="form-grid">
              <label className="field">
                <span>게시판</span>
                <select
                  className="input"
                  value={postDraft.boardSectionId}
                  onChange={(event) => onDraftFieldChange("boardSectionId", event.target.value)}
                >
                  {boardSections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field">
              <span>제목</span>
              <input
                className="input"
                placeholder="제목"
                type="text"
                value={postDraft.title}
                onChange={(event) => onDraftFieldChange("title", event.target.value)}
              />
            </label>

            <label className="field">
              <span>내용</span>
              <textarea
                className="textarea textarea-large"
                placeholder="내용을 입력하세요"
                value={postDraft.body}
                onChange={(event) => onDraftFieldChange("body", event.target.value)}
              />
            </label>

            <div className="form-actions">
              <Button variant="ghost" onClick={() => onNavigate("community")}>
                취소
              </Button>
              <Button disabled={!canSubmitPostDraft} type="submit" variant="primary">
                게시글 등록
              </Button>
            </div>
          </form>
        </article>

        <aside className="post-preview">
          <span className="badge">{selectedBoardSection?.label ?? "게시판"}</span>
          <h3>{postDraft.title.trim() || "제목 미리보기"}</h3>
          <p>{postDraft.body.trim() || "작성 중인 내용이 여기에 표시됩니다."}</p>
        </aside>
      </div>
    </section>
  );
}

export function PostSection({
  canSubmitComment,
  canSubmitCommentEdit,
  canSubmitPostEdit,
  commentDraft,
  commentEditDraft,
  editingCommentId,
  isActive,
  isEditingPost,
  onCancelCommentEdit,
  onCancelPostEdit,
  onCommentDraftChange,
  onCommentEditDraftChange,
  onDeleteComment,
  onDeletePost,
  onEditDraftFieldChange,
  onNavigate,
  onStartCommentEdit,
  onStartPostEdit,
  onSubmitComment,
  onSubmitCommentEdit,
  onSubmitPostEdit,
  onToggleLike,
  post,
  postEditDraft,
  syncMessage,
  syncStatus,
}: PostSectionProps) {
  function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmitComment();
  }

  function submitPostEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmitPostEdit();
  }

  function submitCommentEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmitCommentEdit();
  }

  if (post === null) {
    return (
      <section className="page" data-active={isActive} id="post">
        <Button variant="ghost" onClick={() => onNavigate("community")}>
          목록으로
        </Button>
        {syncStatus === "loading" ? (
          <div className="post-empty">
            <h2 className="section-title">게시글을 불러오는 중입니다</h2>
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="page" data-active={isActive} id="post">
      <div className="post-detail-shell">
        <Button variant="ghost" onClick={() => onNavigate("community")}>
          목록으로
        </Button>

        <article className="post-detail">
          {isEditingPost ? (
            <form className="stack" onSubmit={submitPostEdit}>
              <div className="form-grid">
                <label className="field">
                  <span>게시판</span>
                  <select
                    className="input"
                    value={postEditDraft.boardSectionId}
                    onChange={(event) =>
                      onEditDraftFieldChange("boardSectionId", event.target.value)
                    }
                  >
                    {communityBoardSectionOptions.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="field">
                <span>제목</span>
                <input
                  className="input"
                  type="text"
                  value={postEditDraft.title}
                  onChange={(event) => onEditDraftFieldChange("title", event.target.value)}
                />
              </label>

              <label className="field">
                <span>내용</span>
                <textarea
                  className="textarea textarea-large"
                  value={postEditDraft.body}
                  onChange={(event) => onEditDraftFieldChange("body", event.target.value)}
                />
              </label>

              <div className="form-actions">
                <Button variant="ghost" onClick={onCancelPostEdit}>
                  취소
                </Button>
                <Button disabled={!canSubmitPostEdit} type="submit" variant="primary">
                  수정 저장
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="post-detail-header">
                <span className="badge">{post.category}</span>
                <h2 className="section-title">{post.title}</h2>
                <p className="muted">
                  {post.author} · 조회 {post.viewCount} · 댓글 {post.commentCount} ·{" "}
                  {post.createdAt}
                </p>
                <div className="post-action-row">
                  <Button
                    variant={post.likedByMe ? "primary" : "ghost"}
                    onClick={() => void onToggleLike()}
                  >
                    좋아요 {post.likeCount}
                  </Button>
                  {post.isMine ? (
                    <>
                      <Button variant="ghost" onClick={onStartPostEdit}>
                        수정
                      </Button>
                      <Button variant="danger" onClick={() => void onDeletePost()}>
                        삭제
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
              <p className="post-body">{post.body}</p>
            </>
          )}
        </article>

        <section className="comment-panel">
          <div className="comment-panel-heading">
            <h3 className="card-title">댓글</h3>
            <span className="muted">{post.comments.length}개</span>
          </div>
          {syncMessage !== null ? (
            <p className="sync-message" data-state={syncStatus}>
              {syncMessage}
            </p>
          ) : null}
          <form className="comment-form" onSubmit={submitComment}>
            <textarea
              className="textarea"
              placeholder="댓글을 입력하세요"
              value={commentDraft}
              onChange={(event) => onCommentDraftChange(event.target.value)}
            />
            <div className="form-actions">
              <Button disabled={!canSubmitComment} type="submit" variant="primary">
                댓글 등록
              </Button>
            </div>
          </form>
          <div className="comment-list">
            {post.comments.length === 0 ? (
              <div className="comment-empty">아직 댓글이 없습니다.</div>
            ) : (
              post.comments.map((comment) => (
                <article className="comment-item" key={comment.id}>
                  {editingCommentId === comment.id ? (
                    <form className="comment-form" onSubmit={submitCommentEdit}>
                      <textarea
                        className="textarea"
                        value={commentEditDraft}
                        onChange={(event) => onCommentEditDraftChange(event.target.value)}
                      />
                      <div className="form-actions">
                        <Button variant="ghost" onClick={onCancelCommentEdit}>
                          취소
                        </Button>
                        <Button
                          disabled={!canSubmitCommentEdit}
                          type="submit"
                          variant="primary"
                        >
                          댓글 수정
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="comment-meta">
                        <strong>{comment.author}</strong>
                        <span>{comment.createdAt}</span>
                      </div>
                      <p>{comment.body}</p>
                      {comment.isMine ? (
                        <div className="comment-actions">
                          <Button variant="ghost" onClick={() => onStartCommentEdit(comment.id)}>
                            수정
                          </Button>
                          <Button variant="danger" onClick={() => void onDeleteComment(comment.id)}>
                            삭제
                          </Button>
                        </div>
                      ) : null}
                    </>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

function ClusterCard({ cluster }: { readonly cluster: NewsClusterViewModel }) {
  return (
    <section className="cluster-card">
      <div className="recommended-news-meta">
        <span className="badge">{cluster.topic}</span>
        <span>기사 {cluster.articleCount}</span>
      </div>
      {cluster.articles.length === 0 ? (
        <p className="body-copy">표시할 기사가 없습니다.</p>
      ) : (
        <div className="summary-source-list">
          {cluster.articles.map((article) => (
            <a
              href={article.originUrl}
              key={`${cluster.topic}-${article.originUrl}`}
              rel="noreferrer"
              target="_blank"
            >
              {article.title} · {article.publishedAtLabel}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

function BookmarkList({ bookmarks }: { readonly bookmarks: readonly NewsBookmarkViewModel[] }) {
  if (bookmarks.length === 0) {
    return <p className="body-copy">저장한 뉴스가 없습니다.</p>;
  }

  return (
    <div className="bookmark-list">
      {bookmarks.map((bookmark) => (
        <a
          className="bookmark-row"
          href={bookmark.originUrl}
          key={bookmark.bookmarkId}
          rel="noreferrer"
          target="_blank"
        >
          <strong>{bookmark.title}</strong>
          <span>{bookmark.publishedAtLabel}</span>
        </a>
      ))}
    </div>
  );
}

function getSentimentLabel(sentiment: NewsSentiment): string {
  if (sentiment === "POSITIVE") {
    return "긍정";
  }

  if (sentiment === "NEGATIVE") {
    return "부정";
  }

  return "중립";
}

function getRiskLevelLabel(riskLevel: NewsRiskLevel): string {
  if (riskLevel === "HIGH") {
    return "위험 높음";
  }

  if (riskLevel === "MEDIUM") {
    return "위험 보통";
  }

  return "위험 낮음";
}

function TrendAnalysisPanel({ summary, syncMessage, syncStatus }: TrendAnalysisPanelProps) {
  return (
    <article className="card trend-analysis-card">
      <div>
        <span className="badge">트렌드 점수</span>
        <h3 className="card-title">브리핑 지표</h3>
      </div>

      {syncMessage !== null ? (
        <p className="sync-message" data-state={syncStatus}>
          {syncMessage}
        </p>
      ) : null}

      {syncStatus === "loading" ? (
        <p className="body-copy">분석 결과를 준비하고 있습니다.</p>
      ) : summary === null ? (
        <p className="body-copy">아직 표시할 지표가 없습니다.</p>
      ) : (
        <div className="trend-analysis-score">
          <strong>{summary.trendScoreLabel}</strong>
          <span>평균 트렌드 점수</span>
        </div>
      )}
    </article>
  );
}

function RecommendedNewsPanel({
  batchSummary,
  bookmarkedNewsIds,
  isSummarizingBatch,
  recommendation,
  summariesByArticleId,
  summarizingNewsId,
  syncMessage,
  syncStatus,
  onRefreshNews,
  onSummarizeBatch,
  onSummarizeNews,
  onToggleBookmark,
}: RecommendedNewsPanelProps) {
  const articles = recommendation?.articles ?? [];
  const keywords = recommendation?.keywords ?? [];
  const isRecommendationLoading = syncStatus === "loading";
  const isRefreshing = syncStatus === "refreshing";

  return (
    <section className="news-recommendation-section mt-5">
      <div className="section-toolbar">
        <div>
          <span className="badge">추천 뉴스</span>
          <h3 className="section-subtitle">내 키워드 추천 뉴스</h3>
          <p className="body-copy">관심 키워드와 맞닿은 기사 목록입니다.</p>
        </div>
        <Button
          disabled={isRecommendationLoading || isRefreshing}
          variant="primary"
          onClick={() => void onRefreshNews()}
        >
          {isRefreshing ? "수집 중" : "최신 뉴스 가져오기"}
        </Button>
        <Button
          disabled={articles.length === 0 || isSummarizingBatch}
          variant="ghost"
          onClick={() => void onSummarizeBatch()}
        >
          {isSummarizingBatch ? "묶음 요약 중" : "추천 뉴스 묶음 요약"}
        </Button>
      </div>

      {syncMessage !== null ? (
        <p className="sync-message news-sync-message" data-state={syncStatus}>
          {syncMessage}
        </p>
      ) : null}

      {keywords.length > 0 ? (
        <div className="chip-row news-keyword-row" aria-label="추천 기준 키워드">
          {keywords.map((keyword) => (
            <span className="chip" key={keyword.id}>
              {keyword.label}
            </span>
          ))}
        </div>
      ) : null}

      {batchSummary !== null ? (
        <div className="news-summary-box batch-summary-box">
          <h5>추천 뉴스 묶음 요약</h5>
          <p>{batchSummary.summary}</p>
          <div className="summary-source-list">
            {batchSummary.sources.map((source) => (
              <a
                href={source.originUrl}
                key={source.id}
                rel="noreferrer"
                target="_blank"
              >
                {source.title}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {isRecommendationLoading && articles.length === 0 ? (
        <div className="empty-briefing">
          <span className="badge">준비 중</span>
          <h3 className="card-title mt-5">추천 뉴스를 불러오는 중입니다</h3>
        </div>
      ) : recommendation === null ? (
        <div className="empty-briefing">
          <span className="badge">로그인 필요</span>
          <h3 className="card-title mt-5">브리핑을 보려면 로그인하세요</h3>
        </div>
      ) : keywords.length === 0 ? (
        <div className="empty-briefing">
          <span className="badge">키워드 없음</span>
          <h3 className="card-title mt-5">등록된 키워드가 없습니다</h3>
          <p className="body-copy">마이페이지에서 키워드를 추가하세요.</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="empty-briefing">
          <span className="badge">뉴스 없음</span>
          <h3 className="card-title mt-5">아직 추천 뉴스가 없습니다</h3>
          <p className="body-copy">새 소식을 불러와 보세요.</p>
        </div>
      ) : (
        <div className="recommended-news-list">
          {articles.map((article) => (
            <RecommendedNewsCard
              article={article}
              isBookmarked={bookmarkedNewsIds.includes(article.id)}
              isSummarizing={summarizingNewsId === article.id}
              key={article.id}
              summary={summariesByArticleId[article.id] ?? null}
              onSummarizeNews={onSummarizeNews}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function RecommendedNewsCard({
  article,
  isBookmarked,
  isSummarizing,
  summary,
  onSummarizeNews,
  onToggleBookmark,
}: RecommendedNewsCardProps) {
  return (
    <article className="recommended-news-card">
      <div className="recommended-news-meta">
        <span className="badge">{article.matchedKeyword}</span>
        <span>{article.publishedAtLabel}</span>
      </div>
      <h4 className="recommended-news-title">{article.title}</h4>
      {article.description !== null && article.description.trim().length > 0 ? (
        <p className="body-copy recommended-news-description">{article.description}</p>
      ) : null}
      <p className="recommended-news-reason">{article.recommendationReason}</p>

      <div className="recommended-news-actions">
        <a
          className="button button-ghost"
          href={article.originUrl}
          rel="noreferrer"
          target="_blank"
        >
          원문 열기
        </a>
        <Button variant="ghost" onClick={() => void onToggleBookmark(article.id)}>
          {isBookmarked ? "저장 취소" : "뉴스 저장"}
        </Button>
        <Button
          disabled={isSummarizing}
          variant="primary"
          onClick={() => void onSummarizeNews(article.id)}
        >
          {isSummarizing ? "요약 중" : "AI 요약"}
        </Button>
      </div>

      {summary !== null ? (
        <div className="news-summary-box">
          <h5>요약</h5>
          <p>{summary.summary}</p>
          <div className="summary-source-list">
            {summary.sources.map((source) => (
              <a
                href={source.originUrl}
                key={source.id}
                rel="noreferrer"
                target="_blank"
              >
                {source.title}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
