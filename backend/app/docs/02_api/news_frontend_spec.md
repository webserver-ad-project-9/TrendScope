# TrendPulse News API 프론트 연동 명세서

## 1. 개요

이 문서는 프론트엔드가 사용자의 온보딩 키워드를 기반으로 뉴스를 추천받고, 선택한 뉴스를 로컬 LLM으로 요약하는 기능을 연동하기 위한 API 명세다.

주요 흐름:

1. 사용자가 온보딩 키워드 등록
2. 프론트가 추천 뉴스 API 호출
3. 백엔드가 내 활성 키워드 기준으로 네이버 뉴스 수집 및 추천
4. 프론트가 뉴스 카드 목록 표시
5. 사용자가 요약 버튼 클릭
6. 백엔드가 로컬 LLM으로 뉴스 요약 생성

---

## 2. 공통 사항

### Base URL

```text
http://localhost:8080
```

### 인증 방식

보호 API는 Bearer Token과 로그인 쿠키를 함께 사용한다.

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
```

브라우저에서는 `Cookie` 헤더를 직접 설정하지 않는다. Axios에서 `withCredentials: true`를 사용하면 브라우저가 쿠키를 자동 전송한다.

### 공통 성공 응답

```json
{
  "success": true,
  "data": {},
  "message": "요청 성공"
}
```

### 공통 에러 응답

```json
{
  "success": false,
  "errorCode": "INVALID_JWT_TOKEN",
  "message": "유효하지 않은 토큰입니다."
}
```

### 공통 에러 코드

| Status | Error Code | 상황 | 프론트 처리 |
| --- | --- | --- | --- |
| `401` | `INVALID_JWT_TOKEN` | 토큰 없음 또는 유효하지 않음 | 로그인 페이지 이동 |
| `401` | `EXPIRED_JWT_TOKEN` | 토큰 만료 | 토큰 제거 후 로그인 페이지 이동 |
| `404` | `NEWS_ARTICLE_NOT_FOUND` | 요약할 뉴스 없음 | 토스트 표시 |
| `502` | `NAVER_API_REQUEST_FAILED` | 네이버 뉴스 수집 실패 | 기존 목록 유지, 재시도 안내 |
| `502` | `AI_SUMMARY_FAILED` | 로컬 LLM 요약 실패 | 요약 실패 메시지 표시 |

---

## 3. 뉴스 추천 조회

### `GET /api/news/recommendations`

현재 로그인한 사용자의 활성 온보딩 키워드를 기준으로 추천 뉴스를 조회한다.

`refresh=true`이면 추천 전에 네이버 뉴스 API를 호출하여 최신 뉴스를 수집한다.

> Bearer Token 필요, 로그인 쿠키 필요

### Query Parameters

| 이름 | 타입 | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| `refresh` | boolean | X | `false` | `true`이면 네이버 뉴스 API로 최신 뉴스를 수집한 뒤 추천 목록을 반환한다. |
| `limit` | number | X | `20` | 추천 뉴스 개수. 최소 1, 최대 50. |

### Request Body

없음

### Response `200`

```json
{
  "success": true,
  "data": {
    "keywords": [
      {
        "id": "3bf9799f-fedd-432a-abde-7db816dc9a82",
        "name": "ai 반도체"
      }
    ],
    "articles": [
      {
        "id": "149b8292-c92a-43b2-bd8f-60e749d4cf2f",
        "keywordId": "3bf9799f-fedd-432a-abde-7db816dc9a82",
        "matchedKeyword": "ai 반도체",
        "title": "[세계포럼] 성과급 잔치에 드리운 재앙의 불씨",
        "description": "지금 삼전의 역대급 실적은 인공지능(AI)시대의 급격한 도래로 갑자기 반도체 수급에 병목이 생긴 천운을 빼곤 달리 설명하기 힘들다.",
        "originUrl": "https://www.segye.com/newsView/20260527515329?OutUrl=naver",
        "publishedAt": "2026-05-28T02:35:00",
        "recommendationReason": "'ai 반도체' 키워드와 관련된 최신 뉴스입니다."
      }
    ],
    "refreshed": true
  },
  "message": "요청 성공"
}
```

### Response Field

| 필드 | 타입 | nullable | 설명 |
| --- | --- | --- | --- |
| `keywords` | `RecommendationKeyword[]` | N | 추천 기준이 된 내 활성 키워드 목록 |
| `articles` | `RecommendedNews[]` | N | 추천 뉴스 목록 |
| `refreshed` | boolean | N | 이번 요청에서 네이버 뉴스 수집을 수행했는지 여부 |
| `articles[].id` | string(UUID) | N | 뉴스 ID. 요약 API 호출 시 사용 |
| `articles[].keywordId` | string(UUID) | N | 매칭된 온보딩 키워드 ID |
| `articles[].matchedKeyword` | string | N | 매칭된 키워드명 |
| `articles[].title` | string | N | 뉴스 제목 |
| `articles[].description` | string | Y | 뉴스 설명 |
| `articles[].originUrl` | string | N | 뉴스 원문 URL |
| `articles[].publishedAt` | string | Y | 발행 시각. ISO datetime |
| `articles[].recommendationReason` | string | N | 추천 사유 |

### 빈 결과 기준

사용자에게 활성 키워드가 없거나, 저장된 관련 뉴스가 없으면 빈 배열을 반환한다.

```json
{
  "success": true,
  "data": {
    "keywords": [],
    "articles": [],
    "refreshed": false
  },
  "message": "요청 성공"
}
```

### 정렬 기준

`articles`는 `publishedAt DESC` 기준으로 정렬된다.

프론트에서 별도 정렬하지 않고 서버 응답 순서를 그대로 사용한다.

---

## 4. 단일 뉴스 LLM 요약

### `POST /api/news/{newsId}/summary`

선택한 뉴스 1개를 로컬 LLM으로 요약한다.

프론트는 추천 뉴스 응답의 `articles[].id` 값을 `newsId`로 사용한다.

> Bearer Token 필요, 로그인 쿠키 필요

### Path Variables

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `newsId` | string(UUID) | O | 요약할 뉴스 ID |

### Request Body

없음

### Response `200`

```json
{
  "success": true,
  "data": {
    "newsIds": [
      "149b8292-c92a-43b2-bd8f-60e749d4cf2f"
    ],
    "summary": "삼성전자의 역대급 실적은 인공지능 시대의 급격한 도래와 반도체 수급의 병목이라는 천운 덕분이다. 과거 초격차 기술이나 제품 개발은 없었으나, 현재 상황은 삼성전자의 실적을 크게 끌어올렸다. 이러한 성과에 대한 과도한 보상은 미래에 재앙을 불러올 수 있다는 우려가 제기되고 있다.",
    "sources": [
      {
        "id": "149b8292-c92a-43b2-bd8f-60e749d4cf2f",
        "title": "[세계포럼] 성과급 잔치에 드리운 재앙의 불씨",
        "originUrl": "https://www.segye.com/newsView/20260527515329?OutUrl=naver",
        "publishedAt": "2026-05-28T02:35:00"
      }
    ]
  },
  "message": "요청 성공"
}
```

### Response Field

| 필드 | 타입 | nullable | 설명 |
| --- | --- | --- | --- |
| `newsIds` | string[] | N | 요약 대상 뉴스 ID 목록 |
| `summary` | string | N | 로컬 LLM이 생성한 뉴스 요약 |
| `sources` | `NewsSummarySource[]` | N | 요약 근거 뉴스 목록 |
| `sources[].id` | string(UUID) | N | 뉴스 ID |
| `sources[].title` | string | N | 뉴스 제목 |
| `sources[].originUrl` | string | N | 뉴스 원문 URL |
| `sources[].publishedAt` | string | Y | 발행 시각 |

### 에러

| Status | 상황 | Response |
| --- | --- | --- |
| `404` | 뉴스 ID 없음 | `{"success":false,"errorCode":"NEWS_ARTICLE_NOT_FOUND","message":"News article not found"}` |
| `502` | 로컬 LLM 호출 실패 | `{"success":false,"errorCode":"AI_SUMMARY_FAILED","message":"AI summary request failed"}` |

---

## 5. 여러 뉴스 LLM 요약

### `POST /api/news/summary`

여러 뉴스 ID를 한 번에 전달하여 묶음 요약을 생성한다.

> Bearer Token 필요, 로그인 쿠키 필요

### Request Body

```json
{
  "newsIds": [
    "149b8292-c92a-43b2-bd8f-60e749d4cf2f",
    "6fa8a356-b967-4c78-afe0-2f994a925ef0"
  ],
  "maxSentenceCount": 3
}
```

| 필드 | 타입 | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| `newsIds` | string[] | O | - | 요약할 뉴스 ID 목록 |
| `maxSentenceCount` | number | X | `3` | 요약 문장 수. 최소 1, 최대 5 |

### Response `200`

단일 뉴스 요약과 동일한 구조를 반환한다.

```json
{
  "success": true,
  "data": {
    "newsIds": [
      "149b8292-c92a-43b2-bd8f-60e749d4cf2f",
      "6fa8a356-b967-4c78-afe0-2f994a925ef0"
    ],
    "summary": "여러 뉴스의 핵심 내용을 통합한 요약문입니다.",
    "sources": [
      {
        "id": "149b8292-c92a-43b2-bd8f-60e749d4cf2f",
        "title": "[세계포럼] 성과급 잔치에 드리운 재앙의 불씨",
        "originUrl": "https://www.segye.com/newsView/20260527515329?OutUrl=naver",
        "publishedAt": "2026-05-28T02:35:00"
      }
    ]
  },
  "message": "요청 성공"
}
```

---

## 6. TypeScript 타입

```ts
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
};

