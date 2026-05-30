# 아키텍처 문서 - TrendScope-front

## 요약
AI 기반 뉴스 트렌드 분석 서비스의 프론트엔드다. 현재 구현은 Next.js 단일 화면 앱이며, 화면 데이터는 확인된 Spring Boot 백엔드 API 응답 또는 사용자 입력 상태만 사용한다. 로컬 mock snapshot, 임의 키워드 검색 브리핑, 정적 차트/워드클라우드 데이터는 사용하지 않는다.

## 기본 정보
- 프로젝트 루트: `front-end`
- 앱 루트: `front-end/trend-scope-front`
- 스택: Next.js App Router, React, TypeScript, Tailwind CSS
- 인증 사용: Google OAuth redirect, OAuth callback token 저장, `accessToken` 쿠키 동기화, 현재 사용자 조회, 로그아웃 연동
- 외부 API 연동: Spring Boot 백엔드 Auth/User/Keyword/News/TrendAnalysis/Community API 연동. Naver News API와 LLM 호출은 백엔드 News API 뒤에 숨긴다.

## 계층 방향
- `app/page.tsx`: route entry로 `TrendScopeApp`만 렌더링한다.
- `src/components`: UI 표시와 사용자 이벤트 전달만 담당한다.
- `src/hooks`: 탭 이동, 보호 섹션 guard, 인증 bootstrap, 키워드/뉴스/트렌드/커뮤니티 상태 orchestration을 담당한다.
- `src/services`: 백엔드 API client와 도메인별 API service를 담당한다.
- `src/types`: 백엔드 DTO와 UI view model/status를 분리해 정의한다.

## React 흐름
```text
app/page.tsx
  -> src/components/trend-scope/TrendScopeApp.tsx
  -> src/hooks/useTrendScopeWorkspace.ts
  -> src/services/authService.ts, keywordService.ts, newsService.ts, trendAnalysisService.ts, communityService.ts
  -> src/services/apiClient.ts
  -> Backend API
```

## 데이터 흐름
- 클라이언트 hydration 후 `useTrendScopeWorkspace`가 `fetchCurrentUser()`로 로그인 상태를 확인한다. `apiClient`는 localStorage, `accessToken` 쿠키, 로컬 개발용 token 환경변수 순서로 Bearer token을 준비한다.
- 로그인 사용자가 확인되면 `fetchOnboardingKeywords()`가 백엔드 키워드 목록을 조회하고 UI view model로 변환한다.
- 홈 섹션은 public이며 키워드 검색 form이나 mock 지표를 제공하지 않는다.
- 홈을 제외한 기능 섹션은 `useTrendScopeWorkspace.goToSection()`에서 로그인 사용자 여부를 확인한다. 비로그인 사용자가 접근하면 `alert("로그인이 필요한 기능입니다.")`를 표시하고 홈으로 되돌린다.
- OAuth callback 직후 신규 가입 hint가 있고 키워드 목록이 비어 있으면 신규 가입 후보로 판단해 온보딩 섹션을 표시한다.
- 신규 가입 온보딩에서 사용자가 직접 입력한 키워드를 선택하면 `createOnboardingKeywordsBulk()`가 `POST /api/onboarding/keywords/bulk`로 첫 키워드 목록을 저장한다.
- 키워드 생성은 `createOnboardingKeyword()`로 백엔드에 저장한 뒤 응답 DTO를 UI view model로 반영한다.
- 로그인 사용자와 키워드가 준비되면 `fetchNewsRecommendations()`가 `GET /api/news/recommendations?refresh=false&limit=20`으로 내 키워드 기반 추천 뉴스를 조회한다.
- AI 브리핑 화면의 `최신 뉴스 가져오기`는 `GET /api/news/recommendations?refresh=true&limit=20`을 호출해 백엔드의 뉴스 수집을 실행하고 추천 목록을 교체한다.
- 추천 뉴스 카드의 `AI 요약`은 `POST /api/news/{newsId}/summary`를 호출하고 요약 결과를 카드 내부에 표시한다.
- 추천 뉴스 묶음 요약은 `POST /api/news/summary`를 호출하고 추천 뉴스 패널 상단에 결과를 표시한다.
- 뉴스 저장/저장 취소는 `POST /api/news/{newsId}/bookmarks`, `DELETE /api/news/{newsId}/bookmarks`를 호출하고 `GET /api/news/bookmarks`로 저장 목록을 동기화한다.
- 뉴스 대시보드 섹션은 로그인 사용자와 키워드 동기화가 준비되면 `GET /api/news/keyword-briefings`, `GET /api/news/keyword-frequency`, `GET /api/news/trend-scores`, `GET /api/news/today-issues`, `GET /api/news/suggested-keywords`, `GET /api/news/statistics/daily-counts`, `GET /api/news/clusters`, `GET /api/news/sentiments`, `GET /api/news/bookmarks`를 `newsService` 경계 뒤에서 호출한다.
- 로그인 사용자가 확인되면 `fetchTrendAnalysisSummary()`가 `GET /api/trend-analysis/summary`를 호출해 백엔드가 집계한 평균 트렌드 점수를 표시한다.
- 커뮤니티 카테고리와 게시글 목록은 `communityService`가 백엔드 `GET /api/community/categories`, `GET /api/posts`를 조회해 UI view model로 변환한다.
- 커뮤니티 상세 화면은 게시글 상세 `GET /api/posts/{postId}`와 댓글 목록 `GET /api/posts/{postId}/comments`를 함께 조회한다.
- 게시글 작성, 댓글 작성, 좋아요/좋아요 취소는 각각 `POST /api/posts`, `POST /api/posts/{postId}/comments`, `POST/DELETE /api/posts/{postId}/likes`를 호출한다.
- 작성자 본인의 게시글 수정/삭제와 댓글 수정/삭제는 각각 `PATCH/DELETE /api/posts/{postId}`, `PATCH/DELETE /api/comments/{commentId}`를 호출한다.

