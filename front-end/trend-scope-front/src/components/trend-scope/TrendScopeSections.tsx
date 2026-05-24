import type { FormEvent } from "react";
import { Button } from "@/src/components/ui/Button";
import type {
  BoardPostViewModel,
  BriefingViewModel,
  CommunityBoardFilterId,
  CommunityBoardSectionViewModel,
  CommunityPostDraftViewModel,
  KeywordSearchBriefingViewModel,
  KeywordViewModel,
  MetricViewModel,
  NewsArticleViewModel,
  RelatedKeywordViewModel,
  TrendPointViewModel,
  TrendScopeSection,
  WordFrequencyViewModel,
} from "@/src/types/trend";
import {
  RelatedKeywordMap,
  SignalMapVisual,
  TrendBarChart,
  WordCloud,
} from "./TrendScopeVisuals";

interface HomeSectionProps {
  readonly isActive: boolean;
  readonly featureChips: readonly string[];
  readonly metrics: readonly MetricViewModel[];
  readonly searchDraft: string;
  readonly onNavigate: (section: TrendScopeSection) => void;
  readonly onSearchDraftChange: (value: string) => void;
  readonly onRequestKeywordSearch: () => void;
}

interface BriefingSectionProps {
  readonly isActive: boolean;
  readonly briefing: BriefingViewModel;
}

interface SearchSectionProps {
  readonly isActive: boolean;
  readonly searchDraft: string;
  readonly searchBriefing: KeywordSearchBriefingViewModel | null;
  readonly onSearchDraftChange: (value: string) => void;
  readonly onRequestKeywordSearch: () => void;
}

interface MyPageSectionProps {
  readonly isActive: boolean;
  readonly keywords: readonly KeywordViewModel[];
  readonly keywordDraft: string;
  readonly onKeywordDraftChange: (value: string) => void;
  readonly onAddKeyword: () => void;
  readonly onEditKeyword: (keywordId: string) => void;
  readonly onDeleteKeyword: (keywordId: string) => void;
}

interface CommunitySectionProps {
  readonly isActive: boolean;
  readonly activeBoardSectionId: CommunityBoardFilterId;
  readonly boardSections: readonly CommunityBoardSectionViewModel[];
  readonly allBoardPosts: readonly BoardPostViewModel[];
  readonly boardPosts: readonly BoardPostViewModel[];
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
  readonly onSubmitPostDraft: () => void;
  readonly onNavigate: (section: TrendScopeSection) => void;
}

interface PostSectionProps {
  readonly isActive: boolean;
  readonly post: BoardPostViewModel | null;
  readonly onNavigate: (section: TrendScopeSection) => void;
}

interface BriefingContentProps {
  readonly briefing: BriefingViewModel;
}

interface NewsListProps {
  readonly newsArticles: readonly NewsArticleViewModel[];
}

interface VisualGridProps {
  readonly trendPoints: readonly TrendPointViewModel[];
  readonly wordFrequencies: readonly WordFrequencyViewModel[];
  readonly relatedKeywords: readonly RelatedKeywordViewModel[];
}

