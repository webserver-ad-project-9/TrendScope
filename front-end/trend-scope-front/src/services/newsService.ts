import type {
  DailyNewsCountItemResponseDto,
  DailyNewsCountResponseDto,
  KeywordBriefingArticleResponseDto,
  KeywordBriefingGroupResponseDto,
  KeywordBriefingResponseDto,
  KeywordFrequencyItemResponseDto,
  KeywordFrequencyResponseDto,
  NewsArticleSourceResponseDto,
  NewsBookmarkResponseDto,
  NewsClusterItemResponseDto,
  NewsClusterResponseDto,
  NewsRecommendationResponseDto,
  NewsSummaryRequestDto,
  NewsSummaryResponseDto,
  NewsSummarySourceResponseDto,
  NewsSentimentItemResponseDto,
  NewsSentimentResponseDto,
  NewsTrendScoreItemResponseDto,
  NewsTrendScoreResponseDto,
  RecommendedNewsResponseDto,
  SuggestedKeywordResponseDto,
  TodayIssueResponseDto,
} from "@/src/types/api";
import type {
  DailyNewsCountItemViewModel,
  KeywordBriefingArticleViewModel,
  KeywordBriefingGroupViewModel,
  KeywordBriefingViewModel,
  KeywordFrequencyItemViewModel,
  KeywordFrequencyViewModel,
  NewsBookmarkViewModel,
  NewsClusterArticleViewModel,
  NewsClusterViewModel,
  NewsDashboardViewModel,
  NewsRecommendationViewModel,
  NewsSentimentViewModel,
  NewsSummarySourceViewModel,
  NewsSummaryViewModel,
  NewsTrendScoreItemViewModel,
  RecommendedNewsArticleViewModel,
  TodayIssueViewModel,
} from "@/src/types/trend";
import { requestBackendApi } from "./apiClient";

const defaultRecommendationLimit = 20;
const defaultKeywordFrequencyLimit = 20;
const defaultTodayIssueLimit = 3;
const defaultSuggestedKeywordLimit = 10;
const defaultDailyNewsCountDays = 7;
const defaultNewsClusterLimit = 5;

interface FetchNewsRecommendationOptions {
  readonly refresh?: boolean;
  readonly limit?: number;
}

interface SummarizeNewsArticlesOptions {
  readonly newsIds: readonly string[];
  readonly maxSentenceCount?: number;
}