## 인증 흐름
- 헤더의 Google 로그인/시작하기 버튼은 백엔드 `GET /api/auth`로 이동한다.
- 백엔드는 OAuth 성공 후 `/oauth/callback?token={token}`으로 프론트를 redirect한다.
- `app/oauth/callback/page.tsx`는 Suspense 경계 안에서 `OAuthCallbackClient`를 렌더링한다.
- `OAuthCallbackClient`는 token query를 auth service에 전달해 환경변수로 지정한 브라우저 저장소와 cookie key에 저장하고, 신규 가입 여부 hint를 sessionStorage에 1회성 값으로 저장한 뒤 `/`로 이동한다.
- 홈 진입 후 백엔드 키워드 목록이 비어 있고 OAuth signup hint가 `signup` 또는 `unknown`이면 온보딩 섹션으로 이동한다. hint가 `login`이면 키워드가 비어 있어도 온보딩을 자동 표시하지 않는다.
- 보호 API 호출은 `apiClient`가 `Authorization` header와 `credentials: "include"`를 설정한다.
- 로그아웃은 `POST /api/auth/logout` 호출 후 로컬 token과 cookie를 제거하고 백엔드 기반 상태를 비운다.

## API 흐름
- 프론트 자체 API route는 추가하지 않았다.
- 백엔드 API 호출은 `src/services/apiClient.ts`에서만 `fetch`를 직접 사용한다.
- `authService`, `keywordService`, `newsService`, `trendAnalysisService`, `communityService`는 HTTP 세부사항을 감추고 typed result 또는 UI view model을 반환한다.
- UI 컴포넌트는 API client를 직접 import하지 않고 hook callback만 호출한다.

## 저장 흐름
- OAuth token은 환경변수로 지정한 브라우저 storage key와 cookie key에 저장한다.
- OAuth 직후 신규 가입 여부 hint는 sessionStorage에 1회성으로 저장하고 인증 bootstrap에서 소비한다.
- 백엔드 host, token 저장 key/cookie key, 로컬 개발용 token fallback은 앱 루트의 `.env.local`에서 관리한다.
- 온보딩 키워드, 추천 뉴스, 뉴스 요약, 트렌드 분석, 커뮤니티 데이터의 source of truth는 백엔드 API 응답이다.
- 커뮤니티 게시판 필터, 작성 draft, 댓글 draft, 활성 게시글 전환은 브라우저 메모리 상태다.

