# TrendPulse News Recommendation API 명세서

## 1. 개요

사용자가 온보딩에서 등록한 활성 키워드를 기준으로 관련 뉴스를 추천한다.

추천 기준은 MVP 기준으로 다음과 같다.

1. 현재 로그인한 사용자의 활성 키워드 조회
2. 키워드와 연결된 `news_articles` 조회
3. 최신 발행일 기준 내림차순 정렬
4. 요청한 `limit` 개수만큼 반환
5. `refresh=true`인 경우 추천 전 네이버 뉴스 API로 최신 뉴스 수집 후 반환

LLM은 현재 추천 랭킹에는 직접 사용하지 않는다. 추후 추천 사유 고도화, 뉴스 요약, 관련 키워드 재분류에 사용할 수 있다.

---

## 2. 공통 사항

### Base URL

```text
http://localhost:8080
```

### 인증 방식

보호 API이므로 Bearer Token과 로그인 쿠키를 함께 보낸다.

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
```

프론트 브라우저에서는 `Cookie` 헤더를 직접 넣지 않고 `axios`의 `withCredentials: true` 설정으로 쿠키가 자동 전송되게 한다.

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

| Status | Error Code | 상황 |
| --- | --- | --- |
| `401` | `INVALID_JWT_TOKEN` | 토큰 없음 또는 유효하지 않음 |
| `401` | `EXPIRED_JWT_TOKEN` | 토큰 만료 |
| `404` | `USER_NOT_FOUND` | 인증된 사용자 정보를 찾을 수 없음 |
| `502` | `NAVER_API_REQUEST_FAILED` | `refresh=true` 요청 중 네이버 뉴스 API 호출 실패 |

---

## 3. 내 키워드 기반 뉴스 추천

### `GET /api/news/recommendations`

현재 로그인한 사용자의 활성 온보딩 키워드를 기준으로 추천 뉴스를 조회한다.

> Bearer Token 필요, 로그인 쿠키 필요

### Query Parameters

| 이름 | 타입 | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| `refresh` | boolean | X | `false` | `true`이면 추천 전 내 활성 키워드별로 네이버 뉴스 API에서 최신 뉴스를 수집한다. |
| `limit` | integer | X | `20` | 반환할 추천 뉴스 개수. 최소 1, 최대 50. |

### Request Header

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
```

### Request Body

없음

### Response `200`

```json
{
  "success": true,
  "data": {
    "keywords": [
      {
        "id": "6823e9eb-3d76-47ec-9243-cd62589db5aa",
        "name": "ai 반도체"
      }
    ],
    "articles": [
      {
        "id": "8d15fe32-ff7e-4e30-a5a2-82a02b67b1f6",
        "keywordId": "6823e9eb-3d76-47ec-9243-cd62589db5aa",
        "matchedKeyword": "ai 반도체",
        "title": "AI 반도체 시장 경쟁 본격화",
        "description": "국내외 기업들이 AI 반도체 개발과 공급망 확대에 속도를 내고 있다.",
        "originUrl": "https://news.example.com/article/123",
        "publishedAt": "2026-05-28T09:30:00",
        "recommendationReason": "'ai 반도체' 키워드와 관련된 최신 뉴스입니다."
      }
    ],
    "refreshed": false
  },
  "message": "요청 성공"
}
```

### Response Field

| 필드 | 타입 | nullable | 설명 |
| --- | --- | --- | --- |
| `keywords` | `Keyword[]` | N | 추천 기준이 된 현재 사용자의 활성 키워드 목록 |
| `articles` | `RecommendedNews[]` | N | 추천 뉴스 목록 |
| `refreshed` | boolean | N | 이번 요청에서 뉴스 수집을 수행했는지 여부 |
| `articles[].id` | UUID string | N | 뉴스 ID |
| `articles[].keywordId` | UUID string | N | 매칭된 온보딩 키워드 ID |
| `articles[].matchedKeyword` | string | N | 매칭된 키워드명 |
| `articles[].title` | string | N | 뉴스 제목 |
| `articles[].description` | string | Y | 뉴스 설명 |
| `articles[].originUrl` | string | N | 원문 URL |
| `articles[].publishedAt` | ISO datetime string | Y | 뉴스 발행 시각 |
| `articles[].recommendationReason` | string | N | 추천 사유 |

### 빈 결과 기준

사용자가 활성 키워드를 등록하지 않았거나, 저장된 관련 뉴스가 없으면 빈 배열을 반환한다.

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

`articles`는 `publishedAt DESC` 기준으로 정렬한다.

발행 시간이 없는 뉴스는 DB 정렬 결과에 따르며, 프론트에서 임의로 상단 고정하지 않는다.

### Count 처리 기준

이 API는 MVP 기준 페이지네이션이 아니라 `limit` 기반 목록 조회다.

프론트에서 표시할 추천 뉴스 개수는 `articles.length`를 사용한다.

---

## 4. refresh 옵션 기준

### `refresh=false`

DB에 이미 저장된 뉴스만 조회한다.

프론트 최초 진입, 일반 새로고침, 탭 이동 시 기본값으로 사용한다.

```http
GET /api/news/recommendations?refresh=false&limit=20
```

### `refresh=true`

추천 전에 사용자의 활성 키워드별로 네이버 뉴스 API 수집을 수행한다.

수집 후 중복 URL은 저장하지 않고, 저장된 전체 뉴스 중 최신순으로 추천 목록을 반환한다.

프론트에서는 사용자가 “최신 뉴스 가져오기” 버튼을 누른 경우에만 사용하는 것을 권장한다.

```http
GET /api/news/recommendations?refresh=true&limit=20
```

주의: `refresh=true`는 외부 API 호출이 포함되므로 응답 시간이 길어질 수 있다.

---

## 5. TypeScript 타입

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
```

---

## 6. Axios 연동 예시

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
```

---

## 7. 화면 연동 흐름

### 추천 뉴스 화면 진입

1. 프론트가 `/api/onboarding/keywords`로 내 키워드 존재 여부를 확인한다.
2. 키워드가 있으면 `/api/news/recommendations?refresh=false&limit=20` 호출
3. `articles`를 카드 목록으로 렌더링
4. `keywords`는 추천 기준 키워드 칩으로 표시

### 최신 뉴스 가져오기 버튼

1. 사용자가 버튼 클릭
2. `/api/news/recommendations?refresh=true&limit=20` 호출
3. 로딩 상태 표시
4. 응답의 `articles`로 목록 교체
5. 실패 시 기존 목록 유지 후 에러 토스트 표시

### 비로그인 상태

1. `401` 응답 수신
2. 토큰 및 쿠키 제거
3. 로그인 페이지로 이동

---

## 8. 프론트 구현 우선순위

1. `NewsRecommendationResponse` 타입 추가
2. `getNewsRecommendations()` API 함수 추가
3. 추천 뉴스 페이지에서 `refresh=false` 조회
4. 빈 키워드/빈 뉴스 상태 UI 처리
5. “최신 뉴스 가져오기” 버튼에서 `refresh=true` 호출
6. 뉴스 카드에서 `originUrl` 새 탭 이동 처리

