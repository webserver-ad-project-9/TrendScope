"use client";

import { useEffect, useMemo, useState } from "react";
import { EnvironmentConfigurationError } from "@/src/config/environment";
import { ApiClientError } from "@/src/services/apiClient";
import {
  createCommunityComment,
  createCommunityPost,
  fetchCommunityBoardSections,
  fetchCommunityPostThread,
  fetchCommunityPosts,
  likeCommunityPost,
  unlikeCommunityPost,
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
import { createKeywordSearchBriefing } from "@/src/services/trendDashboardService";
import type { AuthStatus, CurrentUserViewModel, KeywordSyncStatus } from "@/src/types/auth";
import type {
  BoardPostViewModel,
  CommunityBoardFilterId,
  CommunityBoardSectionId,
  CommunityBoardSectionViewModel,
  CommunityPostDraftViewModel,
  CommunitySyncStatus,
  KeywordSearchBriefingViewModel,
  KeywordViewModel,
  TrendDashboardSnapshot,
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
  readonly postCommentDraft: string;
  readonly canSubmitPostDraft: boolean;
  readonly canSubmitPostComment: boolean;
  readonly keywords: readonly KeywordViewModel[];
  readonly keywordDraft: string;
  readonly onboardingKeywordDraft: string;
  readonly keywordSyncMessage: string | null;
  readonly keywordSyncStatus: KeywordSyncStatus;
  readonly searchDraft: string;
  readonly searchBriefing: KeywordSearchBriefingViewModel | null;
  readonly selectedOnboardingKeywordNames: readonly string[];
  readonly canSubmitOnboardingKeywords: boolean;
  readonly goToSection: (section: TrendScopeSection) => void;
  readonly login: () => void;
  readonly logout: () => Promise<void>;
  readonly setKeywordDraft: (value: string) => void;
  readonly setOnboardingKeywordDraft: (value: string) => void;
  readonly setPostCommentDraft: (value: string) => void;
  readonly setSearchDraft: (value: string) => void;
  readonly addKeyword: () => Promise<void>;
  readonly addCustomOnboardingKeyword: () => void;
  readonly requestKeywordSearch: () => void;
  readonly startLoginWithOnboardingKeywords: () => Promise<void>;
  readonly startLoginWithoutOnboardingKeywords: () => void;
  readonly setCommunityBoardSection: (sectionId: CommunityBoardFilterId) => void;
  readonly setPostDraftField: (field: keyof CommunityPostDraftViewModel, value: string) => void;
  readonly submitPostDraft: () => Promise<void>;
  readonly submitPostComment: () => Promise<void>;
  readonly toggleActivePostLike: () => Promise<void>;
  readonly toggleOnboardingKeyword: (keywordName: string) => void;
  readonly openPost: (postId: string) => void;
}

/**
 * 화면 내 탭 이동, 키워드 편집, 커뮤니티 API 연동 등 브라우저 상호작용 상태를 관리한다.
 * 실제 백엔드 API 호출은 service 경계를 통해 수행한다.
 */
export function useTrendScopeWorkspace(
  snapshot: TrendDashboardSnapshot,
): TrendScopeWorkspaceState {
  const [activeSection, setActiveSection] = useState<TrendScopeSection>("home");
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [activePost, setActivePost] = useState<BoardPostViewModel | null>(null);
  const [activeCommunityBoardSectionId, setActiveCommunityBoardSectionId] =
    useState<CommunityBoardFilterId>("all");
  const [communityBoardSections, setCommunityBoardSections] = useState<
    readonly CommunityBoardSectionViewModel[]
  >(snapshot.communityBoardSections);
  const [boardPosts, setBoardPosts] = useState<readonly BoardPostViewModel[]>([]);
  const [communitySyncStatus, setCommunitySyncStatus] =
    useState<CommunitySyncStatus>("idle");
  const [communitySyncMessage, setCommunitySyncMessage] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<readonly KeywordViewModel[]>(snapshot.keywords);
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
  const [postCommentDraft, setPostCommentDraft] = useState("");
  const [keywordDraft, setKeywordDraft] = useState("");
  const [onboardingKeywordDraft, setOnboardingKeywordDraft] = useState("");
  const [selectedOnboardingKeywordNames, setSelectedOnboardingKeywordNames] = useState<
    readonly string[]
  >([]);
  const [searchDraft, setSearchDraft] = useState("");
  const [searchBriefing, setSearchBriefing] = useState<KeywordSearchBriefingViewModel | null>(null);

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
            ? "로그인 후 백엔드 키워드를 불러옵니다."
            : getApiErrorMessage(error, "키워드 동기화 준비에 실패했습니다."),
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

  const canSubmitPostDraft =
    postDraft.title.trim().length > 0 &&
    postDraft.body.trim().length > 0 &&
    communitySyncStatus !== "saving";
  const canSubmitPostComment =
    postCommentDraft.trim().length > 0 &&
    activePost !== null &&
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
    if (section === "writePost" && currentUser === null) {
      setCommunitySyncStatus("error");
      setCommunitySyncMessage("로그인 후 게시글을 작성할 수 있습니다.");
      beginGoogleOAuthLogin();
      return;
    }

    setActiveSection(section);

    if (section !== "post") {
      setActivePostId(null);
      setActivePost(null);
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
      beginGoogleOAuthLogin();
      return;
    }

    setKeywordSyncStatus("saving");
    setKeywordSyncMessage(null);

    try {
      const createdKeywords = await createOnboardingKeywordsBulk(selectedOnboardingKeywordNames);

      setKeywords(createdKeywords);
      setSelectedOnboardingKeywordNames([]);
      setKeywordSyncStatus("ready");
      setKeywordSyncMessage("첫 브리핑 키워드를 백엔드에 저장했습니다.");
      setActiveSection("home");
      scrollToTop();
    } catch (error) {
      if (isMissingTokenError(error)) {
        setAuthStatus("anonymous");
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
    setKeywords(snapshot.keywords);
    setKeywordSyncStatus("idle");
    setKeywordSyncMessage("로그아웃되어 로컬 예시 키워드를 표시합니다.");

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
      setAuthStatus("anonymous");
      setKeywordSyncStatus("error");
      setKeywordSyncMessage("로그인 후 키워드를 등록할 수 있습니다.");

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
      setKeywordSyncMessage("키워드를 백엔드에 등록했습니다.");
    } catch (error) {
      if (isMissingTokenError(error)) {
        setAuthStatus("anonymous");
      }

      setKeywordSyncStatus("error");
      setKeywordSyncMessage(getApiErrorMessage(error, "키워드 등록에 실패했습니다."));
    }
  }

  function requestKeywordSearch() {
    const targetKeyword = searchDraft.trim() || "입력한 키워드";

    setSearchBriefing(createKeywordSearchBriefing(targetKeyword, snapshot));
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
      setCommunitySyncStatus("error");
      setCommunitySyncMessage("로그인 후 게시글을 작성할 수 있습니다.");
      beginGoogleOAuthLogin();
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
      setCommunitySyncMessage("게시글을 백엔드에 등록했습니다.");
      scrollToTop();
    } catch (error) {
      if (isMissingTokenError(error)) {
        setAuthStatus("anonymous");
      }

      setCommunitySyncStatus("error");
      setCommunitySyncMessage(getApiErrorMessage(error, "게시글 등록에 실패했습니다."));
    }
  }

  async function submitPostComment() {
    const targetPost = activePost;
    const normalizedComment = postCommentDraft.trim();

    if (targetPost === null || normalizedComment.length === 0) {
      return;
    }

    if (currentUser === null) {
      setCommunitySyncStatus("error");
      setCommunitySyncMessage("로그인 후 댓글을 작성할 수 있습니다.");
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
      }

      setCommunitySyncStatus("error");
      setCommunitySyncMessage(getApiErrorMessage(error, "댓글 등록에 실패했습니다."));
    }
  }

  async function toggleActivePostLike() {
    const previousPost = activePost;

    if (previousPost === null) {
      return;
    }

    if (currentUser === null) {
      setCommunitySyncStatus("error");
      setCommunitySyncMessage("로그인 후 좋아요를 누를 수 있습니다.");
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

      if (isLikeStateConflictError(error)) {
        void reloadActivePost(previousPost.id);
      }
    }
  }

  function openPost(postId: string) {
    const localPost = boardPosts.find((post) => post.id === postId) ?? null;

    setActivePostId(postId);
    setActivePost(localPost);
    setActiveSection("post");
    setPostCommentDraft("");
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
    postCommentDraft,
    canSubmitPostDraft,
    canSubmitPostComment,
    keywords,
    keywordDraft,
    onboardingKeywordDraft,
    keywordSyncMessage,
    keywordSyncStatus,
    searchDraft,
    searchBriefing,
    selectedOnboardingKeywordNames,
    canSubmitOnboardingKeywords,
    goToSection,
    login,
    logout,
    setKeywordDraft,
    setOnboardingKeywordDraft,
    setPostCommentDraft,
    setSearchDraft,
    addKeyword,
    addCustomOnboardingKeyword,
    requestKeywordSearch,
    startLoginWithOnboardingKeywords,
    startLoginWithoutOnboardingKeywords,
    setCommunityBoardSection,
    setPostDraftField,
    submitPostDraft,
    submitPostComment,
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
