export type TrendScopeSection =
  | "home"
  | "briefing"
  | "search"
  | "mypage"
  | "community"
  | "writePost"
  | "post";

export type CommunityBoardSectionId =
  | "economy"
  | "society"
  | "it"
  | "politics"
  | "culture"
  | "global";

export type CommunityBoardFilterId = "all" | CommunityBoardSectionId;

export interface MetricViewModel {
  readonly label: string;
  readonly value: string;
}

export interface KeywordViewModel {
  readonly id: string;
  readonly label: string;
  readonly isHot: boolean;
  readonly isActive: boolean;
}

export interface NewsArticleViewModel {
  readonly id: string;
  readonly time: string;
  readonly title: string;
  readonly source: string;
  readonly href: string;
}

export interface BoardPostViewModel {
  readonly id: string;
  readonly boardSectionId: CommunityBoardSectionId;
  readonly category: string;
  readonly title: string;
  readonly author: string;
  readonly commentCount: number;
  readonly body: string;
  readonly comments: readonly PostCommentViewModel[];
}

export interface PostCommentViewModel {
  readonly id: string;
  readonly author: string;
  readonly body: string;
}

export interface CommunityBoardSectionViewModel {
  readonly id: CommunityBoardSectionId;
  readonly label: string;
  readonly description: string;
}

export interface CommunityPostDraftViewModel {
  readonly boardSectionId: CommunityBoardSectionId;
  readonly category: string;
  readonly title: string;
  readonly body: string;
}

export interface TrendPointViewModel {
  readonly label: string;
  readonly count: number;
}

export interface WordFrequencyViewModel {
  readonly label: string;
  readonly weight: number;
}

export interface RelatedKeywordViewModel {
  readonly label: string;
  readonly description: string;
}

export interface TrendDashboardSnapshot {
  readonly heroMetrics: readonly MetricViewModel[];
  readonly featureChips: readonly string[];
  readonly keywords: readonly KeywordViewModel[];
  readonly summaryHighlights: readonly string[];
  readonly newsArticles: readonly NewsArticleViewModel[];
  readonly communityBoardSections: readonly CommunityBoardSectionViewModel[];
  readonly boardPosts: readonly BoardPostViewModel[];
  readonly trendPoints: readonly TrendPointViewModel[];
  readonly wordFrequencies: readonly WordFrequencyViewModel[];
  readonly relatedKeywords: readonly RelatedKeywordViewModel[];
}

export interface BriefingViewModel {
  readonly title: string;
  readonly description: string;
  readonly summaryIntro: string;
  readonly keywordPanelTitle: string;
  readonly keywords: readonly KeywordViewModel[];
  readonly summaryHighlights: readonly string[];
  readonly newsArticles: readonly NewsArticleViewModel[];
  readonly trendPoints: readonly TrendPointViewModel[];
  readonly wordFrequencies: readonly WordFrequencyViewModel[];
  readonly relatedKeywords: readonly RelatedKeywordViewModel[];
}

export interface KeywordSearchBriefingViewModel extends BriefingViewModel {
  readonly keyword: string;
}
