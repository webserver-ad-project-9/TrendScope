# 아키텍처 문서 - TrendScope-front

## 요약
AI 기반 뉴스 트렌드 분석 서비스의 프론트엔드다. 현재 구현은 `sample_design.html`을 기준으로 한 Next.js 단일 화면 앱이며, 백엔드 Auth/User/Keyword API는 실제 HTTP로 연동한다. 뉴스 분석, AI 브리핑, 커뮤니티 API는 아직 계약이 없어 로컬 view model을 유지한다.

## 기본 정보
- 프로젝트 루트: `front-end`
- 앱 루트: `front-end/trend-scope-front`
- 스택: Next.js App Router, React, TypeScript, Tailwind CSS
- 인증 사용: Google OAuth redirect, OAuth callback token 저장, `accessToken` 쿠키 동기화, 현재 사용자 조회, 로그아웃 연동
- 외부 API 연동: Spring Boot 백엔드 Auth/User/Keyword API 연동. Naver News API/OpenAI API 계약은 미확정이므로 미구현

## 계층 방향
- `app/page.tsx`: 라우팅 단위 화면 조립. 초기 뷰 모델 service를 호출하고 앱 컴포넌트에 전달한다.
- `src/components`: UI 표시와 사용자 이벤트 전달만 담당한다.
- `src/hooks`: 탭 이동, 키워드 편집, 별도 검색 화면 결과 표시, 커뮤니티 게시판 필터, 게시글 작성, 게시글 상세 전환 같은 화면 상태 전이를 담당한다.
- `src/services`: 초기 화면 뷰 모델 제공, 백엔드 API client, auth service, keyword service를 담당한다.
- `src/types`: UI view model, auth view model, 백엔드 DTO 타입을 분리해 정의한다.

## React 흐름
```text
app/page.tsx
  -> src/services/trendDashboardService.ts
  -> src/components/trend-scope/TrendScopeApp.tsx
  -> src/hooks/useTrendScopeWorkspace.ts
  -> src/services/authService.ts, src/services/keywordService.ts
  -> src/services/apiClient.ts
  -> Backend API
```

## 데이터 흐름
- 초기 렌더링 시 `getTrendDashboardSnapshot()`이 참조용 대시보드 데이터를 반환한다.
- `TrendScopeApp`은 초기 데이터를 props로 받아 하위 섹션 컴포넌트에 전달한다.
- 클라이언트 hydration 후 `useTrendScopeWorkspace`가 `fetchCurrentUser()`로 로그인 상태를 확인한다. 이때 `apiClient`는 localStorage, `accessToken` 쿠키, 로컬 개발용 token 환경변수 순서로 Bearer token을 준비한다.
- 로그인 사용자가 확인되면 `fetchOnboardingKeywords()`가 백엔드 키워드 목록을 조회하고 UI view model로 변환한다.
- 키워드 생성은 `createOnboardingKeyword()`로 백엔드에 저장한 뒤 응답 DTO를 UI view model로 반영한다.
- 키워드 검색 결과 브리핑, 커뮤니티 게시판 필터, 작성 게시글, 커뮤니티 상세 화면은 아직 API 계약이 없어 `useTrendScopeWorkspace`의 클라이언트 상태로 관리한다.

## 인증 흐름
- 헤더의 Google 로그인 버튼은 `GET /api/auth`로 브라우저를 이동시켜 백엔드 OAuth 흐름을 시작한다.
- 백엔드는 OAuth 성공 후 `/oauth/callback?token={token}`으로 프론트를 redirect한다.
- `app/oauth/callback/page.tsx`는 Suspense 경계 안에서 `OAuthCallbackClient`를 렌더링한다.
- `OAuthCallbackClient`는 token query를 auth service에 전달해 환경변수로 지정한 브라우저 저장소와 cookie key에 저장하고 `/`로 이동한다.
- 보호 API 호출은 `apiClient`가 `Authorization` header와 `credentials: "include"`를 설정한다. localStorage에 token이 없고 `accessToken` 쿠키가 있으면 쿠키 값을 localStorage에 동기화해 Bearer token으로 사용한다.
- 백엔드 Google OAuth 내부 callback인 `/api/auth/login/callback`은 프론트에서 직접 호출하지 않는다.
- 로그아웃은 `POST /api/auth/logout` 호출 후 로컬 token과 cookie를 제거한다.

