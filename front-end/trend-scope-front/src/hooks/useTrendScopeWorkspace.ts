"use client";

import { useMemo, useState } from "react";
import { createKeywordSearchBriefing } from "@/src/services/trendDashboardService";
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
  readonly communityPosts: readonly BoardPostViewModel[];
  readonly visibleCommunityPosts: readonly BoardPostViewModel[];
  readonly postDraft: CommunityPostDraftViewModel;
  readonly canSubmitPostDraft: boolean;
  readonly keywords: readonly KeywordViewModel[];
  readonly keywordDraft: string;
  readonly searchDraft: string;
  readonly searchBriefing: KeywordSearchBriefingViewModel | null;
  readonly goToSection: (section: TrendScopeSection) => void;
  readonly setKeywordDraft: (value: string) => void;
  readonly setSearchDraft: (value: string) => void;
  readonly addKeyword: () => void;
  readonly editKeyword: (keywordId: string) => void;
  readonly deleteKeyword: (keywordId: string) => void;
  readonly requestKeywordSearch: () => void;
  readonly setCommunityBoardSection: (sectionId: CommunityBoardFilterId) => void;
  readonly setPostDraftField: (field: keyof CommunityPostDraftViewModel, value: string) => void;
  readonly submitPostDraft: () => void;
  readonly openPost: (postId: string) => void;
}

/**
 * 화면 내 탭 이동, 키워드 편집, 검색 결과 표시 등 브라우저 상호작용 상태를 관리한다.
 * 서버/API 상태와 persistence는 다루지 않는다.
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
  const [postDraft, setPostDraft] = useState<CommunityPostDraftViewModel>({
    boardSectionId: "economy",
    category: "토론",
    title: "",
    body: "",
  });
  const [keywordDraft, setKeywordDraft] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [searchBriefing, setSearchBriefing] = useState<KeywordSearchBriefingViewModel | null>(null);

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

  function addKeyword() {
    const normalizedKeyword = keywordDraft.trim();

    if (normalizedKeyword.length === 0) {
      return;
    }

    setKeywords((currentKeywords) => [
      ...currentKeywords,
      {
        id: `keyword-${Date.now()}`,
        label: normalizedKeyword,
        isHot: false,
        isActive: true,
      },
    ]);
    setKeywordDraft("");
  }

  function editKeyword(keywordId: string) {
    const currentKeyword = keywords.find((keyword) => keyword.id === keywordId);

    if (currentKeyword === undefined) {
      return;
    }

    const nextKeyword = window.prompt("수정할 키워드", currentKeyword.label)?.trim();

    if (nextKeyword === undefined || nextKeyword.length === 0) {
      return;
    }

    setKeywords((currentKeywords) =>
      currentKeywords.map((keyword) =>
        keyword.id === keywordId ? { ...keyword, label: nextKeyword } : keyword,
      ),
    );
  }

  function deleteKeyword(keywordId: string) {
    setKeywords((currentKeywords) =>
      currentKeywords.filter((keyword) => keyword.id !== keywordId),
    );
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
    communityPosts: boardPosts,
    visibleCommunityPosts,
    postDraft,
    canSubmitPostDraft,
    keywords,
    keywordDraft,
    searchDraft,
    searchBriefing,
    goToSection,
    setKeywordDraft,
    setSearchDraft,
    addKeyword,
    editKeyword,
    deleteKeyword,
    requestKeywordSearch,
    setCommunityBoardSection,
    setPostDraftField,
    submitPostDraft,
    openPost,
  };
}
