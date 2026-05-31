# Onboarding Keyword MyPage API Spec

## 1. 개요

마이페이지에서 관심 키워드를 조회, 추가, 삭제, 전체 저장하는 API다.

최초 온보딩에서는 `POST /api/onboarding/keywords` 또는 `POST /api/onboarding/keywords/bulk`를 사용하고, 마이페이지 수정 화면에서는 `PUT /api/onboarding/keywords` 사용을 권장한다.

## 2. 공통

### Base URL

```txt
https://trend-scode.jarvis.n-e.kr
```

### Auth

```http
Authorization: Bearer {accessToken}
Cookie: accessToken={accessToken}
Content-Type: application/json
```

### 공통 응답

```ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
```

### TypeScript 타입

```ts
export interface OnboardingKeyword {
  id: string;
  name: string;
}

export interface CreateKeywordRequest {
  name: string;
}

export interface ReplaceKeywordsRequest {
  names: string[];
}
```

프론트 호환을 위해 백엔드는 아래 필드명도 허용한다.

```json
{ "keyword": "AI 반도체" }
```

```json
{ "keywords": ["AI 반도체", "엔비디아"] }
```

## 3. 내 키워드 조회

### `GET /api/onboarding/keywords`

현재 로그인한 사용자의 활성 키워드 목록을 조회한다.

### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "id": "5c08070a-98ac-4eff-9128-81b65d14d1ed",
      "name": "ai 반도체"
    }
  ],
  "message": "요청 성공"
}
```

## 4. 키워드 단건 추가

### `POST /api/onboarding/keywords`

키워드 1개를 추가한다.

### Request Body

```json
{
  "name": "AI 반도체"
}
```

또는:

```json
{
  "keyword": "AI 반도체"
}
```

### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "5c08070a-98ac-4eff-9128-81b65d14d1ed",
    "name": "ai 반도체"
  },
  "message": "요청 성공"
}
```

### Error

| Status | Code | 기준 |
| --- | --- | --- |
| 400 | `KEYWORD_LIMIT_EXCEEDED` | 활성 키워드 6개 초과 |
| 400 | `INVALID_REQUEST` | `name` 또는 `keyword` 누락 |
| 409 | `KEYWORD_DUPLICATED` | 이미 활성화된 키워드 |

## 5. 키워드 여러 개 추가

### `POST /api/onboarding/keywords/bulk`

여러 키워드를 한 번에 추가한다. 이미 활성화된 키워드는 건너뛴다.

### Request Body

```json
{
  "names": ["AI 반도체", "엔비디아"]
}
```

또는:

```json
{
  "keywords": ["AI 반도체", "엔비디아"]
}
```

## 6. 마이페이지 키워드 전체 저장

### `PUT /api/onboarding/keywords`

마이페이지에서 저장 버튼을 눌렀을 때 사용한다. 요청으로 보낸 목록이 저장 후 유지될 전체 활성 키워드 목록이다.

기존 목록에 있었지만 요청 목록에 없는 키워드는 비활성화된다. 기존에 삭제했던 키워드를 다시 보내면 재활성화된다.

### Request Body

```json
{
  "names": ["AI 반도체", "엔비디아", "경제"]
}
```

또는:

```json
{
  "keywords": ["AI 반도체", "엔비디아", "경제"]
}
```

### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "id": "5c08070a-98ac-4eff-9128-81b65d14d1ed",
      "name": "ai 반도체"
    },
    {
      "id": "84c198d1-5019-4f0b-9e40-5b2d613656de",
      "name": "엔비디아"
    }
  ],
  "message": "요청 성공"
}
```

`PATCH /api/onboarding/keywords`도 동일하게 동작한다.

## 7. 키워드 삭제

### `DELETE /api/onboarding/keywords/{keywordId}`

키워드를 물리 삭제하지 않고 비활성화한다.

### Response `200`

```json
{
  "success": true,
  "data": null,
  "message": "요청 성공"
}
```

## 8. Axios 함수

```ts
export const getOnboardingKeywords = () =>
  api.get<ApiResponse<OnboardingKeyword[]>>("/api/onboarding/keywords");

export const createOnboardingKeyword = (name: string) =>
  api.post<ApiResponse<OnboardingKeyword>>("/api/onboarding/keywords", { name });

export const createOnboardingKeywordsBulk = (names: string[]) =>
  api.post<ApiResponse<OnboardingKeyword[]>>("/api/onboarding/keywords/bulk", { names });

export const replaceOnboardingKeywords = (names: string[]) =>
  api.put<ApiResponse<OnboardingKeyword[]>>("/api/onboarding/keywords", { names });

export const deleteOnboardingKeyword = (keywordId: string) =>
  api.delete<ApiResponse<null>>(`/api/onboarding/keywords/${keywordId}`);
```

## 9. React Query 기준

```ts
const keywordKeys = {
  all: ["onboarding", "keywords"] as const,
};
```

마이페이지 저장 성공 후:

```ts
queryClient.invalidateQueries({ queryKey: keywordKeys.all });
queryClient.invalidateQueries({ queryKey: ["news"] });
```

## 10. 구현 권장 흐름

1. 마이페이지 진입 시 `GET /api/onboarding/keywords`
2. UI에서 키워드 추가/삭제는 로컬 상태로 먼저 반영
3. 저장 버튼 클릭 시 `PUT /api/onboarding/keywords`
4. 성공 응답의 `data`로 화면 상태 갱신
5. 뉴스/브리핑 관련 query invalidate
