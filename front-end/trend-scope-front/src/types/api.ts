export interface ApiSuccessResponseDto<TData> {
  readonly success: true;
  readonly data: TData;
  readonly message: string;
}

export interface ApiErrorResponseDto {
  readonly success: false;
  readonly errorCode: string;
  readonly message: string;
}

export type ApiResponseDto<TData> = ApiSuccessResponseDto<TData> | ApiErrorResponseDto;

export interface CurrentUserResponseDto {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: string;
}

export interface KeywordResponseDto {
  readonly id: string;
  readonly name: string;
}

export interface NewsRecommendationKeywordResponseDto {
  readonly id: string;
  readonly name: string;
}

export interface RecommendedNewsResponseDto {
  readonly id: string;
  readonly keywordId: string;
  readonly matchedKeyword: string;
  readonly title: string;
  readonly description: string | null;
  readonly originUrl: string;
  readonly publishedAt: string | null;
  readonly recommendationReason: string;
}

export interface NewsRecommendationResponseDto {
  readonly keywords: readonly NewsRecommendationKeywordResponseDto[];
  readonly articles: readonly RecommendedNewsResponseDto[];
  readonly refreshed: boolean;
}

export interface NewsSummarySourceResponseDto {
  readonly id: string;
  readonly title: string;
  readonly originUrl: string;
  readonly publishedAt: string | null;
}

export interface NewsSummaryResponseDto {
  readonly newsIds: readonly string[];
  readonly summary: string;
  readonly sources: readonly NewsSummarySourceResponseDto[];
}

export interface NewsSummaryRequestDto {
  readonly newsIds: readonly string[];
  readonly maxSentenceCount?: number;
}

export interface TrendAnalysisSummaryResponseDto {
  readonly trendScore: number;
}

export interface CreateKeywordRequestDto {
  readonly name: string;
}

export interface CreateKeywordsBulkRequestDto {
  readonly names: readonly string[];
}

export type CommunityCategoryCodeDto =
  | "POLITICS"
  | "ECONOMY"
  | "IT_SCIENCE"
  | "SOCIETY"
  | "WORLD"
  | "SPORTS"
  | "ENTERTAINMENT";

export interface CommunityCategoryResponseDto {
  readonly code: CommunityCategoryCodeDto;
  readonly label: string;
}

export interface PageResponseDto<TItem> {
  readonly content: readonly TItem[];
  readonly page: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
}

export interface CommunityPostListItemResponseDto {
  readonly id: string;
  readonly category: CommunityCategoryCodeDto;
  readonly title: string;
  readonly writerName: string;
  readonly likeCount: number;
  readonly commentCount: number;
  readonly viewCount: number;
  readonly createdAt: string;
  readonly isMine: boolean;
}

export interface CommunityPostDetailResponseDto {
  readonly id: string;
  readonly category: CommunityCategoryCodeDto;
  readonly title: string;
  readonly content: string;
  readonly writer: {
    readonly id: string;
    readonly name: string;
  };
  readonly likeCount: number;
  readonly commentCount: number;
  readonly viewCount: number;
  readonly likedByMe: boolean;
  readonly isMine: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateCommunityPostRequestDto {
  readonly category: CommunityCategoryCodeDto;
  readonly title: string;
  readonly content: string;
}

export interface CreateCommunityPostResponseDto {
  readonly id: string;
}

export interface CommunityCommentResponseDto {
  readonly id: string;
  readonly content: string;
  readonly writerName: string;
  readonly isMine: boolean;
  readonly createdAt: string;
}

export interface CreateCommunityCommentRequestDto {
  readonly content: string;
}

export interface CommunityPostLikeResponseDto {
  readonly postId: string;
  readonly liked: boolean;
  readonly likeCount: number;
}
