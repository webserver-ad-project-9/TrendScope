# API 명세 - TrendScope-front

이 문서는 프론트엔드가 호출하는 백엔드 API 계약을 기록한다.

## 공통
- Base URL: `NEXT_PUBLIC_BACKEND_API_BASE_URL` 환경변수 값을 사용한다.
- 공통 성공 응답: `{ success: true, data, message }`
- 공통 실패 응답: `{ success: false, errorCode, message }`
- 보호 API 인증: `Authorization: Bearer {token}` header와 `accessToken` cookie가 모두 필요하다.
- 브라우저 cookie 전송: 프론트 API client는 `credentials: "include"`를 사용한다.
- Token 준비 순서: localStorage, `accessToken` cookie, 로컬 개발용 token 환경변수 순서로 확인한다.
- Token 저장: OAuth callback query의 `token` 값을 환경변수로 지정한 storage key와 cookie key에 저장한다. localStorage가 비어 있고 cookie가 있으면 cookie 값을 storage에 동기화한다.
- Token 값은 코드와 프로젝트 문서에 직접 기록하지 않는다. 로컬 개발용 static token도 `.env.local`에만 둔다.
- Local env: 실제 값은 `front-end/trend-scope-front/.env.local`에 둔다. Git에는 실제 token/secret 없이 `.env.example`만 커밋한다.

## 프론트 라우트
### GET `/oauth/callback`
- 설명: 백엔드 OAuth 성공 redirect를 처리하는 프론트 라우트다.
- 인증: public
- Query params:
  - `token`: string, optional, 백엔드가 발급한 access token
- 동작:
  1. `token`이 있으면 브라우저 저장소와 cookie에 저장한다.
  2. `/`로 replace navigation 한다.
  3. `token`이 없으면 저장 없이 `/`로 replace navigation 한다.
- Error cases: 화면 오류를 노출하지 않고 홈으로 복귀한다.

## 백엔드 API
### GET `/api/auth`
- 설명: Google OAuth 로그인을 시작한다.
- 인증: public
- Path params: 없음
- Query params: 없음
- Request body: 없음
- Response body: 없음
- Status codes:
  - `302`: Google OAuth 인증 페이지로 redirect
- Error cases: 백엔드 OAuth 설정 오류는 백엔드 redirect/error 화면에서 처리된다.
- Notes:
  - 백엔드의 Spring Security OAuth 시작 URL인 `/oauth2/authorization/google`도 같은 로그인 흐름을 시작할 수 있으나, 프론트 기본 진입점은 `/api/auth`다.
  - 백엔드 OAuth 내부 callback인 `/api/auth/login/callback`은 Google과 백엔드 사이의 callback이므로 프론트에서 직접 호출하지 않는다.

### POST `/api/auth/logout`
- 설명: 현재 사용자 로그아웃을 요청한다. 프론트는 응답 성공/실패와 관계없이 로컬 token과 cookie를 정리한다.
- 인증: Bearer token + `accessToken` cookie
- Path params: 없음
- Query params: 없음
- Request body: 없음
- Response body:
  - `success`: boolean, required
  - `data`: null, nullable
  - `message`: string, required
- Status codes:
  - `200`: 로그아웃 요청 성공
  - `401`: 인증 실패
- Error cases:
  - `INVALID_JWT_TOKEN`: Bearer token 누락 또는 불일치
  - `LOGIN_COOKIE_REQUIRED`: 로그인 cookie 누락
  - `EXPIRED_JWT_TOKEN`: token 만료

### GET `/api/users/me`
- 설명: 현재 로그인 사용자의 기본 정보를 조회한다.
- 인증: Bearer token + `accessToken` cookie
- Path params: 없음
- Query params: 없음
- Request body: 없음
- Response body:
  - `success`: boolean, required
  - `data`: object, required
  - `data.id`: string, required, 사용자 ID
  - `data.email`: string, required, 이메일
  - `data.name`: string, required, 사용자 이름
  - `data.role`: string, required, 사용자 role
  - `message`: string, required
- Status codes:
  - `200`: 조회 성공
  - `401`: 인증 실패
  - `404`: 사용자 없음
