export type TrendScopeSection =
  | "home"
  | "onboarding"
  | "briefing"
  | "mypage"
  | "community"
  | "writePost"
  | "post";

export type CommunityBoardSectionId =
  | "politics"
  | "economy"
  | "society"
  | "it"
  | "global"
  | "sports"
  | "entertainment";

export type CommunityBoardFilterId = "all" | CommunityBoardSectionId;

export type CommunitySyncStatus = "idle" | "loading" | "saving" | "ready" | "error";

export type NewsSyncStatus =
  | "idle"
  | "loading"
  | "refreshing"
  | "summarizing"
  | "ready"
  | "error";

export type TrendAnalysisSyncStatus = "idle" | "loading" | "ready" | "error";

export interface KeywordViewModel {
  readonly id: string;
  readonly label: string;
  readonly isHot: boolean;
  readonly isActive: boolean;
}

export interface NewsRecommendationKeywordViewModel {
  readonly id: string;
  readonly label: string;
}

export interface RecommendedNewsArticleViewModel {
  readonly id: string;
  readonly keywordId: string;
  readonly matchedKeyword: string;
  readonly title: string;
  readonly description: string | null;
  readonly originUrl: string;
  readonly publishedAt: string | null;
  readonly publishedAtLabel: string;
  readonly recommendationReason: string;
}

export interface NewsSummarySourceViewModel {
  readonly id: string;
  readonly title: string;
  readonly originUrl: string;
  readonly publishedAt: string | null;
  readonly publishedAtLabel: string;
}

export interface NewsSummaryViewModel {
  readonly newsIds: readonly string[];
  readonly summary: string;
  readonly sources: readonly NewsSummarySourceViewModel[];
}

export interface NewsRecommendationViewModel {
  readonly keywords: readonly NewsRecommendationKeywordViewModel[];
  readonly articles: readonly RecommendedNewsArticleViewModel[];
  readonly refreshed: boolean;
}

export interface TrendAnalysisSummaryViewModel {
  readonly trendScore: number;
  readonly trendScoreLabel: string;
}

export interface BoardPostViewModel {
  readonly id: string;
  readonly boardSectionId: CommunityBoardSectionId;
  readonly category: string;
  readonly title: string;
  readonly author: string;
  readonly likeCount: number;
  readonly commentCount: number;
  readonly viewCount: number;
  readonly createdAt: string;
  readonly isMine: boolean;
  readonly likedByMe: boolean;
  readonly body: string;
  readonly comments: readonly PostCommentViewModel[];
}

export interface PostCommentViewModel {
  readonly id: string;
  readonly author: string;
  readonly body: string;
  readonly createdAt: string;
  readonly isMine: boolean;
}

export interface CommunityBoardSectionViewModel {
  readonly id: CommunityBoardSectionId;
  readonly label: string;
}

export interface CommunityPostDraftViewModel {
  readonly boardSectionId: CommunityBoardSectionId;
  readonly title: string;
  readonly body: string;
}
