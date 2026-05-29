# TrendPulse Keyword Briefing API 명세서

## 1. 개요

사용자가 등록한 온보딩 키워드별로 오늘 수집된 뉴스를 묶고, 각 키워드 그룹의 뉴스 흐름을 로컬 LLM으로 요약해 반환한다.

프론트 사용 목적:

1. 관심 키워드별 오늘 뉴스 흐름 표시
2. 키워드별 요약문 표시
3. 요약 근거 기사 목록 표시
4. 기사 원문 링크 이동

---

## 2. 공통 사항

### Base URL

```text
http://localhost:8080
```

### 인증 방식

Bearer Token과 로그인 쿠키가 모두 필요하다.

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
```

브라우저에서는 `Cookie` 헤더를 직접 넣지 않는다. Axios에서 `withCredentials: true`를 사용한다.

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

---

## 3. 키워드별 뉴스 브리핑 조회

### `GET /api/news/keyword-briefings`

현재 로그인한 사용자의 활성 온보딩 키워드 기준으로 오늘 뉴스를 수집하고, 키워드별 뉴스 요약과 출처 기사 목록을 반환한다.

> Bearer Token 필요, 로그인 쿠키 필요

### Request Header

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
```

### Query Parameters

없음

### Request Body

없음

### Response `200`

```json
{
  "success": true,
  "data": {
    "date": "2026-05-29",
    "summaryType": "KEYWORD_GROUP_SUMMARY",
    "totalCollectedCount": 49,
    "summaries": [
      {
        "keyword": "ai 반도체",
        "collectedCount": 49,
        "summary": "AI 반도체 관련 뉴스는 메모리 반도체 가격 상승, SK하이닉스와 삼성전자 경쟁, 엔비디아 협력 기대감이 함께 부각되는 흐름입니다.",
        "articles": [
          {
            "title": "조사 이래 역대 최고가 기록…메모리 반도체도 끝없이 오른다",
            "url": "https://www.mk.co.kr/article/12061679",
            "publishedAt": "2026-05-29T22:17:00"
          },
          {
            "title": "KB證 “SK하이닉스, 2027년 영업이익 454조원 전망…목표가 380만원”",
            "url": "https://biz.chosun.com/stock/stock_general/example",
            "publishedAt": "2026-05-29T22:12:00"
          }
        ]
      }
    ]
  },
  "message": "요청 성공"
}
```

---

## 4. Response Field

### Root

| 필드 | 타입 | nullable | 설명 |
| --- | --- | --- | --- |
| `success` | boolean | N | 요청 성공 여부 |
| `data` | `KeywordBriefingResponse` | N | 키워드 브리핑 데이터 |
| `message` | string | N | 응답 메시지 |

### `KeywordBriefingResponse`

| 필드 | 타입 | nullable | 설명 |
| --- | --- | --- | --- |
| `date` | string | N | 브리핑 기준 날짜. `YYYY-MM-DD` |
| `summaryType` | string | N | 요약 타입. 현재는 `KEYWORD_GROUP_SUMMARY` |
| `totalCollectedCount` | number | N | 전체 키워드에서 수집된 기사 수 합계 |
| `summaries` | `KeywordBriefingGroup[]` | N | 키워드별 브리핑 목록 |

### `KeywordBriefingGroup`

| 필드 | 타입 | nullable | 설명 |
| --- | --- | --- | --- |
| `keyword` | string | N | 온보딩 키워드명 |
| `collectedCount` | number | N | 해당 키워드에서 수집 및 표시되는 기사 수 |
| `summary` | string | N | 로컬 LLM이 생성한 키워드별 뉴스 흐름 요약 |
| `articles` | `KeywordBriefingArticle[]` | N | 요약 근거 기사 목록 |

### `KeywordBriefingArticle`

| 필드 | 타입 | nullable | 설명 |
| --- | --- | --- | --- |
| `title` | string | N | 기사 제목 |
| `url` | string | N | 기사 원문 URL |
| `publishedAt` | string | Y | 기사 업로드 시간. ISO datetime |

---

## 5. 빈 상태 기준

### 등록된 활성 키워드가 없는 경우

```json
{
  "success": true,
  "data": {
    "date": "2026-05-29",
    "summaryType": "KEYWORD_GROUP_SUMMARY",
    "totalCollectedCount": 0,
    "summaries": []
  },
  "message": "요청 성공"
}
```

프론트 처리:

- 온보딩 키워드 등록 화면으로 유도
- “관심 키워드를 등록하면 맞춤 뉴스 브리핑을 볼 수 있습니다.” 메시지 표시

### 키워드는 있지만 기사 수집 결과가 없는 경우

