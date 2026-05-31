# Onboarding Keyword Delete API 명세서

## 1. 개요

로그인한 사용자가 등록한 뉴스 관심 키워드를 삭제한다.

삭제된 키워드는 물리 삭제하지 않고 `is_active=false`로 비활성화한다. 이후 뉴스 수집, 추천, 키워드 브리핑, 내 키워드 목록 조회 대상에서 제외된다. 같은 키워드를 다시 등록하면 기존 키워드 row를 재활성화한다.

---

## 2. API

### `DELETE /api/onboarding/keywords/{keywordId}`

현재 로그인한 사용자의 온보딩 키워드를 삭제한다.

> Bearer Token 필요, 로그인 쿠키 필요

### Request Header

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
```

### Path Parameters

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `keywordId` | string UUID | O | 삭제할 온보딩 키워드 ID |

### Request Body

없음

---

## 3. Response `200`

```json
{
  "success": true,
  "data": null,
  "message": "요청 성공"
}
```

삭제 성공 후 `GET /api/onboarding/keywords` 응답에는 해당 키워드가 포함되지 않는다.

---

## 4. 에러

| Status | Error Code | 상황 | Response |
| --- | --- | --- | --- |
| `401` | `INVALID_JWT_TOKEN` | 토큰 없음 또는 유효하지 않음 | `{"success":false,"errorCode":"INVALID_JWT_TOKEN","message":"Invalid JWT token"}` |
| `401` | `EXPIRED_JWT_TOKEN` | 토큰 만료 | `{"success":false,"errorCode":"EXPIRED_JWT_TOKEN","message":"Expired JWT token"}` |
| `404` | `KEYWORD_NOT_FOUND` | 키워드가 없거나 현재 사용자의 키워드가 아님 | `{"success":false,"errorCode":"KEYWORD_NOT_FOUND","message":"Keyword not found"}` |

---

## 5. 프론트 연동 예시

```ts
export async function deleteOnboardingKeyword(keywordId: string) {
  const response = await api.delete<ApiResponse<null>>(
    `/api/onboarding/keywords/${keywordId}`
  );

  return response.data;
}
```

삭제 성공 시 권장 캐시 무효화:

```ts
queryClient.invalidateQueries({ queryKey: ["onboarding", "keywords"] });
queryClient.invalidateQueries({ queryKey: ["news"] });
```