interface FetchNewsDashboardOptions {
  readonly keywordFrequencyLimit?: number;
  readonly todayIssueLimit?: number;
  readonly suggestedKeywordLimit?: number;
  readonly dailyNewsCountDays?: number;
  readonly newsClusterLimit?: number;
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
 * back-docs에 정의된 뉴스 대시보드/브리핑 API를 한 번에 조회한다.
 */
export async function fetchNewsDashboard({
  dailyNewsCountDays = defaultDailyNewsCountDays,
  keywordFrequencyLimit = defaultKeywordFrequencyLimit,
  newsClusterLimit = defaultNewsClusterLimit,
  suggestedKeywordLimit = defaultSuggestedKeywordLimit,
  todayIssueLimit = defaultTodayIssueLimit,
}: FetchNewsDashboardOptions = {}): Promise<NewsDashboardViewModel> {
  const keywordFrequencyParams = new URLSearchParams({
    limit: String(keywordFrequencyLimit),
  });
  const todayIssueParams = new URLSearchParams({
    limit: String(todayIssueLimit),
  });
  const suggestedKeywordParams = new URLSearchParams({
    limit: String(suggestedKeywordLimit),
  });
  const dailyNewsCountParams = new URLSearchParams({
    days: String(dailyNewsCountDays),
  });
  const newsClusterParams = new URLSearchParams({
    limit: String(newsClusterLimit),
  });

  const [
    keywordBriefingDto,
    keywordFrequencyDto,
    trendScoreDto,
    todayIssueDto,
    suggestedKeywordDto,
    dailyNewsCountDto,
    newsClusterDto,
    newsSentimentDto,
    bookmarkDtos,
  ] = await Promise.all([
    requestBackendApi<KeywordBriefingResponseDto>("/api/news/keyword-briefings"),
    requestBackendApi<KeywordFrequencyResponseDto>(
      `/api/news/keyword-frequency?${keywordFrequencyParams.toString()}`,
    ),
    requestBackendApi<NewsTrendScoreResponseDto>("/api/news/trend-scores"),
    requestBackendApi<TodayIssueResponseDto>(
      `/api/news/today-issues?${todayIssueParams.toString()}`,
    ),
    requestBackendApi<SuggestedKeywordResponseDto>(
      `/api/news/suggested-keywords?${suggestedKeywordParams.toString()}`,
    ),
    requestBackendApi<DailyNewsCountResponseDto>(
      `/api/news/statistics/daily-counts?${dailyNewsCountParams.toString()}`,
    ),
    requestBackendApi<NewsClusterResponseDto>(
      `/api/news/clusters?${newsClusterParams.toString()}`,
    ),
    requestBackendApi<NewsSentimentResponseDto>("/api/news/sentiments"),
    requestBackendApi<readonly NewsBookmarkResponseDto[]>("/api/news/bookmarks"),
  ]);

  return {
    keywordBriefing: mapKeywordBriefingDtoToViewModel(keywordBriefingDto),
    keywordFrequency: mapKeywordFrequencyDtoToViewModel(keywordFrequencyDto),
    trendScores: trendScoreDto.trends.map(mapNewsTrendScoreDtoToViewModel),
    todayIssues: mapTodayIssueDtoToViewModel(todayIssueDto),
    suggestedKeywords: suggestedKeywordDto.keywords.map(mapKeywordFrequencyItemDtoToViewModel),
    dailyNewsCounts: dailyNewsCountDto.counts.map(mapDailyNewsCountDtoToViewModel),
    clusters: newsClusterDto.clusters.map(mapNewsClusterDtoToViewModel),
    sentiments: newsSentimentDto.sentiments.map(mapNewsSentimentDtoToViewModel),
    bookmarks: bookmarkDtos.map(mapNewsBookmarkDtoToViewModel),
  };
}

/**
 * 현재 사용자의 뉴스 북마크 목록을 조회한다.
 */
export async function fetchNewsBookmarks(): Promise<readonly NewsBookmarkViewModel[]> {
  const bookmarkDtos =
    await requestBackendApi<readonly NewsBookmarkResponseDto[]>("/api/news/bookmarks");

  return bookmarkDtos.map(mapNewsBookmarkDtoToViewModel);
}

/**
 * 뉴스 카드의 북마크를 생성한다.
 */
export async function bookmarkNewsArticle(newsId: string): Promise<NewsBookmarkViewModel> {
  const bookmarkDto = await requestBackendApi<NewsBookmarkResponseDto>(
    `/api/news/${newsId}/bookmarks`,
    {
      method: "POST",
    },
  );

  return mapNewsBookmarkDtoToViewModel(bookmarkDto);
}

/**
 * 뉴스 카드의 북마크를 삭제한다.
 */
export async function deleteNewsBookmark(newsId: string): Promise<void> {
  await requestBackendApi<null>(`/api/news/${newsId}/bookmarks`, {
    method: "DELETE",
  });
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

function mapKeywordBriefingDtoToViewModel(
  briefingDto: KeywordBriefingResponseDto,
): KeywordBriefingViewModel {
  return {
    date: briefingDto.date,
    summaryType: briefingDto.summaryType,
    totalCollectedCount: briefingDto.totalCollectedCount,
    summaries: briefingDto.summaries.map(mapKeywordBriefingGroupDtoToViewModel),
  };
}

function mapKeywordBriefingGroupDtoToViewModel(
  groupDto: KeywordBriefingGroupResponseDto,
): KeywordBriefingGroupViewModel {
  return {
    keyword: groupDto.keyword,
    collectedCount: groupDto.collectedCount,
    summary: groupDto.summary,
    articles: groupDto.articles.map(mapKeywordBriefingArticleDtoToViewModel),
  };
}

function mapKeywordBriefingArticleDtoToViewModel(
  articleDto: KeywordBriefingArticleResponseDto,
): KeywordBriefingArticleViewModel {
  return {
    title: articleDto.title,
    originUrl: articleDto.url,
    publishedAt: articleDto.publishedAt,
    publishedAtLabel: formatNewsDate(articleDto.publishedAt),
  };
}

function mapKeywordFrequencyDtoToViewModel(
  frequencyDto: KeywordFrequencyResponseDto,
): KeywordFrequencyViewModel {
  return {
    articleCount: frequencyDto.articleCount,
    keywords: frequencyDto.keywords.map(mapKeywordFrequencyItemDtoToViewModel),
  };
}

function mapKeywordFrequencyItemDtoToViewModel(
  itemDto: KeywordFrequencyItemResponseDto,
): KeywordFrequencyItemViewModel {
  return {
    keyword: itemDto.keyword,
    count: itemDto.count,
    weight: itemDto.weight,
  };
}

function mapNewsTrendScoreDtoToViewModel(
  trendDto: NewsTrendScoreItemResponseDto,
): NewsTrendScoreItemViewModel {
  return {
    keywordId: trendDto.keywordId,
    keyword: trendDto.keyword,
    articleCount: trendDto.articleCount,
    trendScore: trendDto.trendScore,
    trendScoreLabel: trendDto.trendScore.toFixed(0),
  };
}

function mapTodayIssueDtoToViewModel(issueDto: TodayIssueResponseDto): TodayIssueViewModel {
  return {
    issues: issueDto.issues,
  };
}

function mapDailyNewsCountDtoToViewModel(
  countDto: DailyNewsCountItemResponseDto,
): DailyNewsCountItemViewModel {
  return {
    date: countDto.date,
    count: countDto.count,
  };
}

function mapNewsClusterDtoToViewModel(
  clusterDto: NewsClusterItemResponseDto,
): NewsClusterViewModel {
  return {
    topic: clusterDto.topic,
    articleCount: clusterDto.articleCount,
    articles: clusterDto.articles.map(mapNewsClusterArticleDtoToViewModel),
  };
}

function mapNewsClusterArticleDtoToViewModel(
  articleDto: NewsArticleSourceResponseDto,
): NewsClusterArticleViewModel {
  return {
    title: articleDto.title,
    originUrl: articleDto.url,
    publishedAt: articleDto.publishedAt,
    publishedAtLabel: formatNewsDate(articleDto.publishedAt),
  };
}

function mapNewsSentimentDtoToViewModel(
  sentimentDto: NewsSentimentItemResponseDto,
): NewsSentimentViewModel {
  return {
    keywordId: sentimentDto.keywordId,
    keyword: sentimentDto.keyword,
    sentiment: sentimentDto.sentiment,
    riskLevel: sentimentDto.riskLevel,
    reason: sentimentDto.reason,
  };
}

function mapNewsBookmarkDtoToViewModel(
  bookmarkDto: NewsBookmarkResponseDto,
): NewsBookmarkViewModel {
  return {
    bookmarkId: bookmarkDto.bookmarkId,
    newsId: bookmarkDto.newsId,
    title: bookmarkDto.title,
    originUrl: bookmarkDto.url,
    publishedAt: bookmarkDto.publishedAt,
    publishedAtLabel: formatNewsDate(bookmarkDto.publishedAt),
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