```json
{
  "success": true,
  "data": {
    "date": "2026-05-29",
    "summaryType": "KEYWORD_GROUP_SUMMARY",
    "totalCollectedCount": 0,
    "summaries": [
      {
        "keyword": "ai 반도체",
        "collectedCount": 0,
        "summary": "오늘 해당 키워드의 주요 뉴스 흐름을 요약할 수 없습니다.",
        "articles": []
      }
    ]
  },
  "message": "요청 성공"
}
```

프론트 처리:

- 해당 키워드 카드에 “오늘 수집된 뉴스가 없습니다.” 표시
- `articles.length === 0`이면 출처 목록 영역 숨김 가능

---

## 6. 정렬 및 Count 기준

| 항목 | 기준 |
| --- | --- |
| 키워드 순서 | 백엔드 응답 순서 사용 |
| 기사 정렬 | `publishedAt DESC` |
| `totalCollectedCount` | 모든 `summaries[].collectedCount` 합계 |
| `collectedCount` | 해당 키워드 그룹의 `articles.length`와 동일하게 사용 |
| 요약 기준 | 해당 키워드의 기사 제목 목록을 로컬 LLM에 전달하여 생성 |

프론트에서 별도 정렬하지 않고 서버 응답 순서를 그대로 사용한다.

---

## 7. 에러

| Status | Error Code | 상황 | 프론트 처리 |
| --- | --- | --- | --- |
| `401` | `INVALID_JWT_TOKEN` | 토큰 없음 또는 유효하지 않음 | 로그인 페이지 이동 |
| `401` | `EXPIRED_JWT_TOKEN` | 토큰 만료 | 토큰 제거 후 로그인 페이지 이동 |
| `502` | `NAVER_API_REQUEST_FAILED` | 네이버 뉴스 API 호출 실패 | 브리핑 로딩 실패 토스트 표시 |
| `502` | `AI_SUMMARY_FAILED` | 로컬 LLM 요약 실패 | 요약 실패 메시지 표시 |
| `500` | `INTERNAL_SERVER_ERROR` | 서버 내부 오류 | 공통 에러 UI 표시 |

현재 구현에서는 키워드별 요약 중 LLM 요약 실패가 발생하면, 해당 키워드의 `summary`에 fallback 문구가 들어갈 수 있다.

```text
오늘 해당 키워드의 주요 뉴스 흐름을 요약할 수 없습니다.
```

프론트는 위 문구가 내려오면 요약 실패 상태로 표시해도 된다.

---

## 8. TypeScript 타입

```ts
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
};

export type KeywordBriefingArticle = {
  title: string;
  url: string;
  publishedAt: string | null;
};

export type KeywordBriefingGroup = {
  keyword: string;
  collectedCount: number;
  summary: string;
  articles: KeywordBriefingArticle[];
};

export type KeywordBriefingResponse = {
  date: string;
  summaryType: "KEYWORD_GROUP_SUMMARY";
  totalCollectedCount: number;
  summaries: KeywordBriefingGroup[];
};
```

---

## 9. Axios 함수

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

export async function getKeywordBriefings() {
  const response = await api.get<ApiResponse<KeywordBriefingResponse>>(
    "/api/news/keyword-briefings"
  );

  return response.data.data;
}
```

---

## 10. React Query 기준

```ts
export const newsKeys = {
  keywordBriefings: ["news", "keyword-briefings"] as const
};
```

```ts
import { useQuery } from "@tanstack/react-query";

export function useKeywordBriefings() {
  return useQuery({
    queryKey: newsKeys.keywordBriefings,
    queryFn: getKeywordBriefings,
    staleTime: 1000 * 60 * 5
  });
}
```

---

## 11. 화면 데이터 흐름

### 페이지 진입

1. `getKeywordBriefings()` 호출
2. `data.summaries`를 키워드별 카드로 렌더링
3. 카드 상단에 `keyword`, `collectedCount` 표시
4. 카드 본문에 `summary` 표시
5. 하단에 `articles` 출처 목록 표시

### 출처 클릭

```ts
window.open(article.url, "_blank", "noopener,noreferrer");
```

### 빈 상태

```ts
if (data.summaries.length === 0) {
  // 키워드 등록 유도 UI
}
```

### 요약 실패 상태

```ts
const isSummaryFallback =
  group.summary === "오늘 해당 키워드의 주요 뉴스 흐름을 요약할 수 없습니다.";
```

---

## 12. UI 구현 우선순위

1. `KeywordBriefingResponse` 타입 추가
2. `getKeywordBriefings()` API 함수 추가
3. 키워드 브리핑 카드 UI 구현
4. 기사 출처 목록 UI 구현
5. 빈 키워드 상태 처리
6. 요약 실패 fallback 상태 처리
7. 로딩 skeleton 및 에러 토스트 처리

