# TrendPulse 프론트 전달용 Auth / Keyword API 명세서

## 공통 사항

### Base URL

```text
http://localhost:8080
```

### 인증 방식

TrendPulse는 일반 이메일/비밀번호 로그인을 사용하지 않는다.

```text
로그인 방식: Google OAuth
인증 방식: Bearer Token + 로그인 쿠키
개발용 고정 토큰: mjyw123123123
로그인 쿠키 key: accessToken
```

보호 API 요청 시 프론트는 아래 두 값을 함께 보내야 한다.

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
```

브라우저에서는 `Cookie` 헤더를 직접 넣지 않고, `withCredentials: true` 설정으로 쿠키가 자동 전송되게 한다.

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

| Status | 상황 | Response |
| --- | --- | --- |
| `401` | Bearer Token 없음/불일치 | `{"success": false, "errorCode": "INVALID_JWT_TOKEN", "message": "유효하지 않은 토큰입니다."}` |
| `401` | 로그인 쿠키 없음 | `{"success": false, "errorCode": "LOGIN_COOKIE_REQUIRED", "message": "로그인 쿠키가 없습니다."}` |
| `401` | 토큰 만료 | `{"success": false, "errorCode": "EXPIRED_JWT_TOKEN", "message": "토큰이 만료되었습니다."}` |
| `404` | 사용자 없음 | `{"success": false, "errorCode": "USER_NOT_FOUND", "message": "사용자를 찾을 수 없습니다."}` |

---

## 1. 로그인

### `GET /api/auth`

Google OAuth 로그인 페이지로 리다이렉트한다.

> Bearer Token 불필요, 로그인 쿠키 불필요

### Request Body

없음

### Query Parameters

없음

### Response

`302 Redirect` -> Google OAuth 인증 페이지

```http
Location: /oauth2/authorization/google
```

### 프론트 구현 예시

```ts
const handleGoogleLogin = () => {
  window.location.href = "http://localhost:8080/api/auth";
};
```

### 메모

아래 URL로 직접 이동해도 동일하게 Google OAuth 로그인이 시작된다.

```http
GET http://localhost:8080/oauth2/authorization/google
```

---

## 2. OAuth Callback

### `GET /api/auth/login/callback`

Google OAuth 인증 완료 후 Google이 호출하는 백엔드 콜백이다.

프론트에서 직접 호출하지 않는다.

> Bearer Token 불필요, 로그인 쿠키 불필요

### 동작

1. Google OAuth 인증 성공
2. 백엔드가 Google 사용자 정보 조회
3. email 기준으로 기존 사용자 조회
4. 사용자가 없으면 자동 생성
5. JWT Access Token 발급
6. `accessToken` 로그인 쿠키 발급
7. 프론트엔드 callback URL로 리다이렉트

### Redirect URL

백엔드는 로그인 성공 후 프론트로 아래 형식으로 이동시킨다.

```text
http://localhost:3000/oauth/callback?token={JWT}
```

예시:

```text
http://localhost:3000/oauth/callback?token=eyJhbGciOiJIUzI1NiJ9...
```

### 발급되는 쿠키

| 항목 | 값 |
| --- | --- |
| key | `accessToken` |
| value | JWT Access Token |
| httpOnly | `false` |
| secure | `false` |
| path | `/` |
| maxAge | `3600` |

### 프론트 Callback 처리 예시

```ts
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    localStorage.setItem("accessToken", token);
    document.cookie = `accessToken=${token}; path=/; max-age=3600`;
    router.replace("/");
  }, [router, searchParams]);

  return null;
}
```

---

## 3. 개발용 Static Token 인증

현재 프론트 연동 테스트를 위해 아래 고정 토큰을 허용한다.

```text
mjyw123123123
```

프론트 요청에는 Bearer Token과 쿠키가 둘 다 들어가야 한다.

```http
Authorization: Bearer mjyw123123123
Cookie: accessToken=mjyw123123123
```

브라우저 콘솔에서 개발용 쿠키를 심는 예시:

```ts
document.cookie = "accessToken=mjyw123123123; path=/; max-age=3600";
```

Axios 설정 예시:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = "Bearer mjyw123123123";
  return config;
});
```

---

## 4. 로그아웃

### `POST /api/auth/logout`

프론트에서 저장한 토큰과 쿠키를 제거하여 로그아웃 처리한다.

