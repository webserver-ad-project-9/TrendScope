# TrendPulse News Dashboard API Frontend Spec

## 1. 공통 규칙

- Base URL: `http://localhost:8080`
- 인증: 모든 API는 로그인 필요
- Header:

```http
Authorization: Bearer {accessToken}
Cookie: accessToken={accessToken}
```

- 공통 응답:

```ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
```

- 날짜 형식:
  - `date`: `YYYY-MM-DD`
  - `publishedAt`: ISO local datetime string, 예: `2026-05-29T22:17:00`
- nullable 기준:
  - 응답의 배열 필드는 데이터가 없으면 `[]`
  - `publishedAt`은 원본 뉴스 데이터에 시간이 없으면 `null` 가능
  - 문자열 필드는 기본적으로 non-null
- 정렬 기준:
  - 최신 뉴스 기반 API는 `publishedAt DESC`
  - 북마크 목록은 `createdAt DESC`
  - 빈도/클러스터는 count DESC

## 2. TypeScript 타입

```ts
export interface NewsArticleSource {
  title: string;
  url: string;
  publishedAt: string | null;
}

export interface KeywordFrequencyItem {
  keyword: string;
  count: number;
  weight: number;
}

export interface KeywordFrequencyResponse {
  articleCount: number;
  keywords: KeywordFrequencyItem[];
}

export interface TrendScoreItem {
  keywordId: string;
  keyword: string;
  articleCount: number;
  trendScore: number;
}

export interface NewsTrendScoreResponse {
  trends: TrendScoreItem[];
}

export interface TodayIssueResponse {
  issues: string[];
}

export interface SuggestedKeywordResponse {
  keywords: KeywordFrequencyItem[];
}

export interface DailyNewsCountItem {
  date: string;
  count: number;
}

export interface DailyNewsCountResponse {
  counts: DailyNewsCountItem[];
}

export interface NewsClusterItem {
  topic: string;
  articleCount: number;
  articles: NewsArticleSource[];
}

export interface NewsClusterResponse {
  clusters: NewsClusterItem[];
}

export type NewsSentiment = "POSITIVE" | "NEUTRAL" | "NEGATIVE";
export type NewsRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface NewsSentimentItem {
  keywordId: string;
  keyword: string;
  sentiment: NewsSentiment;
  riskLevel: NewsRiskLevel;
  reason: string;
}

export interface NewsSentimentResponse {
  sentiments: NewsSentimentItem[];
}

export interface NewsBookmark {
  bookmarkId: string;
  newsId: string;
  title: string;
  url: string;
  publishedAt: string | null;
}
```

## 3. API 연동 명세

### 3.1 자주 나오는 키워드 빈도

- Method: `GET`
- Endpoint: `/api/news/keyword-frequency`
- Request Params:
  - `limit?: number`, 기본 20, 최대 50
- Request Body: 없음
- Response Body:

```json
{
  "success": true,
  "data": {
    "articleCount": 49,
    "keywords": [
      { "keyword": "반도체", "count": 12, "weight": 100.0 },
      { "keyword": "하이닉스", "count": 8, "weight": 66.7 }
    ]
  },
  "message": "요청 성공"
}
```

- 사용 화면: 뉴스 대시보드 키워드 그래프, 워드 클라우드
- 처리 기준: 로그인 사용자의 활성 온보딩 키워드로 수집된 최근 뉴스 제목/설명에서 토큰 빈도 계산

### 3.2 키워드별 트렌드 점수

- Method: `GET`
- Endpoint: `/api/news/trend-scores`
- Request Params: 없음
- Request Body: 없음
- Response Body:

```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "keywordId": "6823e9eb-3d76-47ec-9243-cd62589db5aa",
        "keyword": "ai 반도체",
        "articleCount": 49,
        "trendScore": 98
      }
    ]
  },
  "message": "요청 성공"
}
```

- 사용 화면: 대시보드 상단 트렌드 카드
- count 기준: 당일 00:00부터 현재까지 수집된 기사 수
- score 기준: MVP는 `min(100, articleCount * 2)`

### 3.3 오늘의 핵심 이슈

- Method: `GET`
- Endpoint: `/api/news/today-issues`
- Request Params:
  - `limit?: number`, 기본 3, 최대 5
- Request Body: 없음
- Response Body:

