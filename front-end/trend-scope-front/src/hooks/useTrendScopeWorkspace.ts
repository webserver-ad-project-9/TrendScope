"use client";

import { useEffect, useMemo, useState } from "react";
import { EnvironmentConfigurationError } from "@/src/config/environment";
import { ApiClientError } from "@/src/services/apiClient";
import {
  createCommunityComment,
  createCommunityPost,
  deleteCommunityComment,
  deleteCommunityPost,
  fetchCommunityBoardSections,
  fetchCommunityPostThread,
  fetchCommunityPosts,
  likeCommunityPost,
  unlikeCommunityPost,
  updateCommunityComment,
  updateCommunityPost,
} from "@/src/services/communityService";
import {
  consumeOAuthSignupHint,
  fetchCurrentUser,
  logoutCurrentUser,
  startGoogleOAuthLogin,
  type OAuthSignupHint,
} from "@/src/services/authService";
import {
  clearPendingOnboardingKeywordNames,
  createOnboardingKeyword,
  createOnboardingKeywordsBulk,
  fetchOnboardingKeywords,
} from "@/src/services/keywordService";
import {
  bookmarkNewsArticle,
  deleteNewsBookmark,
  fetchNewsBookmarks,
  fetchNewsDashboard,
  fetchNewsRecommendations,
  summarizeNewsArticle,
  summarizeNewsArticles,
} from "@/src/services/newsService";
import { fetchTrendAnalysisSummary } from "@/src/services/trendAnalysisService";
import type { AuthStatus, CurrentUserViewModel, KeywordSyncStatus } from "@/src/types/auth";
import type {
  BoardPostViewModel,
  CommunityBoardFilterId,
  CommunityBoardSectionId,
  CommunityBoardSectionViewModel,
  CommunityPostDraftViewModel,
  CommunitySyncStatus,
  KeywordViewModel,
  NewsBookmarkViewModel,
  NewsDashboardSyncStatus,
  NewsDashboardViewModel,
  NewsRecommendationViewModel,
  NewsSummaryViewModel,
  NewsSyncStatus,
  TrendAnalysisSummaryViewModel,
  TrendAnalysisSyncStatus,
  TrendScopeSection,
} from "@/src/types/trend";

interface TrendScopeWorkspaceState {
  readonly activeSection: TrendScopeSection;
  readonly activePost: BoardPostViewModel | null;
  readonly activeCommunityBoardSectionId: CommunityBoardFilterId;
  readonly authMessage: string | null;
  readonly authStatus: AuthStatus;
  readonly communityBoardSections: readonly CommunityBoardSectionViewModel[];
  readonly communityPosts: readonly BoardPostViewModel[];
  readonly communitySyncMessage: string | null;
  readonly communitySyncStatus: CommunitySyncStatus;
  readonly currentUser: CurrentUserViewModel | null;
  readonly visibleCommunityPosts: readonly BoardPostViewModel[];
  readonly postDraft: CommunityPostDraftViewModel;
  readonly postEditDraft: CommunityPostDraftViewModel;
  readonly postCommentDraft: string;
  readonly commentEditDraft: string;
  readonly canSubmitPostDraft: boolean;
  readonly canSubmitPostEdit: boolean;
  readonly canSubmitPostComment: boolean;
  readonly canSubmitCommentEdit: boolean;
  readonly keywords: readonly KeywordViewModel[];
  readonly keywordDraft: string;
  readonly bookmarkedNewsIds: readonly string[];
  readonly batchNewsSummary: NewsSummaryViewModel | null;
  readonly isSummarizingNewsBatch: boolean;
  readonly newsBookmarks: readonly NewsBookmarkViewModel[];
  readonly newsDashboard: NewsDashboardViewModel | null;
  readonly newsDashboardSyncMessage: string | null;
  readonly newsDashboardSyncStatus: NewsDashboardSyncStatus;
  readonly newsRecommendation: NewsRecommendationViewModel | null;
  readonly newsSummariesByArticleId: Readonly<Record<string, NewsSummaryViewModel>>;
  readonly newsSyncMessage: string | null;
  readonly newsSyncStatus: NewsSyncStatus;
  readonly trendAnalysisSummary: TrendAnalysisSummaryViewModel | null;
  readonly trendAnalysisSyncMessage: string | null;
  readonly trendAnalysisSyncStatus: TrendAnalysisSyncStatus;
  readonly onboardingKeywordDraft: string;
  readonly keywordSyncMessage: string | null;
  readonly keywordSyncStatus: KeywordSyncStatus;
  readonly selectedOnboardingKeywordNames: readonly string[];
  readonly summarizingNewsId: string | null;
  readonly editingCommentId: string | null;
  readonly isEditingActivePost: boolean;
  readonly canSubmitOnboardingKeywords: boolean;
  readonly goToSection: (section: TrendScopeSection) => void;
  readonly login: () => void;
  readonly logout: () => Promise<void>;
  readonly setKeywordDraft: (value: string) => void;
  readonly setOnboardingKeywordDraft: (value: string) => void;
  readonly setCommentEditDraft: (value: string) => void;
  readonly setPostCommentDraft: (value: string) => void;
  readonly addKeyword: () => Promise<void>;
  readonly addCustomOnboardingKeyword: () => void;
  readonly refreshNewsDashboard: () => Promise<void>;
  readonly refreshNewsRecommendations: () => Promise<void>;
  readonly summarizeRecommendedNewsBatch: () => Promise<void>;
  readonly summarizeRecommendedNews: (newsId: string) => Promise<void>;
  readonly toggleNewsBookmark: (newsId: string) => Promise<void>;
  readonly startLoginWithOnboardingKeywords: () => Promise<void>;
  readonly startLoginWithoutOnboardingKeywords: () => void;
  readonly setCommunityBoardSection: (sectionId: CommunityBoardFilterId) => void;
  readonly setPostDraftField: (field: keyof CommunityPostDraftViewModel, value: string) => void;
  readonly setPostEditDraftField: (field: keyof CommunityPostDraftViewModel, value: string) => void;
  readonly submitPostDraft: () => Promise<void>;
  readonly startEditingActivePost: () => void;
  readonly cancelEditingActivePost: () => void;
  readonly submitPostEdit: () => Promise<void>;
  readonly deleteActivePost: () => Promise<void>;
  readonly submitPostComment: () => Promise<void>;
  readonly startEditingComment: (commentId: string) => void;
  readonly cancelEditingComment: () => void;
  readonly submitCommentEdit: () => Promise<void>;
  readonly deleteComment: (commentId: string) => Promise<void>;
  readonly toggleActivePostLike: () => Promise<void>;
  readonly toggleOnboardingKeyword: (keywordName: string) => void;
  readonly openPost: (postId: string) => void;
}