export type RecommendationKeyword = {
  id: string;
  name: string;
};

export type RecommendedNews = {
  id: string;
  keywordId: string;
  matchedKeyword: string;
  title: string;
  description: string | null;
  originUrl: string;
  publishedAt: string | null;
  recommendationReason: string;
};

export type NewsRecommendationResponse = {
  keywords: RecommendationKeyword[];
  articles: RecommendedNews[];
  refreshed: boolean;
};

export type NewsSummarySource = {
  id: string;
  title: string;
  originUrl: string;
  publishedAt: string | null;
};

export type NewsSummaryResponse = {
  newsIds: string[];
  summary: string;
  sources: NewsSummarySource[];
};

export type SummarizeNewsRequest = {
  newsIds: string[];
  maxSentenceCount?: number;
};
```

---

## 7. Axios API 함수

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function getNewsRecommendations(params?: {
  refresh?: boolean;
  limit?: number;
}) {
  const response = await api.get<ApiResponse<NewsRecommendationResponse>>(
    "/api/news/recommendations",
    { params }
  );

  return response.data.data;
}

export async function summarizeNews(newsId: string) {
  const response = await api.post<ApiResponse<NewsSummaryResponse>>(
    `/api/news/${newsId}/summary`
  );

  return response.data.data;
}

export async function summarizeNewsBatch(body: SummarizeNewsRequest) {
  const response = await api.post<ApiResponse<NewsSummaryResponse>>(
    "/api/news/summary",
    body
  );

  return response.data.data;
}
```

