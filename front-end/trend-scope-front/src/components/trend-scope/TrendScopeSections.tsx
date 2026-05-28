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
  readonly newsRecommendation: NewsRecommendationViewModel | null;
  readonly newsSummariesByArticleId: Readonly<Record<string, NewsSummaryViewModel>>;
  readonly newsSyncMessage: string | null;
  readonly newsSyncStatus: NewsSyncStatus;
  readonly summarizingNewsId: string | null;
  readonly trendAnalysisSummary: TrendAnalysisSummaryViewModel | null;
  readonly trendAnalysisSyncMessage: string | null;
  readonly trendAnalysisSyncStatus: TrendAnalysisSyncStatus;
  readonly onRefreshNews: () => Promise<void>;
  readonly onSummarizeNews: (newsId: string) => Promise<void>;
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
  readonly canSubmitComment: boolean;
  readonly commentDraft: string;
  readonly syncMessage: string | null;
  readonly syncStatus: CommunitySyncStatus;
  readonly onCommentDraftChange: (value: string) => void;
  readonly onNavigate: (section: TrendScopeSection) => void;
  readonly onSubmitComment: () => Promise<void>;
  readonly onToggleLike: () => Promise<void>;
}

interface TrendAnalysisPanelProps {
  readonly summary: TrendAnalysisSummaryViewModel | null;
  readonly syncMessage: string | null;
  readonly syncStatus: TrendAnalysisSyncStatus;
}

interface RecommendedNewsPanelProps {
  readonly recommendation: NewsRecommendationViewModel | null;
  readonly summariesByArticleId: Readonly<Record<string, NewsSummaryViewModel>>;
  readonly syncMessage: string | null;
  readonly syncStatus: NewsSyncStatus;
  readonly summarizingNewsId: string | null;
  readonly onRefreshNews: () => Promise<void>;
  readonly onSummarizeNews: (newsId: string) => Promise<void>;
}

interface RecommendedNewsCardProps {
  readonly article: RecommendedNewsArticleViewModel;
  readonly isSummarizing: boolean;
  readonly summary: NewsSummaryViewModel | null;
  readonly onSummarizeNews: (newsId: string) => Promise<void>;
}

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
  isActive,
  newsRecommendation,
  newsSummariesByArticleId,
  newsSyncMessage,
  newsSyncStatus,
  onRefreshNews,
  onSummarizeNews,
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
        recommendation={newsRecommendation}
        summariesByArticleId={newsSummariesByArticleId}
        summarizingNewsId={summarizingNewsId}
        syncMessage={newsSyncMessage}
        syncStatus={newsSyncStatus}
        onRefreshNews={onRefreshNews}
        onSummarizeNews={onSummarizeNews}
      />
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
  commentDraft,
  isActive,
  onCommentDraftChange,
  onNavigate,
  onSubmitComment,
  onToggleLike,
  post,
  syncMessage,
  syncStatus,
}: PostSectionProps) {
  function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmitComment();
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
          <div className="post-detail-header">
            <span className="badge">{post.category}</span>
            <h2 className="section-title">{post.title}</h2>
            <p className="muted">
              {post.author} · 조회 {post.viewCount} · 댓글 {post.commentCount} ·{" "}
              {post.createdAt}
            </p>
            <div className="post-action-row">
              <Button variant={post.likedByMe ? "primary" : "ghost"} onClick={() => void onToggleLike()}>
                좋아요 {post.likeCount}
              </Button>
            </div>
          </div>
          <p className="post-body">{post.body}</p>
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
                  <div className="comment-meta">
                    <strong>{comment.author}</strong>
                    <span>{comment.createdAt}</span>
                  </div>
                  <p>{comment.body}</p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </section>
  );
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
  recommendation,
  summariesByArticleId,
  summarizingNewsId,
  syncMessage,
  syncStatus,
  onRefreshNews,
  onSummarizeNews,
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
              isSummarizing={summarizingNewsId === article.id}
              key={article.id}
              summary={summariesByArticleId[article.id] ?? null}
              onSummarizeNews={onSummarizeNews}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function RecommendedNewsCard({
  article,
  isSummarizing,
  summary,
  onSummarizeNews,
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