```json
{
  "success": true,
  "data": {
    "issues": [
      "반도체 업황 기대감으로 주요 종목 관심이 커지고 있습니다.",
      "AI 및 로봇 협력 관련 뉴스가 증가했습니다."
    ]
  },
  "message": "요청 성공"
}
```

- 사용 화면: 오늘의 이슈 요약 카드
- 처리 기준: 대시보드 응답 속도를 위해 최신 기사 제목 기반으로 즉시 반환

### 3.4 추천 키워드

- Method: `GET`
- Endpoint: `/api/news/suggested-keywords`
- Request Params:
  - `limit?: number`, 기본 10, 최대 30
- Request Body: 없음
- Response Body:

```json
{
  "success": true,
  "data": {
    "keywords": [
      { "keyword": "엔비디아", "count": 6, "weight": 100.0 },
      { "keyword": "HBM", "count": 4, "weight": 66.7 }
    ]
  },
  "message": "요청 성공"
}
```

- 사용 화면: 키워드 추가 추천 영역
- 처리 기준: 최근 7일 뉴스 제목/설명 기반 빈도 상위 키워드

### 3.5 일자별 뉴스 수

- Method: `GET`
- Endpoint: `/api/news/statistics/daily-counts`
- Request Params:
  - `days?: number`, 기본 7, 최대 30
- Request Body: 없음
- Response Body:

```json
{
  "success": true,
  "data": {
    "counts": [
      { "date": "2026-05-23", "count": 0 },
      { "date": "2026-05-29", "count": 49 }
    ]
  },
  "message": "요청 성공"
}
```

- 사용 화면: 라인 차트, 바 차트
- count 기준: 사용자의 활성 온보딩 키워드로 저장된 뉴스 수
- 누락 날짜 기준: 기사가 없어도 `count: 0`으로 포함

### 3.6 뉴스 클러스터

- Method: `GET`
- Endpoint: `/api/news/clusters`
- Request Params:
  - `limit?: number`, 기본 5, 최대 20
- Request Body: 없음
- Response Body:

```json
{
  "success": true,
  "data": {
    "clusters": [
      {
        "topic": "반도체",
        "articleCount": 12,
        "articles": [
          {
            "title": "메모리 반도체도 끝없이 오른다",
            "url": "https://example.com/news",
            "publishedAt": "2026-05-29T22:17:00"
          }
        ]
      }
    ]
  },
  "message": "요청 성공"
}
```

- 사용 화면: 관련 뉴스 묶음, 이슈 클러스터 카드
- 처리 기준: 최근 7일 뉴스 제목의 첫 의미 토큰으로 MVP 클러스터링

### 3.7 감성/리스크 요약

- Method: `GET`
- Endpoint: `/api/news/sentiments`
- Request Params: 없음
- Request Body: 없음
- Response Body:

```json
{
  "success": true,
  "data": {
    "sentiments": [
      {
        "keywordId": "6823e9eb-3d76-47ec-9243-cd62589db5aa",
        "keyword": "ai 반도체",
        "sentiment": "POSITIVE",
        "riskLevel": "LOW",
        "reason": "뉴스 제목 기반 MVP 분류입니다."
      }
    ]
  },
  "message": "요청 성공"
}
```

- 사용 화면: 키워드별 분위기 배지, 리스크 경고
- 처리 기준: MVP는 제목 키워드 휴리스틱 기반

### 3.8 뉴스 북마크 생성

- Method: `POST`
- Endpoint: `/api/news/{newsId}/bookmarks`
- Request Params:
  - `newsId: string`
- Request Body: 없음
- Response Body:

```json
{
  "success": true,
  "data": {
    "bookmarkId": "0f6c2e3e-99b0-41e6-a4fa-0a97da3f3f21",
    "newsId": "ad709924-24a2-41c6-b17d-73b955a52cc3",
    "title": "AI 반도체 뉴스 제목",
    "url": "https://example.com/news",
    "publishedAt": "2026-05-29T22:17:00"
  },
  "message": "요청 성공"
}
```

- 사용 화면: 뉴스 카드 저장 버튼, 뉴스 상세 저장 버튼
- 중복 기준: 같은 사용자가 같은 뉴스를 다시 저장하면 기존 북마크를 그대로 반환
- optimistic update: 가능. 실패 시 이전 상태로 rollback

### 3.9 내 뉴스 북마크 목록

