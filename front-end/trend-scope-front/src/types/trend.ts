export type TrendScopeSection =
  | "home"
  | "onboarding"
  | "briefing"
  | "dashboard"
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

export type NewsDashboardSyncStatus = "idle" | "loading" | "saving" | "ready" | "error";

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

export interface KeywordBriefingArticleViewModel {
  readonly title: string;
  readonly originUrl: string;
  readonly publishedAt: string | null;
  readonly publishedAtLabel: string;
}

export interface KeywordBriefingGroupViewModel {
  readonly keyword: string;
  readonly collectedCount: number;
  readonly summary: string;
  readonly articles: readonly KeywordBriefingArticleViewModel[];
}

export interface KeywordBriefingViewModel {
  readonly date: string;
  readonly summaryType: "KEYWORD_GROUP_SUMMARY";
  readonly totalCollectedCount: number;
  readonly summaries: readonly KeywordBriefingGroupViewModel[];
}

export interface KeywordFrequencyItemViewModel {
  readonly keyword: string;
  readonly count: number;
  readonly weight: number;
}

export interface KeywordFrequencyViewModel {
  readonly articleCount: number;
  readonly keywords: readonly KeywordFrequencyItemViewModel[];
}

export interface NewsTrendScoreItemViewModel {
  readonly keywordId: string;
  readonly keyword: string;
  readonly articleCount: number;
  readonly trendScore: number;
  readonly trendScoreLabel: string;
}

export interface TodayIssueViewModel {
  readonly issues: readonly string[];
}

export interface DailyNewsCountItemViewModel {
  readonly date: string;
  readonly count: number;
}

export interface NewsClusterArticleViewModel {
  readonly title: string;
  readonly originUrl: string;
  readonly publishedAt: string | null;
  readonly publishedAtLabel: string;
}

export interface NewsClusterViewModel {
  readonly topic: string;
  readonly articleCount: number;
  readonly articles: readonly NewsClusterArticleViewModel[];
}

export type NewsSentiment = "POSITIVE" | "NEUTRAL" | "NEGATIVE";

export type NewsRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface NewsSentimentViewModel {
  readonly keywordId: string;
  readonly keyword: string;
  readonly sentiment: NewsSentiment;
  readonly riskLevel: NewsRiskLevel;
  readonly reason: string;
}

export interface NewsBookmarkViewModel {
  readonly bookmarkId: string;
  readonly newsId: string;
  readonly title: string;
  readonly originUrl: string;
  readonly publishedAt: string | null;
  readonly publishedAtLabel: string;
}

export interface NewsDashboardViewModel {
  readonly keywordBriefing: KeywordBriefingViewModel;
  readonly keywordFrequency: KeywordFrequencyViewModel;
  readonly trendScores: readonly NewsTrendScoreItemViewModel[];
  readonly todayIssues: TodayIssueViewModel;
  readonly suggestedKeywords: readonly KeywordFrequencyItemViewModel[];
  readonly dailyNewsCounts: readonly DailyNewsCountItemViewModel[];
  readonly clusters: readonly NewsClusterViewModel[];
  readonly sentiments: readonly NewsSentimentViewModel[];
  readonly bookmarks: readonly NewsBookmarkViewModel[];
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
