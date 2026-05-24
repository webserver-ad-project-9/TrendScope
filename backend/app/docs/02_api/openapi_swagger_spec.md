# TrendPulse Swagger/OpenAPI Specification

## 1. 작업 기준

이 문서는 현재 Controller로 구현된 API만 Swagger 문서화 대상으로 관리한다.

아직 구현되지 않은 API는 Swagger에 노출하지 않는다.

## 2. Swagger 의존성

```kotlin
implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:3.0.3")
```

현재 프로젝트는 Spring Boot `4.0.6` 기반이므로 springdoc 3.x starter를 사용한다.

## 3. Swagger 접속 URL

```text
Swagger UI: http://localhost:8080/swagger-ui/index.html
OpenAPI JSON: http://localhost:8080/v3/api-docs
```

## 4. 인증 방식

TrendPulse는 Google OAuth 로그인만 지원한다.

```text
GET /oauth2/authorization/google
```

OAuth 성공 후 백엔드는 JWT Access Token을 발급하고, 프론트엔드는 이후 보호 API 요청에 Bearer Token을 붙인다.

```http
Authorization: Bearer {accessToken}
```

Swagger Authorize 입력창에는 `Bearer` 없이 JWT 값만 입력한다.

## 5. 현재 Swagger 노출 API

| Group | Method | Endpoint | Auth | 구현 상태 |
| --- | --- | --- | --- | --- |
| Auth | GET | `/oauth2/authorization/google` | Public | Spring Security 기본 엔드포인트 |
| Auth | GET | `/api/auth/login` | Public | 구현됨 |
| Auth | POST | `/api/auth/logout` | Required | 구현됨 |
| User | GET | `/api/users/me` | Required | 구현됨 |
| Onboarding Keyword | POST | `/api/onboarding/keywords` | Required | 구현됨 |
| Onboarding Keyword | GET | `/api/onboarding/keywords` | Required | 구현됨 |
| Post | POST | `/api/posts` | Required | 구현됨 |

## 6. 공통 성공 응답

```json
{
  "success": true,
  "data": {},
  "message": "요청 성공"
}
```

## 7. 공통 실패 응답

```json
{
  "success": false,
  "errorCode": "POST_NOT_FOUND",
  "message": "게시글을 찾을 수 없습니다."
}
```

## 8. 구현된 API 요약

### `GET /oauth2/authorization/google`

Google OAuth 로그인을 시작한다.

> Bearer Token 불필요

### `GET /api/auth/login`

Spring Security OAuth 엔드포인트로 redirect한다.

> Bearer Token 불필요

### `POST /api/auth/logout`

Access Token only 구조에서 클라이언트 로그아웃을 처리한다.

> Bearer Token 필요

### `GET /api/users/me`

현재 JWT 인증에 성공한 사용자 정보를 조회한다.

> Bearer Token 필요

### `POST /api/onboarding/keywords`

현재 사용자의 온보딩 키워드를 생성한다.

> Bearer Token 필요

Request:

```json
{
  "name": "AI 반도체"
}
```

### `GET /api/onboarding/keywords`

현재 사용자의 온보딩 키워드 목록을 조회한다.

> Bearer Token 필요

### `POST /api/posts`

카테고리 게시판에 게시글을 작성한다.

> Bearer Token 필요

Request:

```json
{
  "category": "IT_SCIENCE",
  "title": "AI 반도체 뉴스가 급증하고 있습니다",
  "content": "대시보드에서 AI 반도체 키워드 트렌드가 상승하는 것이 보여 공유합니다."
}
```

## 9. 아직 Swagger에 노출하지 않는 API

아래 API는 MVP 예정 범위이지만 Controller 기능 구현 전까지 Swagger에 작성하지 않는다.

```text
PATCH /api/onboarding/keywords/{keywordId}
DELETE /api/onboarding/keywords/{keywordId}
PATCH /api/onboarding/keywords/{keywordId}/active
GET /api/posts
GET /api/posts/{postId}
PATCH /api/posts/{postId}
DELETE /api/posts/{postId}
POST /api/posts/{postId}/comments
GET /api/posts/{postId}/comments
PATCH /api/comments/{commentId}
DELETE /api/comments/{commentId}
```

## 10. Swagger JWT 테스트 방법

1. 브라우저에서 `/oauth2/authorization/google`로 로그인한다.
2. OAuth 성공 후 프론트 callback URL의 `token` 값을 복사한다.
3. `/swagger-ui/index.html`로 접속한다.
4. 우측 상단 `Authorize` 버튼을 누른다.
5. `Bearer` 없이 JWT 값만 입력한다.
6. 보호 API를 호출한다.
