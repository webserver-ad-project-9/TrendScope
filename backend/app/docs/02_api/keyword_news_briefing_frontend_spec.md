# Keyword News Briefing API 프론트 연동 명세서

## 1. 개요

로그인한 사용자의 온보딩 선호 키워드를 기준으로 키워드별 최근 뉴스 4개를 수집하고, 키워드별 브리핑을 반환한다.

기존 기사 단위 요약 API는 유지한다. 이 API는 개별 기사 본문 요약을 만들지 않고, 키워드별 기사 제목 목록만 기반으로 종합 흐름 요약을 생성한다.

---

## 2. API

### `GET /api/news/keyword-briefings`

현재 로그인한 사용자의 활성 온보딩 키워드를 조회한 뒤, 키워드당 최근 뉴스 4개를 수집하고 그룹화한다.

> Bearer Token 필요, 로그인 쿠키 필요

### Query Parameters

없음

### Request Body

없음

---

## 3. 처리 규칙

1. 로그인한 사용자를 식별한다.
2. 사용자의 활성 온보딩 키워드를 조회한다.
3. 키워드당 네이버 뉴스 최신순 검색 결과 4개를 수집한다.
4. 등록 가능한 활성 키워드는 최대 6개이므로 전체 수집 기사 수는 최대 24개다.
5. 특정 키워드의 기사가 부족하면 가능한 만큼만 반환한다.
6. 요약은 기사 본문이 아니라 해당 키워드에 포함된 기사 제목 목록만 기반으로 생성한다.
7. 요약 실패 또는 기사 없음이면 fallback 문구를 반환한다.

fallback:

```text
최근 해당 키워드의 주요 뉴스 흐름을 요약할 수 없습니다.
```

---

## 4. Response `200`

```json
{
  "success": true,
  "data": {
    "date": "2026-05-28",
    "summaryType": "KEYWORD_GROUP_SUMMARY",
    "totalCollectedCount": 12,
    "summaries": [
      {
        "keyword": "스포츠",
        "collectedCount": 4,
        "summary": "최근 스포츠 분야에서는 국내 프로야구 순위 경쟁과 해외 축구 이적설이 주요 흐름으로 나타났다. 주요 선수들의 부상 복귀와 경기 결과가 함께 주목받았다.",
        "articles": [
          {
            "title": "프로야구 순위 경쟁 심화",
            "url": "https://news.example.com/article1",
            "publishedAt": "2026-05-28T09:00:00"
          },
          {
            "title": "해외 축구 이적설 재점화",
            "url": "https://news.example.com/article2",
            "publishedAt": "2026-05-28T10:30:00"
          }
        ]
      }
    ]
  },
  "message": "요청 성공"
}
```

### Response Field

| 필드 | 타입 | nullable | 설명 |
| --- | --- | --- | --- |
| `date` | string date | N | 사용자 접속 기준일. 서버 기준 `Asia/Seoul` 날짜 |
| `summaryType` | string | N | 항상 `KEYWORD_GROUP_SUMMARY` |
| `totalCollectedCount` | number | N | 전체 수집 기사 수. 최대 24 |
| `summaries` | `KeywordBriefingSummary[]` | N | 키워드별 뉴스 브리핑 목록 |
| `summaries[].keyword` | string | N | 사용자 선호 키워드 |
| `summaries[].collectedCount` | number | N | 해당 키워드로 반환된 기사 수 |
| `summaries[].summary` | string | N | 기사 제목들을 기반으로 생성한 키워드 단위 종합 요약 |
| `summaries[].articles` | `KeywordBriefingArticle[]` | N | 해당 키워드 기사 목록 |
| `summaries[].articles[].title` | string | N | 기사 제목 |
| `summaries[].articles[].url` | string | N | 기사 원문 URL |
| `summaries[].articles[].publishedAt` | string datetime | Y | 기사 게시 시간. ISO datetime |

---

## 5. 빈 결과

사용자에게 활성 온보딩 키워드가 없으면 빈 브리핑을 반환한다.

```json
{
  "success": true,
  "data": {
    "date": "2026-05-28",
    "summaryType": "KEYWORD_GROUP_SUMMARY",
    "totalCollectedCount": 0,
    "summaries": []
  },
  "message": "요청 성공"
}
```

특정 키워드에 최근 수집 기사가 없으면 해당 키워드는 `collectedCount: 0`, `articles: []`, fallback `summary`를 반환할 수 있다.

---

## 6. TypeScript 타입

```ts
export type KeywordNewsBriefingResponse = {
  date: string;
  summaryType: "KEYWORD_GROUP_SUMMARY";
  totalCollectedCount: number;
  summaries: KeywordNewsBriefingSummary[];
};

export type KeywordNewsBriefingSummary = {
  keyword: string;
  collectedCount: number;
  summary: string;
  articles: KeywordNewsBriefingArticle[];
};

export type KeywordNewsBriefingArticle = {
  title: string;
  url: string;
  publishedAt: string | null;
};
```

---

## 7. 프론트 연동 예시

```ts
const response = await axios.get<ApiResponse<KeywordNewsBriefingResponse>>(
  "/api/news/keyword-briefings",
  {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }
);

const briefing = response.data.data;
```

프론트는 `summaries`를 키워드 섹션 단위로 렌더링한다. 각 섹션에는 `summary`를 먼저 표시하고, 아래에 `articles`의 제목, 게시 시간, 원문 링크를 표시한다.

---

## 8. 에러

| Status | Error Code | 상황 | 프론트 처리 |
| --- | --- | --- | --- |
| `401` | `INVALID_JWT_TOKEN` | 토큰 없음 또는 유효하지 않음 | 로그인 페이지 이동 |
| `401` | `EXPIRED_JWT_TOKEN` | 토큰 만료 | 토큰 제거 후 로그인 페이지 이동 |
| `502` | `NAVER_API_REQUEST_FAILED` | 네이버 뉴스 수집 실패 | 재시도 안내 |

LLM 요약 실패는 API 에러로 반환하지 않고, 해당 키워드의 `summary`에 fallback 문구를 반환한다.
