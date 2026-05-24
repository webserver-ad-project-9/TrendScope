"use client";

import { useEffect, useMemo, useState } from "react";
import { EnvironmentConfigurationError } from "@/src/config/environment";
import { ApiClientError } from "@/src/services/apiClient";
import {
  fetchCurrentUser,
  logoutCurrentUser,
  startGoogleOAuthLogin,
} from "@/src/services/authService";
import {
  createOnboardingKeyword,
  fetchOnboardingKeywords,
} from "@/src/services/keywordService";
import { createKeywordSearchBriefing } from "@/src/services/trendDashboardService";
import type { AuthStatus, CurrentUserViewModel, KeywordSyncStatus } from "@/src/types/auth";
import type {
  BoardPostViewModel,
  CommunityBoardFilterId,
  CommunityBoardSectionId,
  CommunityPostDraftViewModel,
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
  readonly communityPosts: readonly BoardPostViewModel[];
  readonly currentUser: CurrentUserViewModel | null;
  readonly visibleCommunityPosts: readonly BoardPostViewModel[];
  readonly postDraft: CommunityPostDraftViewModel;
  readonly canSubmitPostDraft: boolean;
  readonly keywords: readonly KeywordViewModel[];
  readonly keywordDraft: string;
  readonly keywordSyncMessage: string | null;
  readonly keywordSyncStatus: KeywordSyncStatus;
  readonly searchDraft: string;
  readonly searchBriefing: KeywordSearchBriefingViewModel | null;
  readonly goToSection: (section: TrendScopeSection) => void;
  readonly login: () => void;
  readonly logout: () => Promise<void>;
  readonly setKeywordDraft: (value: string) => void;
  readonly setSearchDraft: (value: string) => void;
  readonly addKeyword: () => Promise<void>;
  readonly requestKeywordSearch: () => void;
  readonly setCommunityBoardSection: (sectionId: CommunityBoardFilterId) => void;
  readonly setPostDraftField: (field: keyof CommunityPostDraftViewModel, value: string) => void;
  readonly submitPostDraft: () => void;
  readonly openPost: (postId: string) => void;
}

/**
 * 화면 내 탭 이동, 키워드 편집, 검색 결과 표시 등 브라우저 상호작용 상태를 관리한다.
 * 실제 백엔드 API 호출은 service 경계를 통해 수행한다.
 */
export function useTrendScopeWorkspace(
  snapshot: TrendDashboardSnapshot,
): TrendScopeWorkspaceState {
  const [activeSection, setActiveSection] = useState<TrendScopeSection>("home");
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [activeCommunityBoardSectionId, setActiveCommunityBoardSectionId] =
    useState<CommunityBoardFilterId>("all");
  const [keywords, setKeywords] = useState<readonly KeywordViewModel[]>(snapshot.keywords);
  const [boardPosts, setBoardPosts] = useState<readonly BoardPostViewModel[]>(snapshot.boardPosts);
  const [currentUser, setCurrentUser] = useState<CurrentUserViewModel | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("checking");
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [keywordSyncStatus, setKeywordSyncStatus] = useState<KeywordSyncStatus>("idle");
  const [keywordSyncMessage, setKeywordSyncMessage] = useState<string | null>(null);
  const [postDraft, setPostDraft] = useState<CommunityPostDraftViewModel>({
    boardSectionId: "economy",
    category: "토론",
    title: "",
    body: "",
  });
  const [keywordDraft, setKeywordDraft] = useState("");
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

  const activePost = useMemo(() => {
    if (activePostId === null) {
      return null;
    }

    return boardPosts.find((post) => post.id === activePostId) ?? null;
  }, [activePostId, boardPosts]);

  const visibleCommunityPosts = useMemo(() => {
    if (activeCommunityBoardSectionId === "all") {
      return boardPosts;
    }

    return boardPosts.filter((post) => post.boardSectionId === activeCommunityBoardSectionId);
  }, [activeCommunityBoardSectionId, boardPosts]);

  const canSubmitPostDraft =
    postDraft.title.trim().length > 0 && postDraft.body.trim().length > 0;

  function goToSection(section: TrendScopeSection) {
    setActiveSection(section);

    if (section !== "post") {
      setActivePostId(null);
    }

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function login() {
    try {
      startGoogleOAuthLogin();
    } catch (error) {
      setAuthStatus("error");
      setAuthMessage(getApiErrorMessage(error, "로그인 설정을 확인하지 못했습니다."));
    }
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
    setKeywords(snapshot.keywords);
    setKeywordSyncStatus("idle");
    setKeywordSyncMessage("로그아웃되어 로컬 예시 키워드를 표시합니다.");
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

  function submitPostDraft() {
    const normalizedTitle = postDraft.title.trim();
    const normalizedBody = postDraft.body.trim();

    if (normalizedTitle.length === 0 || normalizedBody.length === 0) {
      return;
    }

    const createdPost: BoardPostViewModel = {
      id: `post-local-${Date.now()}`,
      boardSectionId: postDraft.boardSectionId,
      category: postDraft.category,
      title: normalizedTitle,
      author: "나",
      commentCount: 0,
      body: normalizedBody,
      comments: [],
    };

    setBoardPosts((currentPosts) => [createdPost, ...currentPosts]);
    setActiveCommunityBoardSectionId(postDraft.boardSectionId);
    setPostDraft({
      boardSectionId: postDraft.boardSectionId,
      category: "토론",
      title: "",
      body: "",
    });
    setActiveSection("community");

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function openPost(postId: string) {
    setActivePostId(postId);
    setActiveSection("post");

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return {
    activeSection,
    activePost,
    activeCommunityBoardSectionId,
    authMessage,
    authStatus,
    communityPosts: boardPosts,
    currentUser,
    visibleCommunityPosts,
    postDraft,
    canSubmitPostDraft,
    keywords,
    keywordDraft,
    keywordSyncMessage,
    keywordSyncStatus,
    searchDraft,
    searchBriefing,
    goToSection,
    login,
    logout,
    setKeywordDraft,
    setSearchDraft,
    addKeyword,
    requestKeywordSearch,
    setCommunityBoardSection,
    setPostDraftField,
    submitPostDraft,
    openPost,
  };
}

function isMissingTokenError(error: unknown): boolean {
  return error instanceof ApiClientError && error.errorCode === "MISSING_ACCESS_TOKEN";
}

function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof ApiClientError || error instanceof EnvironmentConfigurationError) {
    return error.message;
  }

  return fallbackMessage;
}
