import type {
  NewsRecommendationResponseDto,
  NewsSummaryRequestDto,
  NewsSummaryResponseDto,
  NewsSummarySourceResponseDto,
  RecommendedNewsResponseDto,
} from "@/src/types/api";
import type {
  NewsRecommendationViewModel,
  NewsSummarySourceViewModel,
  NewsSummaryViewModel,
  RecommendedNewsArticleViewModel,
} from "@/src/types/trend";
import { requestBackendApi } from "./apiClient";

const defaultRecommendationLimit = 20;

interface FetchNewsRecommendationOptions {
  readonly refresh?: boolean;
  readonly limit?: number;
}

interface SummarizeNewsArticlesOptions {
  readonly newsIds: readonly string[];
  readonly maxSentenceCount?: number;
}

/**
 * 로그인 사용자의 온보딩 키워드 기준 추천 뉴스를 조회한다.
 */
export async function fetchNewsRecommendations({
  limit = defaultRecommendationLimit,
  refresh = false,
}: FetchNewsRecommendationOptions = {}): Promise<NewsRecommendationViewModel> {
  const params = new URLSearchParams({
    refresh: String(refresh),
    limit: String(limit),
  });
  const recommendationDto = await requestBackendApi<NewsRecommendationResponseDto>(
    `/api/news/recommendations?${params.toString()}`,
  );

  return mapNewsRecommendationDtoToViewModel(recommendationDto);
}

/**
 * 사용자가 선택한 단일 뉴스의 LLM 요약을 요청한다.
 */
export async function summarizeNewsArticle(newsId: string): Promise<NewsSummaryViewModel> {
  const summaryDto = await requestBackendApi<NewsSummaryResponseDto>(
    `/api/news/${newsId}/summary`,
    {
      method: "POST",
    },
  );

  return mapNewsSummaryDtoToViewModel(summaryDto);
}

/**
 * 여러 뉴스 ID를 묶어 LLM 요약을 요청한다.
 */
export async function summarizeNewsArticles({
  maxSentenceCount,
  newsIds,
}: SummarizeNewsArticlesOptions): Promise<NewsSummaryViewModel> {
  const requestBody: NewsSummaryRequestDto = {
    newsIds,
    maxSentenceCount,
  };
  const summaryDto = await requestBackendApi<NewsSummaryResponseDto>("/api/news/summary", {
    method: "POST",
    body: requestBody,
  });

  return mapNewsSummaryDtoToViewModel(summaryDto);
}

function mapNewsRecommendationDtoToViewModel(
  recommendationDto: NewsRecommendationResponseDto,
): NewsRecommendationViewModel {
  return {
    keywords: recommendationDto.keywords.map((keywordDto) => ({
      id: keywordDto.id,
      label: keywordDto.name,
    })),
    articles: recommendationDto.articles.map(mapRecommendedNewsDtoToViewModel),
    refreshed: recommendationDto.refreshed,
  };
}

function mapRecommendedNewsDtoToViewModel(
  articleDto: RecommendedNewsResponseDto,
): RecommendedNewsArticleViewModel {
  return {
    id: articleDto.id,
    keywordId: articleDto.keywordId,
    matchedKeyword: articleDto.matchedKeyword,
    title: articleDto.title,
    description: articleDto.description,
    originUrl: articleDto.originUrl,
    publishedAt: articleDto.publishedAt,
    publishedAtLabel: formatNewsDate(articleDto.publishedAt),
    recommendationReason: articleDto.recommendationReason,
  };
}

function mapNewsSummaryDtoToViewModel(
  summaryDto: NewsSummaryResponseDto,
): NewsSummaryViewModel {
  return {
    newsIds: summaryDto.newsIds,
    summary: summaryDto.summary,
    sources: summaryDto.sources.map(mapNewsSummarySourceDtoToViewModel),
  };
}

function mapNewsSummarySourceDtoToViewModel(
  sourceDto: NewsSummarySourceResponseDto,
): NewsSummarySourceViewModel {
  return {
    id: sourceDto.id,
    title: sourceDto.title,
    originUrl: sourceDto.originUrl,
    publishedAt: sourceDto.publishedAt,
    publishedAtLabel: formatNewsDate(sourceDto.publishedAt),
  };
}

function formatNewsDate(value: string | null): string {
  if (value === null) {
    return "발행 시각 미정";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