---

## 8. 화면 데이터 흐름

### 추천 뉴스 페이지 진입

1. `getNewsRecommendations({ refresh: false, limit: 20 })` 호출
2. `keywords`를 키워드 칩으로 표시
3. `articles`를 뉴스 카드 목록으로 표시
4. `articles.length === 0`이면 빈 상태 UI 표시

### 최신 뉴스 가져오기 버튼

1. 사용자가 버튼 클릭
2. `getNewsRecommendations({ refresh: true, limit: 20 })` 호출
3. 로딩 상태 표시
4. 성공 시 기존 뉴스 목록 교체
5. 실패 시 기존 목록 유지 후 토스트 표시

### 단일 뉴스 요약 버튼

1. 뉴스 카드의 “요약” 버튼 클릭
2. `summarizeNews(article.id)` 호출
3. 버튼 또는 카드 내부에 loading 표시
4. 성공 시 `summary`를 카드 확장 영역, 모달, drawer 중 하나에 표시
5. 실패 시 “요약 생성에 실패했습니다.” 표시

### 뉴스 원문 이동

`originUrl`은 새 탭으로 연다.

```ts
window.open(article.originUrl, "_blank", "noopener,noreferrer");
```

---

## 9. React Query Key 기준

```ts
export const newsKeys = {
  recommendations: (params: { refresh?: boolean; limit?: number }) => [
    "news",
    "recommendations",
    params
  ],
  summary: (newsId: string) => ["news", "summary", newsId]
};
```

추천 뉴스는 서버 상태이므로 React Query 사용을 권장한다.

요약은 사용자가 버튼을 눌렀을 때만 실행되므로 `useMutation`을 권장한다.

---

## 10. UI 상태 기준

| 상태 | 기준 | UI |
| --- | --- | --- |
| 키워드 없음 | `keywords.length === 0` | 온보딩 키워드 등록 유도 |
| 뉴스 없음 | `keywords.length > 0 && articles.length === 0` | 최신 뉴스 가져오기 버튼 표시 |
| 추천 로딩 | 추천 API pending | 뉴스 목록 skeleton |
| 수집 로딩 | `refresh=true` pending | 버튼 disabled, spinner |
| 요약 로딩 | 요약 API pending | 해당 카드 요약 버튼 loading |
| 요약 실패 | `AI_SUMMARY_FAILED` | 카드 내부 에러 메시지 |
| 인증 실패 | `401` | 로그인 페이지 이동 |

---

## 11. 구현 우선순위

1. 타입 정의 추가
2. `getNewsRecommendations()` API 함수 추가
3. 추천 뉴스 카드 목록 구현
4. `refresh=true` 버튼 구현
5. `summarizeNews()` API 함수 추가
6. 뉴스 카드별 요약 버튼 구현
7. 요약 결과 모달 또는 카드 확장 영역 구현
8. 에러/빈 상태 UI 처리