현재 백엔드는 Access Token only 구조라 서버에 저장된 refresh token은 없다.

> Bearer Token 필요, 로그인 쿠키 필요

### Request Body

없음

### Request Header

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
```

### Response `200`

```json
{
  "success": true,
  "data": null,
  "message": "요청 성공"
}
```

### 프론트 처리 예시

```ts
const logout = async () => {
  await api.post("/api/auth/logout");
  localStorage.removeItem("accessToken");
  document.cookie = "accessToken=; path=/; max-age=0";
  window.location.href = "/login";
};
```

---

## 5. 현재 사용자 조회

### `GET /api/users/me`

현재 로그인한 사용자의 기본 정보를 조회한다.

> Bearer Token 필요, 로그인 쿠키 필요

### Request Body

없음

### Request Header

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
```

### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "4f4f9a2d-22e3-4b4e-8d01-83f9959dfc71",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "USER"
  },
  "message": "요청 성공"
}
```

### 에러

| Status | 상황 | Response |
| --- | --- | --- |
| `401` | 토큰 없음/불일치 | `{"success": false, "errorCode": "INVALID_JWT_TOKEN", "message": "유효하지 않은 토큰입니다."}` |
| `404` | 유저 없음 | `{"success": false, "errorCode": "USER_NOT_FOUND", "message": "사용자를 찾을 수 없습니다."}` |

---

## 6. 온보딩 키워드 생성

### `POST /api/onboarding/keywords`

현재 로그인한 사용자의 관심 키워드를 생성한다.

키워드 수집/분석 대상이 되는 데이터이므로 Bearer Token과 로그인 쿠키가 모두 필요하다.

> Bearer Token 필요, 로그인 쿠키 필요

### Request Header

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
Content-Type: application/json
```

### Request Body

```json
{
  "name": "AI 반도체"
}
```

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `name` | string | O | 등록할 관심 키워드 |

### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "6f84a524-9621-4d58-a454-75c84a8c5bb8",
    "name": "AI 반도체"
  },
  "message": "요청 성공"
}
```

### 에러

| Status | 상황 | Response |
| --- | --- | --- |
| `400` | 키워드 누락 | `{"success": false, "errorCode": "INVALID_REQUEST", "message": "키워드는 필수입니다."}` |
| `401` | 인증 실패 | `{"success": false, "errorCode": "INVALID_JWT_TOKEN", "message": "유효하지 않은 토큰입니다."}` |
| `409` | 중복 키워드 | `{"success": false, "errorCode": "KEYWORD_DUPLICATED", "message": "이미 등록된 키워드입니다."}` |

### 개발용 호출 예시

```http
POST http://localhost:8080/api/onboarding/keywords
Authorization: Bearer mjyw123123123
Cookie: accessToken=mjyw123123123
Content-Type: application/json
```

```json
{
  "name": "AI 반도체"
}
```

---

## 7. 내 온보딩 키워드 목록 조회

### `GET /api/onboarding/keywords`

현재 로그인한 사용자가 등록한 온보딩 키워드 목록을 조회한다.

> Bearer Token 필요, 로그인 쿠키 필요

### Request Header

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
```

### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "id": "6f84a524-9621-4d58-a454-75c84a8c5bb8",
      "name": "AI 반도체"
    }
  ],
  "message": "요청 성공"
}
```

---

## API 인증 정리

| API | Bearer Token | 로그인 쿠키 | 설명 |
| --- | --- | --- | --- |
| `GET /api/auth` | - | - | Google OAuth 로그인 시작 |
| `GET /oauth2/authorization/google` | - | - | Spring Security OAuth 로그인 시작 |
| `GET /api/auth/login/callback` | - | - | Google OAuth callback |
| `POST /api/auth/logout` | O | O | 로그아웃 |
| `GET /api/users/me` | O | O | 현재 사용자 조회 |
| `POST /api/onboarding/keywords` | O | O | 온보딩 키워드 생성 |
| `GET /api/onboarding/keywords` | O | O | 내 온보딩 키워드 목록 조회 |

## 프론트 전달 요약

```text
로그인 시작:
GET http://localhost:8080/api/auth

로그인 성공 후 이동:
http://localhost:3000/oauth/callback?token={JWT}

보호 API 요청:
Authorization: Bearer {JWT}
Cookie: accessToken={JWT}

개발용 테스트 값:
Authorization: Bearer mjyw123123123
Cookie: accessToken=mjyw123123123
```
