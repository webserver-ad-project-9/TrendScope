# TrendPulse Keyword Frequency API 명세서

## 1. 개요

사용자의 활성 온보딩 키워드와 연결된 최신 뉴스 제목/설명에서 자주 등장하는 단어를 추출해 시각화용 빈도 데이터를 반환한다.

프론트 사용 목적:

1. 자주 등장하는 키워드 막대그래프
2. 키워드 워드클라우드
3. 트렌드 대시보드의 관련 키워드 랭킹

---

## 2. API

### `GET /api/news/keyword-frequency`

내 관심 키워드 기반 뉴스에서 자주 등장한 단어 빈도 목록을 조회한다.

> Bearer Token 필요, 로그인 쿠키 필요

### Request Header

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
```

### Query Parameters

| 이름 | 타입 | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| `limit` | number | X | `20` | 반환할 키워드 개수. 최소 1, 최대 50 |

### Request Body

없음

### Response `200`

```json
{
  "success": true,
  "data": {
    "articleCount": 49,
    "keywords": [
      {
        "keyword": "반도체",
        "count": 18,
        "weight": 100.0
      },
      {
        "keyword": "sk하이닉스",
        "count": 9,
        "weight": 50.0
      },
      {
        "keyword": "삼성전자",
        "count": 7,
        "weight": 38.9
      }
    ]
  },
  "message": "요청 성공"
}
```

---

## 3. Response Field

| 필드 | 타입 | nullable | 설명 |
| --- | --- | --- | --- |
| `articleCount` | number | N | 빈도 분석에 사용된 뉴스 기사 수 |
| `keywords` | `KeywordFrequencyItem[]` | N | 빈도순 키워드 목록 |
| `keywords[].keyword` | string | N | 추출된 키워드 |
| `keywords[].count` | number | N | 등장 횟수 |
| `keywords[].weight` | number | N | 그래프 표시용 상대 가중치. 최빈 키워드 기준 100 |

---

## 4. 빈 상태 기준

활성 온보딩 키워드가 없거나 연결된 뉴스가 없으면 빈 배열을 반환한다.

```json
{
  "success": true,
  "data": {
    "articleCount": 0,
    "keywords": []
  },
  "message": "요청 성공"
}
```

---

## 5. 정렬 기준

`keywords`는 `count DESC`, `keyword ASC` 순서로 정렬된다.

프론트는 응답 순서를 그대로 사용하면 된다.

---

## 6. TypeScript 타입

```ts
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
};

export type KeywordFrequencyItem = {
  keyword: string;
  count: number;
  weight: number;
};

export type KeywordFrequencyResponse = {
  articleCount: number;
  keywords: KeywordFrequencyItem[];
};
```

---

## 7. Axios 함수

```ts
export async function getKeywordFrequency(params?: { limit?: number }) {
  const response = await api.get<ApiResponse<KeywordFrequencyResponse>>(
    "/api/news/keyword-frequency",
    { params }
  );

  return response.data.data;
}
```

---

## 8. Recharts 막대그래프 예시

```tsx
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type Props = {
  data: KeywordFrequencyItem[];
};

export function KeywordFrequencyChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="keyword" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

---

## 9. UI 처리 기준

| 상태 | 기준 | UI |
| --- | --- | --- |
| 로딩 | API pending | skeleton 또는 spinner |
| 빈 데이터 | `keywords.length === 0` | “분석할 뉴스 데이터가 없습니다.” |
| 정상 | `keywords.length > 0` | 막대그래프 또는 랭킹 리스트 |
| 인증 실패 | `401` | 로그인 페이지 이동 |