export function HomeSection({
  featureChips,
  isActive,
  metrics,
  onNavigate,
  onRequestKeywordSearch,
  onSearchDraftChange,
  searchDraft,
}: HomeSectionProps) {
  return (
    <section className="page" data-active={isActive} id="home">
      <div className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="signal-dot" aria-hidden="true" />
            AI 기반 뉴스 트렌드 브리핑
          </span>
          <h1 className="hero-title">
            인터넷에서 지금 가장 <span className="accent-text">뜨거운 이슈</span>를 한눈에
          </h1>
          <p className="body-copy">
            관심 키워드를 등록하면 뉴스 흐름을 분석하고, 핵심 이슈와 관련 기사를 브리핑
            화면에서 빠르게 확인할 수 있습니다.
          </p>

          <form
            className="input-row"
            onSubmit={(event) => {
              event.preventDefault();
              onRequestKeywordSearch();
              onNavigate("search");
            }}
          >
            <input
              className="input"
              placeholder="관심 키워드를 입력하세요"
              type="text"
              value={searchDraft}
              onChange={(event) => onSearchDraftChange(event.target.value)}
            />
            <Button type="submit" variant="primary">
              키워드 검색
            </Button>
          </form>

          <div className="chip-row" aria-label="핵심 기능">
            {featureChips.map((chip) => (
              <span className="chip" key={chip}>
                {chip}
              </span>
            ))}
          </div>
        </div>

        <article className="hero-card">
          <div className="hero-card-header">
            <div>
              <h2 className="card-title">오늘의 감자</h2>
              <p className="body-copy">현재 뉴스 묶음에서 가장 높은 신호를 보이는 이슈</p>
            </div>
            <span className="badge">Hot issue</span>
          </div>
          <SignalMapVisual />
          <div className="hero-card-body">
            <h3 className="hot-title">AI 반도체 수요 폭발, 엔비디아와 삼성전자 동반 주목</h3>
            <p className="body-copy">
              최근 뉴스 300건 기준으로 AI 인프라와 HBM 공급 이슈가 높은 언급량을 보였습니다.
            </p>
            <div className="metric-grid">
              {metrics.map((metric) => (
                <div className="metric-card" key={metric.label}>
                  <span className="metric-value">{metric.value}</span>
                  <span className="metric-label">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export function BriefingSection({ briefing, isActive }: BriefingSectionProps) {
  return (
    <section className="page" data-active={isActive} id="briefing">
      <BriefingContent briefing={briefing} />
    </section>
  );
}

export function SearchSection({
  isActive,
  onRequestKeywordSearch,
  onSearchDraftChange,
  searchBriefing,
  searchDraft,
}: SearchSectionProps) {
  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onRequestKeywordSearch();
  }

  return (
    <section className="page" data-active={isActive} id="search">
      <div className="section-heading">
        <h2 className="section-title">키워드 검색</h2>
        <p className="body-copy">원하는 키워드를 검색하면 AI 브리핑과 같은 형식으로 보여줍니다.</p>
      </div>

      <form className="search-page-form" onSubmit={submitSearch}>
        <input
          className="input"
          placeholder="예: 전기차 배터리"
          type="text"
          value={searchDraft}
          onChange={(event) => onSearchDraftChange(event.target.value)}
        />
        <Button type="submit" variant="primary">
          검색
        </Button>
      </form>

      {searchBriefing === null ? (
        <div className="empty-briefing">
          <span className="badge">Ready</span>
          <h3 className="card-title mt-5">검색할 키워드를 입력하세요</h3>
          <p className="body-copy">
            검색 후 요약, 관련 키워드, 트렌드 그래프, 워드 클라우드, 관련 뉴스가 같은 구성으로
            표시됩니다.
          </p>
        </div>
      ) : (
        <div className="mt-7">
          <BriefingContent briefing={searchBriefing} />
        </div>
      )}
    </section>
  );
}

export function MyPageSection({
  isActive,
  keywordDraft,
  keywords,
  onAddKeyword,
  onDeleteKeyword,
  onEditKeyword,
  onKeywordDraftChange,
}: MyPageSectionProps) {
  function submitKeyword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAddKeyword();
  }

  return (
    <section className="page" data-active={isActive} id="mypage">
      <div className="section-heading">
        <h2 className="section-title">마이페이지</h2>
        <p className="body-copy">AI 브리핑으로 받을 키워드를 등록하고 관리합니다.</p>
      </div>

      <article className="card manage-card">
        <h3 className="card-title">내 키워드 관리</h3>
        <form className="input-row" onSubmit={submitKeyword}>
          <input
            className="input"
            placeholder="새 키워드 입력"
            type="text"
            value={keywordDraft}
            onChange={(event) => onKeywordDraftChange(event.target.value)}
          />
          <Button type="submit" variant="primary">
            등록
          </Button>
        </form>

        <div className="keyword-list">
          {keywords.map((keyword) => (
            <div className="keyword-row" key={keyword.id}>
              <strong>{keyword.label}</strong>
              <div className="keyword-actions">
                <Button variant="ghost" onClick={() => onEditKeyword(keyword.id)}>
                  수정
                </Button>
                <Button variant="danger" onClick={() => onDeleteKeyword(keyword.id)}>
                  삭제
                </Button>
              </div>
            </div>
          ))}
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
              <h3 className="discussion-title">
                {activeBoardSection?.description ?? "전체 분야의 인기 흐름"}
              </h3>
            </div>
            <span className="muted">{boardPosts.length}개 글</span>
          </div>

          {boardPosts.length === 0 ? (
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
                      <span>{post.category}</span>
                      <span>{post.author}</span>
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
                {featuredPost.author} · 댓글 {featuredPost.commentCount}
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
    onSubmitPostDraft();
  }

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

              <label className="field">
                <span>말머리</span>
                <select
                  className="input"
                  value={postDraft.category}
                  onChange={(event) => onDraftFieldChange("category", event.target.value)}
                >
                  <option value="토론">토론</option>
                  <option value="질문">질문</option>
                  <option value="후기">후기</option>
                  <option value="정보">정보</option>
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
          <span className="badge">{postDraft.category}</span>
          <h3>{postDraft.title.trim() || "게시글 제목"}</h3>
          <p>{postDraft.body.trim() || "작성 중인 내용이 여기에 미리 표시됩니다."}</p>
        </aside>
      </div>
    </section>
  );
}

export function PostSection({ isActive, onNavigate, post }: PostSectionProps) {
  if (post === null) {
    return (
      <section className="page" data-active={isActive} id="post">
        <Button variant="ghost" onClick={() => onNavigate("community")}>
          목록으로
        </Button>
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
              {post.author} · 댓글 {post.commentCount}
            </p>
          </div>
          <p className="post-body">{post.body}</p>
        </article>

        <section className="comment-panel">
          <h3 className="card-title">댓글</h3>
          <div className="comment-list">
            {post.comments.map((comment) => (
              <article className="comment-item" key={comment.id}>
                <strong>{comment.author}</strong>
                <p>{comment.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function BriefingContent({ briefing }: BriefingContentProps) {
  return (
    <>
      <div className="section-heading">
        <h2 className="section-title">{briefing.title}</h2>
        <p className="body-copy">{briefing.description}</p>
      </div>

      <div className="grid-two">
        <article className="card">
          <h3 className="card-title">AI 요약</h3>
          <p className="body-copy">{briefing.summaryIntro}</p>
          <ul className="summary-list">
            {briefing.summaryHighlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </article>

        <aside className="card">
          <h3 className="card-title">{briefing.keywordPanelTitle}</h3>
          <div className="chip-row">
            {briefing.keywords.map((keyword) => (
              <span className={`chip ${keyword.isHot ? "chip-hot" : ""}`} key={keyword.id}>
                {keyword.label}
              </span>
            ))}
          </div>
        </aside>
      </div>

      <VisualGrid
        relatedKeywords={briefing.relatedKeywords}
        trendPoints={briefing.trendPoints}
        wordFrequencies={briefing.wordFrequencies}
      />

      <article className="card mt-5">
        <h3 className="card-title">관련 뉴스 링크</h3>
        <NewsList newsArticles={briefing.newsArticles} />
      </article>
    </>
  );
}

function VisualGrid({ relatedKeywords, trendPoints, wordFrequencies }: VisualGridProps) {
  return (
    <div className="grid-three mt-5">
      <article className="card">
        <h3 className="card-title">트렌드 그래프</h3>
        <TrendBarChart points={trendPoints} />
      </article>
      <article className="card">
        <h3 className="card-title">워드 클라우드</h3>
        <WordCloud words={wordFrequencies} />
      </article>
      <article className="card">
        <h3 className="card-title">관련 키워드</h3>
        <RelatedKeywordMap keywords={relatedKeywords} />
      </article>
    </div>
  );
}

function NewsList({ newsArticles }: NewsListProps) {
  return (
    <div className="news-list">
      {newsArticles.map((article) => (
        <div className="news-row" key={article.id}>
          <span className="news-time">{article.time}</span>
          <span className="news-title">{article.title}</span>
          <span className="link-label">{article.source}</span>
        </div>
      ))}
    </div>
  );
}