- Method: `GET`
- Endpoint: `/api/news/bookmarks`
- Request Params: 없음
- Request Body: 없음
- Response Body:

```json
{
  "success": true,
  "data": [
    {
      "bookmarkId": "0f6c2e3e-99b0-41e6-a4fa-0a97da3f3f21",
      "newsId": "ad709924-24a2-41c6-b17d-73b955a52cc3",
      "title": "AI 반도체 뉴스 제목",
      "url": "https://example.com/news",
      "publishedAt": "2026-05-29T22:17:00"
    }
  ],
  "message": "요청 성공"
}
```

- 사용 화면: 마이페이지 저장 뉴스, 대시보드 저장 뉴스

### 3.10 뉴스 북마크 삭제

- Method: `DELETE`
- Endpoint: `/api/news/{newsId}/bookmarks`
- Request Params:
  - `newsId: string`
- Request Body: 없음
- Response Body:

```json
{
  "success": true,
  "data": null,
  "message": "요청 성공"
}
```

- 사용 화면: 저장 취소 버튼
- optimistic update: 가능. 실패 시 이전 상태로 rollback

## 4. Axios 함수 시그니처

```ts
export const getKeywordFrequency = (limit = 20) =>
  api.get<ApiResponse<KeywordFrequencyResponse>>("/api/news/keyword-frequency", { params: { limit } });

export const getTrendScores = () =>
  api.get<ApiResponse<NewsTrendScoreResponse>>("/api/news/trend-scores");

export const getTodayIssues = (limit = 3) =>
  api.get<ApiResponse<TodayIssueResponse>>("/api/news/today-issues", { params: { limit } });

export const getSuggestedKeywords = (limit = 10) =>
  api.get<ApiResponse<SuggestedKeywordResponse>>("/api/news/suggested-keywords", { params: { limit } });

export const getDailyNewsCounts = (days = 7) =>
  api.get<ApiResponse<DailyNewsCountResponse>>("/api/news/statistics/daily-counts", { params: { days } });

export const getNewsClusters = (limit = 5) =>
  api.get<ApiResponse<NewsClusterResponse>>("/api/news/clusters", { params: { limit } });

export const getNewsSentiments = () =>
  api.get<ApiResponse<NewsSentimentResponse>>("/api/news/sentiments");

export const bookmarkNews = (newsId: string) =>
  api.post<ApiResponse<NewsBookmark>>(`/api/news/${newsId}/bookmarks`);

export const getNewsBookmarks = () =>
  api.get<ApiResponse<NewsBookmark[]>>("/api/news/bookmarks");

export const deleteNewsBookmark = (newsId: string) =>
  api.delete<ApiResponse<null>>(`/api/news/${newsId}/bookmarks`);
```

## 5. React Query 기준

- 서버 상태는 React Query 사용
- Query Key 예시:
  - `["news", "keyword-frequency", limit]`
  - `["news", "trend-scores"]`
  - `["news", "today-issues", limit]`
  - `["news", "suggested-keywords", limit]`
  - `["news", "daily-counts", days]`
  - `["news", "clusters", limit]`
  - `["news", "sentiments"]`
  - `["news", "bookmarks"]`
- 북마크 생성/삭제 후 invalidate:
  - `["news", "bookmarks"]`
  - 뉴스 카드에 saved 상태를 붙이면 해당 목록 query도 invalidate
- optimistic update:
  - 북마크 토글은 가능
  - 트렌드 점수, 빈도, 클러스터, 감성은 서버 계산 결과이므로 optimistic update 비권장

## 6. 에러 처리 기준

- `401`: 로그인 필요, 로그인 페이지 이동
- `403`: 권한 없음, 토스트 노출
- `404`: 뉴스 또는 북마크 없음
- `400`: limit/days 등 요청값 오류
- `502`: 외부 API 또는 로컬 LLM 호출 실패 가능, 재시도 버튼 노출

## 7. MVP 화면 배치 추천

1. 대시보드 상단: `getTrendScores()`, `getTodayIssues()`
2. 분석 그래프: `getKeywordFrequency()`, `getDailyNewsCounts()`
3. 탐색 카드: `getNewsClusters()`, `getSuggestedKeywords()`
4. 위험/분위기: `getNewsSentiments()`
5. 저장 뉴스: `getNewsBookmarks()`