## 외부 연동 흐름
- Auth/User/Keyword/News/TrendAnalysis/Community 백엔드 REST API는 계약이 확인되어 전용 service와 `apiClient` 경계 뒤에서 호출한다.
- 백엔드 Base URL은 `NEXT_PUBLIC_BACKEND_API_BASE_URL`에서만 읽고 코드에 host를 하드코딩하지 않는다.
- Naver News API와 LLM 호출은 백엔드 News API 뒤에 숨겨져 있으며 프론트에서 직접 호출하지 않는다.
- 임의 키워드 검색용 뉴스 분석 API는 계약 미확정 상태이므로 화면과 로컬 구현을 제거했다.

## 아키텍처 결정
| Date | Decision | Reason | Impact |
| --- | --- | --- | --- |
| 2026-05-25 | `sample_design.html`을 Next.js App Router 기반 React 컴포넌트로 분리 | 단일 HTML의 DOM 조작을 React 상태 흐름으로 전환 | `app/page.tsx`, `src/components`, `src/hooks`, `src/services`, `src/types` 구조 생성 |
| 2026-05-25 | Auth/User/Keyword API를 service/client 경계로 연동 | 백엔드 계약이 확인됨 | OAuth callback route, auth service, keyword service, API DTO 분리 추가 |
| 2026-05-25 | 백엔드 host와 외부 key 설정을 env 파일로 분리 | 환경별 설정과 secret을 Git 추적에서 제외 | `.env.local` ignore, `.env.example` template, `src/config/environment.ts` 추가 |
| 2026-05-28 | 커뮤니티 게시판을 백엔드 API와 연동 | 백엔드 게시판/댓글/좋아요 계약이 추가됨 | `communityService`, 커뮤니티 DTO, 선택 인증 API 호출, 게시글/댓글/좋아요 백엔드 동기화 추가 |
| 2026-05-28 | 키워드 온보딩을 OAuth 이후 신규 가입 후보에게만 표시 | OAuth 전에는 신규/기존 사용자 판단이 불가능함 | 로그인 버튼은 직접 OAuth를 시작하고, callback 직후 키워드 목록과 signup hint로 온보딩 표시 여부 결정 |
| 2026-05-28 | 뉴스 추천/수집/요약을 백엔드 API와 연동 | 백엔드가 내 키워드 기반 추천 뉴스, 수집 refresh, LLM 요약 계약을 제공함 | `newsService`, 뉴스 DTO/view model, AI 브리핑 추천 뉴스 패널 추가 |
| 2026-05-28 | 홈 검색을 제거하고 기능 섹션을 보호 라우팅으로 전환 | 홈은 public 진입점으로 단순화하고 로그인 사용자에게만 기능 화면을 허용 | 홈 검색 form 제거, 비로그인 보호 섹션 접근 시 alert 후 홈 복귀 |
| 2026-05-28 | 로컬 mock snapshot과 임의 검색 브리핑 제거 | 현재 요청과 계층 규칙상 확인된 백엔드 API만 사용해야 함 | `trendDashboardService`, 검색 섹션, 정적 시각화 제거, `trendAnalysisService` 추가 |
| 2026-05-30 | back-docs의 확인된 News Dashboard/Keyword Briefing/Bookmark/Community mutation API를 프론트에 연동 | mock 없이 백엔드 API 응답만 표시해야 함 | `dashboard` 섹션 추가, `newsService` 대시보드 호출 확장, 게시글/댓글 수정 삭제 UI 추가 |
| 2026-05-31 | 실 서비스형 UI 표시 안정성 개선 | 다양한 화면 폭과 긴 데이터 값에서 기능 조작 영역이 무너지지 않아야 함 | 밝은 운영 UI 톤 적용, header/navigation/action button responsive 처리, 긴 텍스트 overflow 방어, service/hook/API 계약 유지 |