## API 흐름
- 프론트 자체 API route는 추가하지 않았다.
- 백엔드 API 호출은 `src/services/apiClient.ts`에서만 `fetch`를 직접 사용한다.
- `authService`와 `keywordService`는 HTTP 세부사항을 감추고 typed result 또는 UI view model을 반환한다.
- UI 컴포넌트는 API client를 직접 import하지 않고 hook callback만 호출한다.

## 저장 흐름
- OAuth token은 환경변수로 지정한 브라우저 storage key와 cookie key에 저장한다.
- 백엔드 host, token 저장 key/cookie key, 로컬 개발용 token fallback은 앱 루트의 `.env.local`에서 관리한다.
- 온보딩 키워드는 백엔드 저장소를 source of truth로 사용한다.
- 게시판 필터, 작성 게시글, 게시글 상세 전환은 브라우저 메모리 상태다.

## 외부 연동 흐름
- Auth/User/Keyword 백엔드 REST API는 계약이 확인되어 전용 `apiClient` 경계 뒤에서 호출한다.
- 백엔드 Base URL은 `NEXT_PUBLIC_BACKEND_API_BASE_URL`에서만 읽고 코드에 host를 하드코딩하지 않는다.
- Naver News API, OpenAI API, 뉴스 분석 API, 커뮤니티 API는 계약 미확정 상태다.
- 추가 연동 시 전용 client/adapter를 만들고 timeout, retry, failure mapping을 문서화해야 한다.

## 아키텍처 결정
| Date | Decision | Reason | Impact |
| --- | --- | --- | --- |
| 2026-05-25 | `sample_design.html`을 Next.js App Router 기반 React 컴포넌트로 분리 | 단일 HTML의 DOM 조작을 React 상태 흐름으로 전환 | `app/page.tsx`, `src/components`, `src/hooks`, `src/services`, `src/types` 구조 생성 |
| 2026-05-25 | 뉴스/AI/커뮤니티 API 없이 로컬 초기 뷰 모델만 제공 | 해당 백엔드/API 계약이 확인되지 않음 | 뉴스 수집/AI 요약/커뮤니티 저장은 수행하지 않음 |
| 2026-05-25 | 키워드 검색을 마이페이지에서 별도 화면으로 분리 | 키워드 관리와 검색/분석 탐색 책임을 분리 | `search` 섹션 추가, 검색 완료 후 AI 브리핑과 같은 형식으로 결과 표시 |
| 2026-05-25 | 커뮤니티를 분야별 게시판과 별도 글쓰기 화면으로 분리 | 게시글 목록 탐색과 작성 책임 분리 | 경제/사회/IT/정치/문화/세계 필터, `writePost` 섹션, 클라이언트 작성 게시글 상태 추가 |
| 2026-05-25 | Auth/User/Keyword API를 service/client 경계로 연동 | 백엔드 계약이 확인됨 | OAuth callback route, auth service, keyword service, API DTO 분리 추가 |
| 2026-05-25 | 백엔드 host와 외부 key 설정을 env 파일로 분리 | 환경별 설정과 secret을 Git 추적에서 제외 | `.env.local` ignore, `.env.example` template, `src/config/environment.ts` 추가 |
| 2026-05-25 | 보호 API token 준비 순서를 localStorage, `accessToken` 쿠키, 로컬 개발용 env token으로 정규화 | 백엔드 수정 명세가 Bearer token과 로그인 쿠키 동시 전송 및 개발용 static token 흐름을 정의함 | `apiClient`가 Bearer header와 cookie 동기화를 담당하고 UI는 service/hook 경계만 호출 |