- Error cases:
  - `MISSING_ACCESS_TOKEN`: 브라우저에 사용할 token이 없어 프론트 API client가 요청 전 차단
  - `INVALID_JWT_TOKEN`: Bearer token 누락 또는 불일치
  - `LOGIN_COOKIE_REQUIRED`: 로그인 cookie 누락
  - `EXPIRED_JWT_TOKEN`: token 만료
  - `USER_NOT_FOUND`: token에 해당하는 사용자 없음

### GET `/api/onboarding/keywords`
- 설명: 현재 사용자의 온보딩 키워드 목록을 조회한다.
- 인증: Bearer token + `accessToken` cookie
- Path params: 없음
- Query params: 없음
- Request body: 없음
- Response body:
  - `success`: boolean, required
  - `data`: array, required
  - `data[].id`: string, required, 키워드 ID
  - `data[].name`: string, required, 키워드명
  - `message`: string, required
- Status codes:
  - `200`: 조회 성공
  - `401`: 인증 실패
- Error cases:
  - `MISSING_ACCESS_TOKEN`: 브라우저에 사용할 token이 없어 프론트 API client가 요청 전 차단
  - `INVALID_JWT_TOKEN`: Bearer token 누락 또는 불일치
  - `LOGIN_COOKIE_REQUIRED`: 로그인 cookie 누락
  - `EXPIRED_JWT_TOKEN`: token 만료

### POST `/api/onboarding/keywords`
- 설명: 현재 사용자의 온보딩 키워드를 생성한다.
- 인증: Bearer token + `accessToken` cookie
- Path params: 없음
- Query params: 없음
- Request body:
  - `name`: string, required, 생성할 키워드명
- Response body:
  - `success`: boolean, required
  - `data`: object, required
  - `data.id`: string, required, 생성된 키워드 ID
  - `data.name`: string, required, 생성된 키워드명
  - `message`: string, required
- Status codes:
  - `200`: 생성 성공
  - `400`: 요청 형식 오류
  - `401`: 인증 실패
  - `409`: 중복 키워드
- Error cases:
  - `INVALID_REQUEST`: 키워드 누락
  - `MISSING_ACCESS_TOKEN`: 브라우저에 사용할 token이 없어 프론트 API client가 요청 전 차단
  - `INVALID_JWT_TOKEN`: Bearer token 누락 또는 불일치
  - `LOGIN_COOKIE_REQUIRED`: 로그인 cookie 누락
  - `EXPIRED_JWT_TOKEN`: token 만료
  - `KEYWORD_DUPLICATED`: 이미 등록된 키워드

### POST `/api/onboarding/keywords/bulk`
- 설명: 최초 로그인 온보딩에서 선택한 여러 관심 키워드를 한 번에 생성한다. 백엔드는 이미 저장된 키워드는 중복 저장하지 않고 건너뛴다.
- 인증: Bearer token + `accessToken` cookie
- Path params: 없음
- Query params: 없음
- Request body:
  - `names`: string[], required, 생성할 키워드명 목록
- Response body:
  - `success`: boolean, required
  - `data`: array, required, 새로 생성된 키워드 목록
  - `data[].id`: string, required, 생성된 키워드 ID
  - `data[].name`: string, required, 생성된 키워드명
  - `message`: string, required
- Status codes:
  - `200`: 일괄 생성 성공
  - `400`: 요청 형식 오류
  - `401`: 인증 실패
- Error cases:
  - `INVALID_REQUEST`: 키워드 목록 누락 또는 빈 배열
  - `MISSING_ACCESS_TOKEN`: 브라우저에 사용할 token이 없어 프론트 API client가 요청 전 차단
  - `INVALID_JWT_TOKEN`: Bearer token 누락 또는 불일치
  - `LOGIN_COOKIE_REQUIRED`: 로그인 cookie 누락
  - `EXPIRED_JWT_TOKEN`: token 만료

## 미연동 계약
- 키워드 수정/삭제 API는 현재 백엔드 문서에 정의되어 있지 않아 호출하지 않는다.
- 뉴스 분석, AI 브리핑, 커뮤니티 API는 현재 백엔드 문서에 정의되어 있지 않아 기존 로컬 view model을 유지한다.