/**
 * 화면 내 탭 이동, 키워드 편집, 커뮤니티 API 연동 등 브라우저 상호작용 상태를 관리한다.
 * 실제 백엔드 API 호출은 service 경계를 통해 수행한다.
 */
export function useTrendScopeWorkspace(): TrendScopeWorkspaceState {
  const [activeSection, setActiveSection] = useState<TrendScopeSection>("home");
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [activePost, setActivePost] = useState<BoardPostViewModel | null>(null);
  const [activeCommunityBoardSectionId, setActiveCommunityBoardSectionId] =
    useState<CommunityBoardFilterId>("all");
  const [communityBoardSections, setCommunityBoardSections] = useState<
    readonly CommunityBoardSectionViewModel[]
  >([]);
  const [boardPosts, setBoardPosts] = useState<readonly BoardPostViewModel[]>([]);
  const [communitySyncStatus, setCommunitySyncStatus] =
    useState<CommunitySyncStatus>("idle");
  const [communitySyncMessage, setCommunitySyncMessage] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<readonly KeywordViewModel[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUserViewModel | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("checking");
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [keywordSyncStatus, setKeywordSyncStatus] = useState<KeywordSyncStatus>("idle");
  const [keywordSyncMessage, setKeywordSyncMessage] = useState<string | null>(null);
  const [postDraft, setPostDraft] = useState<CommunityPostDraftViewModel>({
    boardSectionId: "economy",
    title: "",
    body: "",
  });
  const [postEditDraft, setPostEditDraft] = useState<CommunityPostDraftViewModel>({
    boardSectionId: "economy",
    title: "",
    body: "",
  });
  const [isEditingActivePost, setIsEditingActivePost] = useState(false);
  const [postCommentDraft, setPostCommentDraft] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [commentEditDraft, setCommentEditDraft] = useState("");
  const [keywordDraft, setKeywordDraft] = useState("");
  const [onboardingKeywordDraft, setOnboardingKeywordDraft] = useState("");
  const [selectedOnboardingKeywordNames, setSelectedOnboardingKeywordNames] = useState<
    readonly string[]
  >([]);
  const [newsRecommendation, setNewsRecommendation] =
    useState<NewsRecommendationViewModel | null>(null);
  const [newsSummariesByArticleId, setNewsSummariesByArticleId] = useState<
    Readonly<Record<string, NewsSummaryViewModel>>
  >({});
  const [batchNewsSummary, setBatchNewsSummary] = useState<NewsSummaryViewModel | null>(null);
  const [isSummarizingNewsBatch, setIsSummarizingNewsBatch] = useState(false);
  const [newsSyncStatus, setNewsSyncStatus] = useState<NewsSyncStatus>("idle");
  const [newsSyncMessage, setNewsSyncMessage] = useState<string | null>(
    "로그인 후 추천 뉴스를 확인할 수 있습니다.",
  );
  const [summarizingNewsId, setSummarizingNewsId] = useState<string | null>(null);
  const [newsDashboard, setNewsDashboard] = useState<NewsDashboardViewModel | null>(null);
  const [newsDashboardSyncStatus, setNewsDashboardSyncStatus] =
    useState<NewsDashboardSyncStatus>("idle");
  const [newsDashboardSyncMessage, setNewsDashboardSyncMessage] = useState<string | null>(
    "로그인 후 뉴스 대시보드를 확인할 수 있습니다.",
  );
  const [trendAnalysisSummary, setTrendAnalysisSummary] =
    useState<TrendAnalysisSummaryViewModel | null>(null);
  const [trendAnalysisSyncStatus, setTrendAnalysisSyncStatus] =
    useState<TrendAnalysisSyncStatus>("idle");
  const [trendAnalysisSyncMessage, setTrendAnalysisSyncMessage] = useState<string | null>(
    "로그인 후 브리핑 지표를 확인할 수 있습니다.",
  );

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadAuthenticatedAccount() {
      setAuthStatus("checking");

      try {
        const authenticatedUser = await fetchCurrentUser();

        if (!shouldUpdateState) {
          return;
        }

        setCurrentUser(authenticatedUser);
        setAuthStatus("authenticated");
        setAuthMessage(null);
      } catch (error) {
        if (!shouldUpdateState) {
          return;
        }

        setCurrentUser(null);
        setAuthStatus(isMissingTokenError(error) ? "anonymous" : "error");
        setAuthMessage(
          isMissingTokenError(error)
            ? null
            : getApiErrorMessage(error, "로그인 상태를 확인하지 못했습니다."),
        );
        setKeywordSyncStatus(isMissingTokenError(error) ? "idle" : "error");
        setKeywordSyncMessage(
          isMissingTokenError(error)
            ? "로그인 후 키워드를 확인할 수 있습니다."
            : getApiErrorMessage(error, "키워드 확인에 실패했습니다."),
        );
        return;
      }

      setKeywordSyncStatus("loading");

      try {
        const remoteKeywords = await fetchOnboardingKeywords();

        if (!shouldUpdateState) {
          return;
        }

        const oauthSignupHint = consumeOAuthSignupHint();
        clearPendingOnboardingKeywordNames();

        if (shouldShowSignupOnboarding(oauthSignupHint, remoteKeywords)) {
          setKeywords([]);
          setKeywordSyncStatus("ready");
          setKeywordSyncMessage("처음 가입한 계정으로 판단되어 첫 브리핑 키워드를 설정합니다.");
          setActiveSection("onboarding");
          return;
        }

        setKeywords(remoteKeywords);
        setKeywordSyncStatus("ready");
        setKeywordSyncMessage(null);
      } catch (error) {
        if (!shouldUpdateState) {
          return;
        }

        setKeywordSyncStatus("error");
        setKeywordSyncMessage(getApiErrorMessage(error, "키워드 목록을 불러오지 못했습니다."));
      }
    }

    void loadAuthenticatedAccount();

    return () => {
      shouldUpdateState = false;
    };
  }, []);

  useEffect(() => {
    let shouldUpdateState = true;

    async function syncNewsRecommendations() {
      if (authStatus !== "authenticated" || currentUser === null) {
        setNewsRecommendation(null);
        setNewsSummariesByArticleId({});
        setSummarizingNewsId(null);
        setNewsSyncStatus("idle");
        setNewsSyncMessage("로그인 후 추천 뉴스를 확인할 수 있습니다.");
        return;
      }

      if (keywordSyncStatus !== "ready") {
        return;
      }

      if (keywords.length === 0) {
        setNewsRecommendation({
          keywords: [],
          articles: [],
          refreshed: false,
        });
        setNewsSummariesByArticleId({});
        setNewsSyncStatus("idle");
        setNewsSyncMessage("키워드를 추가하면 추천 뉴스가 준비됩니다.");
        return;
      }

      setNewsSyncStatus("loading");
      setNewsSyncMessage(null);

      try {
        const recommendation = await fetchNewsRecommendations({ refresh: false });

        if (!shouldUpdateState) {
          return;
        }

        setNewsRecommendation(recommendation);
        setNewsSummariesByArticleId({});
        setNewsSyncStatus("ready");
        setNewsSyncMessage(
          recommendation.articles.length === 0
            ? "저장된 추천 뉴스가 없습니다. 새 소식을 불러와 보세요."
            : null,
        );
      } catch (error) {
        if (!shouldUpdateState) {
          return;
        }

        if (isMissingTokenError(error)) {
          setAuthStatus("anonymous");
          setCurrentUser(null);
        }

        setNewsSyncStatus("error");
        setNewsSyncMessage(getApiErrorMessage(error, "추천 뉴스를 불러오지 못했습니다."));
      }
    }

    void syncNewsRecommendations();

    return () => {
      shouldUpdateState = false;
    };
  }, [authStatus, currentUser, keywordSyncStatus, keywords]);

  useEffect(() => {
    let shouldUpdateState = true;

    async function syncTrendAnalysisSummary() {
      if (authStatus !== "authenticated" || currentUser === null) {
        setTrendAnalysisSummary(null);
        setTrendAnalysisSyncStatus("idle");
        setTrendAnalysisSyncMessage("로그인 후 브리핑 지표를 확인할 수 있습니다.");
        return;
      }

      setTrendAnalysisSyncStatus("loading");
      setTrendAnalysisSyncMessage(null);

      try {
        const summary = await fetchTrendAnalysisSummary();

        if (!shouldUpdateState) {
          return;
        }

        setTrendAnalysisSummary(summary);
        setTrendAnalysisSyncStatus("ready");
        setTrendAnalysisSyncMessage(null);
      } catch (error) {
        if (!shouldUpdateState) {
          return;
        }

        if (isMissingTokenError(error)) {
          setAuthStatus("anonymous");
          setCurrentUser(null);
        }

        setTrendAnalysisSummary(null);
        setTrendAnalysisSyncStatus("error");
        setTrendAnalysisSyncMessage(
          getApiErrorMessage(error, "트렌드 분석 요약을 불러오지 못했습니다."),
        );
      }
    }

    void syncTrendAnalysisSummary();

    return () => {
      shouldUpdateState = false;
    };
  }, [authStatus, currentUser]);

  useEffect(() => {
    let shouldUpdateState = true;

    async function syncNewsDashboard() {
      if (authStatus !== "authenticated" || currentUser === null) {
        setNewsDashboard(null);
        setBatchNewsSummary(null);
        setIsSummarizingNewsBatch(false);
        setNewsDashboardSyncStatus("idle");
        setNewsDashboardSyncMessage("로그인 후 뉴스 대시보드를 확인할 수 있습니다.");
        return;
      }

      if (keywordSyncStatus !== "ready") {
        return;
      }

      setNewsDashboardSyncStatus("loading");
      setNewsDashboardSyncMessage(null);

      try {
        const dashboard = await fetchNewsDashboard();

        if (!shouldUpdateState) {
          return;
        }

        setNewsDashboard(dashboard);
        setNewsDashboardSyncStatus("ready");
        setNewsDashboardSyncMessage(null);
      } catch (error) {
        if (!shouldUpdateState) {
          return;
        }

        if (isMissingTokenError(error)) {
          setAuthStatus("anonymous");
          setCurrentUser(null);
        }

        setNewsDashboard(null);
        setNewsDashboardSyncStatus("error");
        setNewsDashboardSyncMessage(
          getApiErrorMessage(error, "뉴스 대시보드를 불러오지 못했습니다."),
        );
      }
    }

    void syncNewsDashboard();

    return () => {
      shouldUpdateState = false;
    };
  }, [authStatus, currentUser, keywordSyncStatus, keywords]);

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadCommunityCategories() {
      try {
        const remoteBoardSections = await fetchCommunityBoardSections();

        if (shouldUpdateState && remoteBoardSections.length > 0) {
          setCommunityBoardSections(remoteBoardSections);
        }
      } catch (error) {
        if (shouldUpdateState) {
          setCommunitySyncMessage(
            getApiErrorMessage(error, "게시판 카테고리를 불러오지 못했습니다."),
          );
        }
      }
    }

    void loadCommunityCategories();

    return () => {
      shouldUpdateState = false;
    };
  }, []);

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadCommunityPosts() {
      setCommunitySyncStatus("loading");

      try {
        const remotePosts = await fetchCommunityPosts("all");

        if (!shouldUpdateState) {
          return;
        }

        setBoardPosts(remotePosts);
        setCommunitySyncStatus("ready");
        setCommunitySyncMessage(null);
      } catch (error) {
        if (!shouldUpdateState) {
          return;
        }

        setCommunitySyncStatus("error");
        setCommunitySyncMessage(getApiErrorMessage(error, "게시글 목록을 불러오지 못했습니다."));
      }
    }

    void loadCommunityPosts();

    return () => {
      shouldUpdateState = false;
    };
  }, []);

  const visibleCommunityPosts = useMemo(() => {
    if (activeCommunityBoardSectionId === "all") {
      return boardPosts;
    }

    return boardPosts.filter((post) => post.boardSectionId === activeCommunityBoardSectionId);
  }, [activeCommunityBoardSectionId, boardPosts]);

  const newsBookmarks = useMemo(
    () => newsDashboard?.bookmarks ?? [],
    [newsDashboard],
  );
  const bookmarkedNewsIds = useMemo(
    () => newsBookmarks.map((bookmark) => bookmark.newsId),
    [newsBookmarks],
  );

  const canSubmitPostDraft =
    postDraft.title.trim().length > 0 &&
    postDraft.body.trim().length > 0 &&
    communitySyncStatus !== "saving";
  const canSubmitPostEdit =
    postEditDraft.title.trim().length > 0 &&
    postEditDraft.body.trim().length > 0 &&
    activePost !== null &&
    communitySyncStatus !== "saving";
  const canSubmitPostComment =
    postCommentDraft.trim().length > 0 &&
    activePost !== null &&
    communitySyncStatus !== "saving";
  const canSubmitCommentEdit =
    editingCommentId !== null &&
    commentEditDraft.trim().length > 0 &&
    communitySyncStatus !== "saving";
  const canSubmitOnboardingKeywords = selectedOnboardingKeywordNames.length > 0;

  function beginGoogleOAuthLogin() {
    try {
      clearPendingOnboardingKeywordNames();
      startGoogleOAuthLogin();
    } catch (error) {
      setAuthStatus("error");
      setAuthMessage(getApiErrorMessage(error, "로그인 설정을 확인하지 못했습니다."));
    }
  }

  function goToSection(section: TrendScopeSection) {
    if (section !== "home" && currentUser === null) {
      returnToHomeForLoginRequiredFeature();
      return;
    }

    setActiveSection(section);

    if (section !== "post") {
      setActivePostId(null);
      setActivePost(null);
      setIsEditingActivePost(false);
      setEditingCommentId(null);
      setCommentEditDraft("");
    }

    scrollToTop();
  }

  function login() {
    beginGoogleOAuthLogin();
  }

  async function startLoginWithOnboardingKeywords() {
    if (selectedOnboardingKeywordNames.length === 0) {
      return;
    }

    if (currentUser === null) {
      returnToHomeForLoginRequiredFeature();
      return;
    }

    setKeywordSyncStatus("saving");
    setKeywordSyncMessage(null);

    try {
      const createdKeywords = await createOnboardingKeywordsBulk(selectedOnboardingKeywordNames);

      setKeywords(createdKeywords);
      setSelectedOnboardingKeywordNames([]);
      setKeywordSyncStatus("ready");
      setKeywordSyncMessage("첫 브리핑 키워드를 저장했습니다.");
      setActiveSection("home");
      scrollToTop();
    } catch (error) {
      if (isMissingTokenError(error)) {
        setAuthStatus("anonymous");
        setCurrentUser(null);
      }

      setKeywordSyncStatus("error");
      setKeywordSyncMessage(getApiErrorMessage(error, "첫 브리핑 키워드 저장에 실패했습니다."));
    }
  }

  function startLoginWithoutOnboardingKeywords() {
    clearPendingOnboardingKeywordNames();
    setSelectedOnboardingKeywordNames([]);
    setKeywordSyncStatus("idle");
    setKeywordSyncMessage("첫 브리핑 키워드 설정을 건너뛰었습니다. 마이페이지에서 나중에 등록할 수 있습니다.");
    setActiveSection("home");
    scrollToTop();
  }

  async function logout() {
    setAuthStatus("checking");

    try {
      await logoutCurrentUser();
    } catch (error) {
      setAuthMessage(getApiErrorMessage(error, "로그아웃 요청에 실패했습니다."));
    }

    setCurrentUser(null);
    setAuthStatus("anonymous");
    clearPendingOnboardingKeywordNames();
    setSelectedOnboardingKeywordNames([]);
    setKeywords([]);
    setKeywordSyncStatus("idle");
    setKeywordSyncMessage("로그아웃되었습니다.");
    setActiveSection("home");
    setActivePostId(null);
    setActivePost(null);
    setIsEditingActivePost(false);
    setEditingCommentId(null);
    setCommentEditDraft("");
    setNewsRecommendation(null);
    setNewsSummariesByArticleId({});
    setBatchNewsSummary(null);
    setIsSummarizingNewsBatch(false);
    setSummarizingNewsId(null);
    setNewsSyncStatus("idle");
    setNewsSyncMessage("로그인 후 추천 뉴스를 확인할 수 있습니다.");
    setNewsDashboard(null);
    setNewsDashboardSyncStatus("idle");
    setNewsDashboardSyncMessage("로그인 후 뉴스 대시보드를 확인할 수 있습니다.");
    setTrendAnalysisSummary(null);
    setTrendAnalysisSyncStatus("idle");
    setTrendAnalysisSyncMessage("로그인 후 브리핑 지표를 확인할 수 있습니다.");

    try {
      const anonymousPosts = await fetchCommunityPosts("all");

      setBoardPosts(anonymousPosts);
    } catch {
      setCommunitySyncStatus("error");
      setCommunitySyncMessage("로그아웃 후 게시글 목록을 다시 불러오지 못했습니다.");
    }
  }

  async function addKeyword() {
    const normalizedKeyword = keywordDraft.trim();

    if (normalizedKeyword.length === 0) {
      return;
    }

    if (currentUser === null) {
      returnToHomeForLoginRequiredFeature();
      return;
    }

    setKeywordSyncStatus("saving");
    setKeywordSyncMessage(null);

    try {
      const createdKeyword = await createOnboardingKeyword(normalizedKeyword);

      setKeywords((currentKeywords) => [
        ...currentKeywords.filter((keyword) => keyword.id !== createdKeyword.id),
        createdKeyword,
      ]);
      setKeywordDraft("");
      setKeywordSyncStatus("ready");
      setKeywordSyncMessage("키워드를 등록했습니다.");
    } catch (error) {
      if (isMissingTokenError(error)) {
        setAuthStatus("anonymous");
        setCurrentUser(null);
      }

      setKeywordSyncStatus("error");
      setKeywordSyncMessage(getApiErrorMessage(error, "키워드 등록에 실패했습니다."));
    }
  }

  async function refreshNewsDashboard() {
    if (currentUser === null) {
      returnToHomeForLoginRequiredFeature();
      return;
    }

    await reloadNewsDashboard("뉴스 대시보드를 새로고침했습니다.");
  }

  async function refreshNewsRecommendations() {
    if (currentUser === null) {
      returnToHomeForLoginRequiredFeature();
      return;
    }

    if (keywords.length === 0) {
      setNewsRecommendation({
        keywords: [],
        articles: [],
        refreshed: false,
      });
      setNewsSyncStatus("idle");
      setNewsSyncMessage("키워드를 먼저 추가하세요.");
      return;
    }

    setNewsSyncStatus("refreshing");
    setNewsSyncMessage("최신 뉴스를 준비하고 있습니다.");

    try {
      const recommendation = await fetchNewsRecommendations({ refresh: true });

      setNewsRecommendation(recommendation);
      setNewsSummariesByArticleId({});
      setNewsSyncStatus("ready");
      setNewsSyncMessage(
        recommendation.articles.length === 0
          ? "아직 표시할 추천 뉴스가 없습니다."
          : "최신 뉴스를 수집했습니다.",
      );
      void reloadNewsDashboard(null);
    } catch (error) {
      if (isMissingTokenError(error)) {
        setAuthStatus("anonymous");
        setCurrentUser(null);
      }

      setNewsSyncStatus("error");
      setNewsSyncMessage(getApiErrorMessage(error, "최신 뉴스 수집에 실패했습니다."));
    }
  }

  async function summarizeRecommendedNews(newsId: string) {
    if (currentUser === null) {
      returnToHomeForLoginRequiredFeature();
      return;
    }

    setSummarizingNewsId(newsId);
    setNewsSyncStatus("summarizing");
    setNewsSyncMessage(null);

    try {
      const summary = await summarizeNewsArticle(newsId);

      setNewsSummariesByArticleId((currentSummaries) => ({
        ...currentSummaries,
        [newsId]: summary,
      }));
      setNewsSyncStatus("ready");
      setNewsSyncMessage(null);
    } catch (error) {
      if (isMissingTokenError(error)) {
        setAuthStatus("anonymous");
        setCurrentUser(null);
      }

      setNewsSyncStatus("error");
      setNewsSyncMessage(getApiErrorMessage(error, "뉴스 요약 생성에 실패했습니다."));
    } finally {
      setSummarizingNewsId(null);
    }
  }

  async function summarizeRecommendedNewsBatch() {
    if (currentUser === null) {
      returnToHomeForLoginRequiredFeature();
      return;
    }

    const targetNewsIds = newsRecommendation?.articles.map((article) => article.id) ?? [];

    if (targetNewsIds.length === 0) {
      setNewsSyncStatus("idle");
      setNewsSyncMessage("묶음 요약을 만들 추천 뉴스가 없습니다.");
      return;
    }

    setIsSummarizingNewsBatch(true);
    setNewsSyncStatus("summarizing");
    setNewsSyncMessage(null);

    try {
      const summary = await summarizeNewsArticles({
        newsIds: targetNewsIds,
        maxSentenceCount: 3,
      });

      setBatchNewsSummary(summary);
      setNewsSyncStatus("ready");
      setNewsSyncMessage("추천 뉴스 묶음 요약을 생성했습니다.");
    } catch (error) {
      if (isMissingTokenError(error)) {
        setAuthStatus("anonymous");
        setCurrentUser(null);
      }

      setNewsSyncStatus("error");
      setNewsSyncMessage(getApiErrorMessage(error, "추천 뉴스 묶음 요약에 실패했습니다."));
    } finally {
      setIsSummarizingNewsBatch(false);
    }
  }

  async function toggleNewsBookmark(newsId: string) {
    if (currentUser === null) {
      returnToHomeForLoginRequiredFeature();
      return;
    }

    const isBookmarked = bookmarkedNewsIds.includes(newsId);

    setNewsDashboardSyncStatus("saving");
    setNewsDashboardSyncMessage(isBookmarked ? "북마크를 해제하고 있습니다." : "뉴스를 저장하고 있습니다.");

    try {
      if (isBookmarked) {
        await deleteNewsBookmark(newsId);
      } else {
        await bookmarkNewsArticle(newsId);
      }

      const bookmarks = await fetchNewsBookmarks();

      setNewsDashboard((currentDashboard) =>
        currentDashboard === null
          ? currentDashboard
          : {
              ...currentDashboard,
              bookmarks,
            },
      );
      setNewsDashboardSyncStatus("ready");
      setNewsDashboardSyncMessage(isBookmarked ? "북마크를 해제했습니다." : "뉴스를 저장했습니다.");
    } catch (error) {
      if (isMissingTokenError(error)) {
        setAuthStatus("anonymous");
        setCurrentUser(null);
      }

      setNewsDashboardSyncStatus("error");
      setNewsDashboardSyncMessage(getApiErrorMessage(error, "뉴스 저장 상태를 변경하지 못했습니다."));
    }
  }

  function toggleOnboardingKeyword(keywordName: string) {
    const normalizedKeyword = keywordName.trim();

    if (normalizedKeyword.length === 0) {
      return;
    }

    setSelectedOnboardingKeywordNames((currentKeywords) =>
      currentKeywords.includes(normalizedKeyword)
        ? currentKeywords.filter((keyword) => keyword !== normalizedKeyword)
        : [...currentKeywords, normalizedKeyword],
    );
  }

  function addCustomOnboardingKeyword() {
    const normalizedKeyword = onboardingKeywordDraft.trim();

    if (normalizedKeyword.length === 0) {
      return;
    }

    setSelectedOnboardingKeywordNames((currentKeywords) =>
      currentKeywords.includes(normalizedKeyword)
        ? currentKeywords
        : [...currentKeywords, normalizedKeyword],
    );
    setOnboardingKeywordDraft("");
  }

  function setCommunityBoardSection(sectionId: CommunityBoardFilterId) {
    setActiveCommunityBoardSectionId(sectionId);
  }

  function setPostDraftField(field: keyof CommunityPostDraftViewModel, value: string) {
    setPostDraft((currentDraft) => ({
      ...currentDraft,
      [field]:
        field === "boardSectionId"
          ? (value as CommunityBoardSectionId)
          : value,
    }));
  }

  async function submitPostDraft() {
    const normalizedTitle = postDraft.title.trim();
    const normalizedBody = postDraft.body.trim();

    if (normalizedTitle.length === 0 || normalizedBody.length === 0) {
      return;
    }

    if (currentUser === null) {
      returnToHomeForLoginRequiredFeature();
      return;
    }

    setCommunitySyncStatus("saving");
    setCommunitySyncMessage("게시글을 저장하고 있습니다.");

    try {
      const createdPostId = await createCommunityPost({
        boardSectionId: postDraft.boardSectionId,
        title: normalizedTitle,
        body: normalizedBody,
      });
      const [remotePosts, createdPost] = await Promise.all([
        fetchCommunityPosts("all"),
        fetchCommunityPostThread(createdPostId),
      ]);

      setBoardPosts(remotePosts);
      setActiveCommunityBoardSectionId(postDraft.boardSectionId);
      setPostDraft({
        boardSectionId: postDraft.boardSectionId,
        title: "",
        body: "",
      });
      setActivePostId(createdPostId);
      setActivePost(createdPost);
      setActiveSection("post");
      setCommunitySyncStatus("ready");
      setCommunitySyncMessage("게시글을 등록했습니다.");
      scrollToTop();
    } catch (error) {
      if (isMissingTokenError(error)) {
        setAuthStatus("anonymous");
        setCurrentUser(null);
      }

      setCommunitySyncStatus("error");
      setCommunitySyncMessage(getApiErrorMessage(error, "게시글 등록에 실패했습니다."));
    }
  }

  function startEditingActivePost() {
    if (activePost === null || !activePost.isMine) {
      return;
    }

    setPostEditDraft({
      boardSectionId: activePost.boardSectionId,
      title: activePost.title,
      body: activePost.body,
    });
    setIsEditingActivePost(true);
  }

  function cancelEditingActivePost() {
    setIsEditingActivePost(false);
  }

  function setPostEditDraftField(field: keyof CommunityPostDraftViewModel, value: string) {
    setPostEditDraft((currentDraft) => ({
      ...currentDraft,
      [field]:
        field === "boardSectionId"
          ? (value as CommunityBoardSectionId)
          : value,
    }));
  }

  async function submitPostEdit() {
    const targetPost = activePost;
    const normalizedTitle = postEditDraft.title.trim();
    const normalizedBody = postEditDraft.body.trim();

    if (targetPost === null || normalizedTitle.length === 0 || normalizedBody.length === 0) {
      return;
    }

    if (currentUser === null) {
      returnToHomeForLoginRequiredFeature();
      return;
    }

    setCommunitySyncStatus("saving");
    setCommunitySyncMessage("게시글을 수정하고 있습니다.");

    try {
      await updateCommunityPost(targetPost.id, {
        boardSectionId: postEditDraft.boardSectionId,
        title: normalizedTitle,
        body: normalizedBody,
      });

      const [remotePosts, refreshedPost] = await Promise.all([
        fetchCommunityPosts("all"),
        fetchCommunityPostThread(targetPost.id),
      ]);

      setBoardPosts(remotePosts);
      setActivePost(refreshedPost);
      setActiveCommunityBoardSectionId(refreshedPost.boardSectionId);
      setIsEditingActivePost(false);
      setCommunitySyncStatus("ready");
      setCommunitySyncMessage("게시글을 수정했습니다.");
    } catch (error) {
      if (isMissingTokenError(error)) {
        setAuthStatus("anonymous");
        setCurrentUser(null);
      }

      setCommunitySyncStatus("error");
      setCommunitySyncMessage(getApiErrorMessage(error, "게시글 수정에 실패했습니다."));
    }
  }

  async function deleteActivePost() {
    const targetPost = activePost;

    if (targetPost === null) {
      return;
    }

    if (currentUser === null) {
      returnToHomeForLoginRequiredFeature();
      return;
    }

    if (!confirmBrowserAction("게시글을 삭제할까요?")) {
      return;
    }

    setCommunitySyncStatus("saving");
    setCommunitySyncMessage("게시글을 삭제하고 있습니다.");

    try {
      await deleteCommunityPost(targetPost.id);
      const remotePosts = await fetchCommunityPosts("all");

      setBoardPosts(remotePosts);
      setActivePostId(null);
      setActivePost(null);
      setIsEditingActivePost(false);
      setActiveSection("community");
      setCommunitySyncStatus("ready");
      setCommunitySyncMessage("게시글을 삭제했습니다.");
      scrollToTop();
    } catch (error) {
      if (isMissingTokenError(error)) {
        setAuthStatus("anonymous");
        setCurrentUser(null);
      }

      setCommunitySyncStatus("error");
      setCommunitySyncMessage(getApiErrorMessage(error, "게시글 삭제에 실패했습니다."));
    }
  }

  async function submitPostComment() {
    const targetPost = activePost;
    const normalizedComment = postCommentDraft.trim();

    if (targetPost === null || normalizedComment.length === 0) {
      return;
    }

    if (currentUser === null) {
      returnToHomeForLoginRequiredFeature();
      return;
    }

    setCommunitySyncStatus("saving");
    setCommunitySyncMessage("댓글을 저장하고 있습니다.");

    try {
      await createCommunityComment(targetPost.id, normalizedComment);

      const refreshedPost = await fetchCommunityPostThread(targetPost.id);

      setPostCommentDraft("");
      setActivePost(refreshedPost);
      updateBoardPostFromDetail(refreshedPost);
      setCommunitySyncStatus("ready");
      setCommunitySyncMessage(null);
    } catch (error) {
      if (isMissingTokenError(error)) {
        setAuthStatus("anonymous");
        setCurrentUser(null);
      }

      setCommunitySyncStatus("error");
      setCommunitySyncMessage(getApiErrorMessage(error, "댓글 등록에 실패했습니다."));
    }
  }

  function startEditingComment(commentId: string) {
    const targetComment = activePost?.comments.find((comment) => comment.id === commentId);

    if (targetComment === undefined || !targetComment.isMine) {
      return;
    }

    setEditingCommentId(commentId);
    setCommentEditDraft(targetComment.body);
  }

  function cancelEditingComment() {
    setEditingCommentId(null);
    setCommentEditDraft("");
  }

  async function submitCommentEdit() {
    const targetPost = activePost;
    const targetCommentId = editingCommentId;
    const normalizedComment = commentEditDraft.trim();

    if (targetPost === null || targetCommentId === null || normalizedComment.length === 0) {
      return;
    }

    if (currentUser === null) {
      returnToHomeForLoginRequiredFeature();
      return;
    }

    setCommunitySyncStatus("saving");
    setCommunitySyncMessage("댓글을 수정하고 있습니다.");

    try {
      await updateCommunityComment(targetCommentId, normalizedComment);

      const refreshedPost = await fetchCommunityPostThread(targetPost.id);

      setEditingCommentId(null);
      setCommentEditDraft("");
      setActivePost(refreshedPost);
      updateBoardPostFromDetail(refreshedPost);
      setCommunitySyncStatus("ready");
      setCommunitySyncMessage("댓글을 수정했습니다.");
    } catch (error) {
      if (isMissingTokenError(error)) {
        setAuthStatus("anonymous");
        setCurrentUser(null);
      }

      setCommunitySyncStatus("error");
      setCommunitySyncMessage(getApiErrorMessage(error, "댓글 수정에 실패했습니다."));
    }
  }

  async function deleteComment(commentId: string) {
    const targetPost = activePost;

    if (targetPost === null) {
      return;
    }

    if (currentUser === null) {
      returnToHomeForLoginRequiredFeature();
      return;
    }

    if (!confirmBrowserAction("댓글을 삭제할까요?")) {
      return;
    }

    setCommunitySyncStatus("saving");
    setCommunitySyncMessage("댓글을 삭제하고 있습니다.");

    try {
      await deleteCommunityComment(commentId);

      const [remotePosts, refreshedPost] = await Promise.all([
        fetchCommunityPosts("all"),
        fetchCommunityPostThread(targetPost.id),
      ]);

      setBoardPosts(remotePosts);
      setActivePost(refreshedPost);
      setEditingCommentId(null);
      setCommentEditDraft("");
      setCommunitySyncStatus("ready");
      setCommunitySyncMessage("댓글을 삭제했습니다.");
    } catch (error) {
      if (isMissingTokenError(error)) {
        setAuthStatus("anonymous");
        setCurrentUser(null);
      }

      setCommunitySyncStatus("error");
      setCommunitySyncMessage(getApiErrorMessage(error, "댓글 삭제에 실패했습니다."));
    }
  }

  async function toggleActivePostLike() {
    const previousPost = activePost;

    if (previousPost === null) {
      return;
    }

    if (currentUser === null) {
      returnToHomeForLoginRequiredFeature();
      return;
    }

    const optimisticPost: BoardPostViewModel = {
      ...previousPost,
      likedByMe: !previousPost.likedByMe,
      likeCount: Math.max(
        0,
        previousPost.likeCount + (previousPost.likedByMe ? -1 : 1),
      ),
    };

    setActivePost(optimisticPost);
    updateBoardPostFromDetail(optimisticPost);

    try {
      const likeResult = previousPost.likedByMe
        ? await unlikeCommunityPost(previousPost.id)
        : await likeCommunityPost(previousPost.id);
      const confirmedPost: BoardPostViewModel = {
        ...optimisticPost,
        likedByMe: likeResult.liked,
        likeCount: likeResult.likeCount,
      };

      setActivePost(confirmedPost);
      updateBoardPostFromDetail(confirmedPost);
      setCommunitySyncStatus("ready");
      setCommunitySyncMessage(null);
    } catch (error) {
      setActivePost(previousPost);
      updateBoardPostFromDetail(previousPost);
      setCommunitySyncStatus("error");
      setCommunitySyncMessage(getApiErrorMessage(error, "좋아요 변경에 실패했습니다."));

      if (isMissingTokenError(error)) {
        setAuthStatus("anonymous");
        setCurrentUser(null);
      }

      if (isLikeStateConflictError(error)) {
        void reloadActivePost(previousPost.id);
      }
    }
  }

  function openPost(postId: string) {
    if (currentUser === null) {
      returnToHomeForLoginRequiredFeature();
      return;
    }

    const localPost = boardPosts.find((post) => post.id === postId) ?? null;

    setActivePostId(postId);
    setActivePost(localPost);
    setActiveSection("post");
    setPostCommentDraft("");
    setIsEditingActivePost(false);
    setEditingCommentId(null);
    setCommentEditDraft("");
    scrollToTop();
    void reloadActivePost(postId);
  }

  async function reloadActivePost(postId: string) {
    setCommunitySyncStatus("loading");

    try {
      const remotePost = await fetchCommunityPostThread(postId);

      if (activePostId === null || activePostId === postId) {
        setActivePost(remotePost);
      }

      updateBoardPostFromDetail(remotePost);
      setCommunitySyncStatus("ready");
      setCommunitySyncMessage(null);
    } catch (error) {
      setCommunitySyncStatus("error");
      setCommunitySyncMessage(getApiErrorMessage(error, "게시글 상세를 불러오지 못했습니다."));
    }
  }

  async function reloadNewsDashboard(successMessage: string | null) {
    setNewsDashboardSyncStatus("loading");
    setNewsDashboardSyncMessage(null);

    try {
      const dashboard = await fetchNewsDashboard();

      setNewsDashboard(dashboard);
      setNewsDashboardSyncStatus("ready");
      setNewsDashboardSyncMessage(successMessage);
    } catch (error) {
      if (isMissingTokenError(error)) {
        setAuthStatus("anonymous");
        setCurrentUser(null);
      }

      setNewsDashboardSyncStatus("error");
      setNewsDashboardSyncMessage(
        getApiErrorMessage(error, "뉴스 대시보드를 불러오지 못했습니다."),
      );
    }
  }

  function updateBoardPostFromDetail(post: BoardPostViewModel) {
    setBoardPosts((currentPosts) =>
      currentPosts.map((currentPost) =>
        currentPost.id === post.id
          ? {
              ...currentPost,
              author: post.author,
              likeCount: post.likeCount,
              commentCount: post.commentCount,
              viewCount: post.viewCount,
              isMine: post.isMine,
              likedByMe: post.likedByMe,
            }
          : currentPost,
      ),
    );
  }

  function returnToHomeForLoginRequiredFeature() {
    setActiveSection("home");
    setActivePostId(null);
    setActivePost(null);
    setCommunitySyncMessage(null);
    setKeywordSyncMessage(null);
    setNewsSyncMessage("로그인 후 추천 뉴스를 확인할 수 있습니다.");
    setTrendAnalysisSyncMessage("로그인 후 브리핑 지표를 확인할 수 있습니다.");
    showLoginRequiredAlert();
    scrollToTop();
  }

  return {
    activeSection,
    activePost,
    activeCommunityBoardSectionId,
    authMessage,
    authStatus,
    communityBoardSections,
    communityPosts: boardPosts,
    communitySyncMessage,
    communitySyncStatus,
    currentUser,
    visibleCommunityPosts,
    postDraft,
    postEditDraft,
    postCommentDraft,
    commentEditDraft,
    canSubmitPostDraft,
    canSubmitPostEdit,
    canSubmitPostComment,
    canSubmitCommentEdit,
    keywords,
    keywordDraft,
    bookmarkedNewsIds,
    batchNewsSummary,
    isSummarizingNewsBatch,
    newsBookmarks,
    newsDashboard,
    newsDashboardSyncMessage,
    newsDashboardSyncStatus,
    newsRecommendation,
    newsSummariesByArticleId,
    newsSyncMessage,
    newsSyncStatus,
    trendAnalysisSummary,
    trendAnalysisSyncMessage,
    trendAnalysisSyncStatus,
    onboardingKeywordDraft,
    keywordSyncMessage,
    keywordSyncStatus,
    selectedOnboardingKeywordNames,
    summarizingNewsId,
    editingCommentId,
    isEditingActivePost,
    canSubmitOnboardingKeywords,
    goToSection,
    login,
    logout,
    setKeywordDraft,
    setOnboardingKeywordDraft,
    setCommentEditDraft,
    setPostCommentDraft,
    addKeyword,
    addCustomOnboardingKeyword,
    refreshNewsDashboard,
    refreshNewsRecommendations,
    summarizeRecommendedNewsBatch,
    summarizeRecommendedNews,
    toggleNewsBookmark,
    startLoginWithOnboardingKeywords,
    startLoginWithoutOnboardingKeywords,
    setCommunityBoardSection,
    setPostDraftField,
    setPostEditDraftField,
    submitPostDraft,
    startEditingActivePost,
    cancelEditingActivePost,
    submitPostEdit,
    deleteActivePost,
    submitPostComment,
    startEditingComment,
    cancelEditingComment,
    submitCommentEdit,
    deleteComment,
    toggleActivePostLike,
    toggleOnboardingKeyword,
    openPost,
  };
}

function scrollToTop() {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function showLoginRequiredAlert() {
  if (typeof window !== "undefined") {
    window.alert("로그인이 필요한 기능입니다.");
  }
}

function confirmBrowserAction(message: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.confirm(message);
}

function shouldShowSignupOnboarding(
  oauthSignupHint: OAuthSignupHint | null,
  remoteKeywords: readonly KeywordViewModel[],
): boolean {
  if (remoteKeywords.length > 0 || oauthSignupHint === null || oauthSignupHint === "login") {
    return false;
  }

  return oauthSignupHint === "signup" || oauthSignupHint === "unknown";
}

function isMissingTokenError(error: unknown): boolean {
  return error instanceof ApiClientError && error.errorCode === "MISSING_ACCESS_TOKEN";
}

function isLikeStateConflictError(error: unknown): boolean {
  return (
    error instanceof ApiClientError &&
    (error.errorCode === "LIKE_ALREADY_EXISTS" || error.errorCode === "LIKE_NOT_FOUND")
  );
}

function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof ApiClientError || error instanceof EnvironmentConfigurationError) {
    return error.message;
  }

  return fallbackMessage;
}
