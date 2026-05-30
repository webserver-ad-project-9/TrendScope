# 흐름 문서 - TrendScope-front

주요 기능 흐름을 단계별로 기록한다.

## 첫 화면 확인
- Actor: 방문자
- Entry point: `/`
- Preconditions: Next.js 앱 실행
- Steps:
  1. `app/page.tsx`가 `TrendScopeApp`을 렌더링한다.
  2. `TrendScopeApp`이 헤더, 홈, 온보딩, AI 브리핑, 마이페이지, 커뮤니티, 게시글 작성, 게시글 상세 섹션을 조립한다.
  3. `activeSection=home` 상태로 public 홈 화면이 표시된다.
  4. 홈 화면은 키워드 검색 form, mock 지표, 정적 시각화를 제공하지 않는다.
- Validation: 없음
- Empty state: 없음
- Error state: 없음
- Permission behavior: public
- Retry or recovery: 새로고침
- Side effects: 없음
- Related API: 클라이언트 hydration 후 `GET /api/community/categories`, `GET /api/posts`; 사용 가능한 token이 있으면 `GET /api/users/me`, `GET /api/onboarding/keywords`, `GET /api/news/recommendations?refresh=false&limit=20`, `GET /api/trend-analysis/summary`
- Related DB tables: 없음

## 보호 섹션 접근
- Actor: 방문자
- Entry point: 헤더 `AI 브리핑`, `마이페이지`, `커뮤니티` 또는 기능 내부 이동 버튼
- Preconditions: 앱이 클라이언트에서 hydration 완료
- Steps:
  1. 방문자가 홈을 제외한 기능 섹션으로 이동을 시도한다.
  2. `useTrendScopeWorkspace.goToSection()`이 `currentUser` 존재 여부를 확인한다.
  3. 로그인 사용자가 아니면 `alert("로그인이 필요한 기능입니다.")`를 표시한다.
  4. `activeSection`을 `home`으로 되돌리고 `activePost` 상태를 초기화한다.
  5. 로그인 사용자이면 요청한 섹션으로 이동한다.
- Validation: `home`은 public, 그 외 `onboarding`, `briefing`, `mypage`, `community`, `writePost`, `post`는 로그인 사용자만 접근 가능
- Empty state: 없음
- Error state: 없음
- Permission behavior: 비로그인 접근은 alert 후 홈 복귀
- Retry or recovery: Google 로그인 후 다시 기능 섹션 접근
- Side effects: alert 표시, active section/post state 초기화, window scroll top
- Related API: 없음
- Related DB tables: 없음

## 최초 로그인 온보딩 키워드 결정
- Actor: 방문자
- Entry point: OAuth callback 후 신규 가입 후보로 판단된 사용자
- Preconditions: OAuth callback token 저장 완료, 현재 사용자 조회 성공
- Steps:
  1. OAuth callback에서 token과 신규 가입 여부 hint를 저장한 뒤 홈으로 돌아온다.
  2. `useTrendScopeWorkspace`가 현재 사용자와 백엔드 키워드 목록을 조회한다.
  3. OAuth callback 직후이고, 백엔드 키워드 목록이 비어 있으며, signup hint가 `signup` 또는 `unknown`이면 `onboarding` 섹션으로 이동한다.
  4. signup hint가 `login`이면 키워드 목록이 비어 있어도 온보딩을 자동 표시하지 않는다.
  5. 사용자가 직접 입력으로 첫 관심 키워드를 선택한다.
  6. `선택한 키워드 저장`을 누르면 `createOnboardingKeywordsBulk()`가 `POST /api/onboarding/keywords/bulk`로 일괄 저장한다.
  7. 저장 성공 후 홈으로 돌아간다.
- Validation: trim 후 빈 키워드는 선택 목록에 추가하지 않음. 중복 키워드는 클라이언트에서 한 번만 보관.
- Empty state: 선택 키워드가 없으면 primary 저장 버튼 비활성화. `나중에 설정`으로 키워드 설정을 건너뛸 수 있음.
- Error state: bulk 생성 실패 시 `keywordSyncStatus=error`, 실패 메시지 표시
- Permission behavior: bulk 생성은 OAuth 성공 후 Bearer token과 `accessToken` cookie가 있을 때만 호출한다.
- Retry or recovery: 온보딩에서 다시 저장하거나 마이페이지에서 개별 키워드 등록
- Side effects: OAuth callback hint sessionStorage 1회 소비, 백엔드 keyword bulk 생성
- Related API: `GET /api/users/me`, `GET /api/onboarding/keywords`, `POST /api/onboarding/keywords/bulk`
- Related DB tables: 백엔드 User, Keyword

## 로그인 및 사용자 확인
- Actor: 방문자
- Entry point: 헤더 `Google 로그인`
- Preconditions: 백엔드 서버가 실행 중이고 Google OAuth 설정이 완료됨
- Steps:
  1. 사용자가 헤더 `Google 로그인` 또는 `시작하기`를 누른다.
  2. `authService.startGoogleOAuthLogin()`이 백엔드 `GET /api/auth`로 브라우저를 이동시킨다.
  3. 백엔드 OAuth 성공 후 프론트 `/oauth/callback?token={token}`으로 redirect한다. 신규 가입 여부 hint가 있으면 `isNewUser`, `isSignup`, `newUser`, `signup` query로 함께 전달될 수 있다.
  4. `OAuthCallbackClient`가 query token과 신규 가입 여부 hint를 auth service에 전달한다.
  5. `apiClient`가 환경변수로 지정한 브라우저 storage key와 cookie key에 token을 저장하고, auth service가 signup hint를 sessionStorage에 1회성으로 저장한다.
  6. 홈으로 이동한 뒤 `useTrendScopeWorkspace`가 현재 사용자와 키워드 목록을 조회한다.
  7. 신규 가입 후보로 판단되면 키워드 온보딩 화면을 표시하고, 기존 로그인으로 판단되면 홈을 유지한다.
- Validation: token query가 없으면 저장하지 않고 홈으로 복귀
- Empty state: token이 없으면 익명 상태 유지
- Error state: 현재 사용자 조회 실패 시 `authStatus=error`
- Permission behavior: 로그인 전 보호 API는 호출하지 않고 `MISSING_ACCESS_TOKEN`으로 정규화. localStorage가 비어 있어도 `accessToken` 쿠키나 로컬 개발용 token 환경변수가 있으면 Bearer token으로 동기화한 뒤 보호 API를 호출한다.
- Retry or recovery: 다시 Google 로그인 시도
- Side effects: 브라우저 token/cookie 저장, OAuth signup hint 1회 저장/소비
- Related API: `GET /api/auth`, `GET /api/users/me`, `GET /api/onboarding/keywords`, `POST /api/onboarding/keywords/bulk`
- Related DB tables: 백엔드 User, Keyword

## 로그아웃
- Actor: 로그인 사용자
- Entry point: 헤더 `로그아웃`
- Preconditions: 저장 token 존재
- Steps:
  1. 사용자가 로그아웃 버튼을 누른다.
  2. `logoutCurrentUser()`가 `POST /api/auth/logout`을 호출한다.
  3. 요청 성공/실패와 관계없이 로컬 token과 cookie를 제거한다.
  4. hook이 `currentUser=null`, `authStatus=anonymous`로 전환하고 백엔드 기반 보호 상태를 비운다.
- Validation: 없음
- Empty state: 키워드, 추천 뉴스, 트렌드 분석 요약은 비어 있는 상태가 된다.
- Error state: 백엔드 로그아웃 실패 메시지는 auth message로 보관하되 로컬 token은 제거
- Permission behavior: 로그아웃 후 보호 API는 저장 token 없음으로 차단
- Retry or recovery: 다시 로그인
- Side effects: 브라우저 token/cookie 삭제
- Related API: `POST /api/auth/logout`
- Related DB tables: 없음

## 키워드 관리
- Actor: 사용자
- Entry point: 헤더 `마이페이지`
- Preconditions: 앱이 클라이언트에서 hydration 완료, 백엔드 보호 API는 token 필요
- Steps:
  1. 로그인 상태 확인 성공 후 `GET /api/onboarding/keywords`가 내 키워드를 불러온다.
  2. 사용자가 새 키워드를 입력한다.
  3. 등록 submit이 `useTrendScopeWorkspace.addKeyword()`를 호출한다.
  4. hook이 빈 문자열과 익명 상태를 제외하고 keyword service에 생성 요청을 보낸다.
  5. `POST /api/onboarding/keywords` 응답 DTO를 `KeywordViewModel`로 변환해 목록에 반영한다.
- Validation: trim 후 빈 문자열은 추가하지 않음
- Empty state: 백엔드 목록이 비어 있으면 빈 목록 메시지 표시
- Error state: API 실패 시 `keywordSyncStatus=error`, `keywordSyncMessage` 표시
- Permission behavior: 로그인 사용자가 확인되지 않았거나 token이 없으면 등록하지 않고 로그인 필요 메시지 표시
- Retry or recovery: token 저장 후 다시 등록하거나 새로고침
- Side effects: 백엔드 keyword 생성, 클라이언트 keyword state 갱신
- Related API: `GET /api/onboarding/keywords`, `POST /api/onboarding/keywords`
- Related DB tables: 백엔드 Keyword
- Notes: 키워드 수정/삭제 API는 백엔드 계약에 없어 호출하지 않는다.

## 트렌드 분석 요약 조회
- Actor: 로그인 사용자
- Entry point: 인증 bootstrap 후 AI 브리핑
- Preconditions: 현재 사용자 조회 성공
- Steps:
  1. `useTrendScopeWorkspace`가 로그인 사용자 확인 후 `fetchTrendAnalysisSummary()`를 호출한다.
  2. `trendAnalysisService`가 `GET /api/trend-analysis/summary`를 호출한다.
  3. 응답의 `trendScore`를 UI view model로 변환한다.
  4. AI 브리핑 화면에 평균 트렌드 점수를 표시한다.
- Validation: 로그인 사용자 필요
- Empty state: 응답이 없거나 실패하면 점수 대신 상태 메시지 표시
- Error state: API 실패 시 `trendAnalysisSyncStatus=error`, `trendAnalysisSyncMessage` 표시
- Permission behavior: Bearer token과 `accessToken` cookie가 필요하다.
- Retry or recovery: 새로고침 또는 재로그인
- Side effects: `trendAnalysisSummary` state 교체
- Related API: `GET /api/trend-analysis/summary`
- Related DB tables: 백엔드 TrendAnalysis

## 추천 뉴스 조회 및 수집
- Actor: 로그인 사용자
- Entry point: 헤더 `AI 브리핑`
- Preconditions: 현재 사용자 조회 성공, 온보딩 키워드 목록 조회 성공
- Steps:
  1. `useTrendScopeWorkspace`가 로그인 사용자와 키워드가 준비된 뒤 `fetchNewsRecommendations({ refresh: false })`를 호출한다.
  2. `newsService`가 `GET /api/news/recommendations?refresh=false&limit=20`을 호출한다.
  3. 응답의 `keywords`와 `articles`를 UI view model로 변환해 AI 브리핑 추천 뉴스 패널에 표시한다.
  4. 사용자가 `최신 뉴스 가져오기`를 누르면 `fetchNewsRecommendations({ refresh: true })`를 호출한다.
  5. 백엔드가 네이버 뉴스 수집을 수행한 뒤 반환한 추천 뉴스 목록으로 기존 목록을 교체한다.
- Validation: 로그인 사용자와 키워드 1개 이상 필요. `limit`은 service 기본값 `20`을 사용.
- Empty state: 키워드가 없으면 키워드 등록 안내. 키워드는 있지만 뉴스가 없으면 최신 뉴스 가져오기 안내.
- Error state: 추천 조회 또는 수집 실패 시 `newsSyncStatus=error`, `newsSyncMessage` 표시. 기존 추천 목록은 제거하지 않음.
- Permission behavior: Bearer token과 `accessToken` cookie가 필요하다.
- Retry or recovery: 최신 뉴스 가져오기 재시도 또는 키워드 등록 후 다시 진입
- Side effects: `refresh=true` 요청은 백엔드의 네이버 뉴스 수집을 트리거한다.
- Related API: `GET /api/news/recommendations`
- Related DB tables: 백엔드 Keyword, NewsArticle

## 추천 뉴스 LLM 요약
- Actor: 로그인 사용자
- Entry point: AI 브리핑 추천 뉴스 카드 `AI 요약`
- Preconditions: 추천 뉴스 목록 조회 성공
- Steps:
  1. 사용자가 뉴스 카드의 `AI 요약` 버튼을 누른다.
  2. `summarizeRecommendedNews(newsId)`가 `POST /api/news/{newsId}/summary`를 호출한다.
  3. 백엔드가 LLM으로 요약을 생성한다.
  4. 프론트는 응답의 `summary`와 `sources`를 해당 뉴스 카드 내부에 표시한다.
- Validation: 로그인 사용자와 추천 뉴스 ID 필요
- Empty state: 요약 전에는 요약 영역을 표시하지 않음
- Error state: 요약 실패 시 `newsSyncStatus=error`, 실패 메시지 표시
- Permission behavior: Bearer token과 `accessToken` cookie가 필요하다.
- Retry or recovery: 같은 뉴스 카드에서 다시 요약 요청
- Side effects: 백엔드 LLM 요약 호출
- Related API: `POST /api/news/{newsId}/summary`, service 경계에 `POST /api/news/summary` 묶음 요약 계약도 유지
- Related DB tables: 백엔드 NewsArticle, AiSummary

## 추천 뉴스 묶음 요약 및 북마크
- Actor: 로그인 사용자
- Entry point: AI 브리핑 추천 뉴스 패널
- Preconditions: 추천 뉴스 목록 조회 성공
- Steps:
  1. 사용자가 `추천 뉴스 묶음 요약`을 누르면 현재 추천 목록의 뉴스 ID 목록으로 `POST /api/news/summary`를 호출한다.
  2. 프론트는 응답의 `summary`와 `sources`를 추천 뉴스 패널 상단에 표시한다.
  3. 사용자가 뉴스 카드의 `뉴스 저장` 또는 `저장 취소`를 누르면 현재 저장 여부에 따라 `POST /api/news/{newsId}/bookmarks` 또는 `DELETE /api/news/{newsId}/bookmarks`를 호출한다.
  4. 저장 상태 변경 성공 후 `GET /api/news/bookmarks`를 호출해 저장 뉴스 목록을 다시 동기화한다.
- Validation: 로그인 사용자, 추천 뉴스 ID 1개 이상
- Empty state: 추천 뉴스가 없으면 묶음 요약 버튼 비활성화
- Error state: 요약 또는 북마크 API 실패 시 `newsSyncMessage` 또는 `newsDashboardSyncMessage` 표시
- Permission behavior: Bearer token과 `accessToken` cookie가 필요하다.
- Retry or recovery: 같은 버튼을 다시 누르거나 대시보드 새로고침
- Side effects: 백엔드 LLM 요약, 뉴스 북마크 생성/삭제
- Related API: `POST /api/news/summary`, `POST /api/news/{newsId}/bookmarks`, `GET /api/news/bookmarks`, `DELETE /api/news/{newsId}/bookmarks`
- Related DB tables: 백엔드 NewsArticle, AiSummary, NewsBookmark

## 뉴스 대시보드 조회
- Actor: 로그인 사용자
- Entry point: 헤더 `뉴스 대시보드`
- Preconditions: 현재 사용자 조회 성공, 키워드 동기화 완료
- Steps:
  1. `useTrendScopeWorkspace`가 로그인 사용자와 키워드 동기화 완료를 확인한다.
  2. `newsService.fetchNewsDashboard()`가 back-docs 뉴스 대시보드 API 묶음을 호출한다.
  3. 키워드별 브리핑, 키워드 빈도, 트렌드 점수, 오늘의 이슈, 추천 키워드, 일자별 뉴스 수, 뉴스 클러스터, 감성/리스크, 저장 뉴스를 UI view model로 변환한다.
  4. `DashboardSection`은 백엔드 응답 또는 빈 상태만 표시한다.
  5. 사용자가 `대시보드 새로고침`을 누르면 같은 API 묶음을 다시 호출한다.
- Validation: 로그인 사용자 필요
- Empty state: 각 API가 빈 배열을 반환하면 해당 패널에 빈 상태 메시지 표시
- Error state: 하나 이상의 대시보드 API 호출 실패 시 `newsDashboardSyncStatus=error`, `newsDashboardSyncMessage` 표시
- Permission behavior: Bearer token과 `accessToken` cookie가 필요하다.
- Retry or recovery: 대시보드 새로고침 또는 재로그인
- Side effects: `newsDashboard` projection 교체
- Related API: `GET /api/news/keyword-briefings`, `GET /api/news/keyword-frequency`, `GET /api/news/trend-scores`, `GET /api/news/today-issues`, `GET /api/news/suggested-keywords`, `GET /api/news/statistics/daily-counts`, `GET /api/news/clusters`, `GET /api/news/sentiments`, `GET /api/news/bookmarks`
- Related DB tables: 백엔드 Keyword, NewsArticle, TrendAnalysis, NewsBookmark

## AI 브리핑 확인
- Actor: 로그인 사용자
- Entry point: 헤더 `AI 브리핑`
- Preconditions: 현재 사용자 조회 성공
- Steps:
  1. 사용자가 AI 브리핑 탭으로 이동한다.
  2. 백엔드 트렌드 분석 요약 점수를 확인한다.
  3. 백엔드 추천 뉴스 패널에서 내 키워드 기반 기사, 최신 뉴스 수집 버튼, 뉴스별 LLM 요약 버튼, 묶음 요약 버튼, 뉴스 저장 버튼을 확인한다.
- Validation: 없음
- Empty state: 키워드나 추천 뉴스가 없으면 각각의 빈 상태 메시지 표시
- Error state: 뉴스 또는 트렌드 분석 API 실패 메시지 표시
- Permission behavior: AI 브리핑 섹션은 authenticated. 비로그인 접근 시 alert 후 홈으로 돌아간다.
- Retry or recovery: 새로고침, 키워드 등록, 최신 뉴스 가져오기 재시도
- Side effects: active section 변경
- Related API: `GET /api/trend-analysis/summary`, `GET /api/news/recommendations`, `POST /api/news/{newsId}/summary`, `POST /api/news/summary`, `POST/DELETE /api/news/{newsId}/bookmarks`, `GET /api/news/bookmarks`
- Related DB tables: 백엔드 `Keyword`, `TrendAnalysis`, `NewsArticle`, `AiSummary`

## 커뮤니티 게시판 탐색
- Actor: 로그인 사용자
- Entry point: 헤더 `커뮤니티`
- Preconditions: 앱이 클라이언트에서 hydration 완료, 로그인 사용자 확인 완료, 백엔드 게시판 API 접근 가능
- Steps:
  1. `useTrendScopeWorkspace`가 `GET /api/community/categories`로 게시판 카테고리 목록을 조회한다.
  2. `GET /api/posts?page=0&size=20`으로 게시글 첫 페이지를 조회한다.
  3. 사용자가 커뮤니티 탭으로 이동한다.
  4. 전체 또는 백엔드 카테고리 기반 게시판 필터 중 하나를 선택한다.
  5. hook이 `activeCommunityBoardSectionId`를 변경하고 백엔드 게시글 view model을 클라이언트에서 필터링한다.
  6. 선택한 게시판에 맞는 게시글 목록이 표시된다.
- Validation: `CommunityBoardFilterId`에 정의된 값만 사용
- Empty state: 선택 게시판에 게시글이 없으면 목록이 비어 있을 수 있음
- Error state: API 실패 시 `communitySyncStatus=error`, `communitySyncMessage` 표시
- Permission behavior: 커뮤니티 섹션은 authenticated. 비로그인 접근 시 alert 후 홈으로 돌아간다. 게시글 목록 API 자체는 선택 인증이지만 UI 라우팅은 로그인 사용자에게만 허용한다.
- Retry or recovery: 새로고침 또는 전체 필터로 전환
- Side effects: 커뮤니티 게시판 필터 state 변경, 백엔드 게시글 목록 projection 저장
- Related API: `GET /api/community/categories`, `GET /api/posts`
- Related DB tables: 백엔드 posts, users

## 커뮤니티 게시글 작성
- Actor: 사용자
- Entry point: 커뮤니티 `글쓰기` 버튼
- Preconditions: 앱이 클라이언트에서 hydration 완료, 로그인 token 존재
- Steps:
  1. 사용자가 커뮤니티 화면에서 글쓰기 버튼을 누른다.
  2. 로그인 사용자가 아니면 `alert("로그인이 필요한 기능입니다.")`를 표시하고 홈으로 돌아간다.
  3. 로그인 사용자는 `writePost` 섹션으로 이동한다.
  4. 사용자가 게시판, 제목, 내용을 입력한다.
  5. 게시글 등록 submit이 `submitPostDraft()`를 호출한다.
  6. hook이 제목/내용을 검증하고 `POST /api/posts`를 호출한다.
  7. 생성된 게시글 ID로 상세와 댓글을 조회하고, 게시글 목록을 다시 조회한다.
  8. 작성한 게시글 상세 화면으로 이동한다.
- Validation: 제목과 내용은 trim 후 빈 문자열이면 등록하지 않음
- Empty state: 제목/내용이 없으면 등록 버튼 비활성화
- Error state: API 실패 시 `communitySyncStatus=error`, `communitySyncMessage` 표시
- Permission behavior: 글쓰기 섹션은 authenticated. Bearer token과 `accessToken` cookie가 필요하다.
- Retry or recovery: 입력 후 다시 submit
- Side effects: 백엔드 게시글 생성, 게시글 목록/상세 재조회, postDraft 초기화
- Related API: `POST /api/posts`, `GET /api/posts`, `GET /api/posts/{postId}`, `GET /api/posts/{postId}/comments`
- Related DB tables: 백엔드 posts, users

## 커뮤니티 게시글 상세
- Actor: 로그인 사용자
- Entry point: 커뮤니티 게시글 목록
- Preconditions: 백엔드 게시글 목록 조회 성공 또는 생성된 게시글 ID 존재
- Steps:
  1. 게시글 목록에서 row를 클릭한다.
  2. hook이 `activePostId`와 `activeSection=post`를 설정한다.
  3. `GET /api/posts/{postId}`와 `GET /api/posts/{postId}/comments`를 호출한다.
  4. 게시글 상세, 댓글, 조회수, 좋아요 수, 좋아요 여부가 표시된다.
  5. 사용자가 댓글을 입력하면 `POST /api/posts/{postId}/comments`를 호출한 뒤 상세/댓글을 재조회한다.
  6. 사용자가 좋아요를 누르면 `likedByMe`, `likeCount`를 optimistic update하고 `POST /api/posts/{postId}/likes` 또는 `DELETE /api/posts/{postId}/likes`를 호출한다.
  7. 작성자 본인은 게시글 수정 form을 열어 `PATCH /api/posts/{postId}`를 호출하거나 `DELETE /api/posts/{postId}`로 게시글을 삭제할 수 있다.
  8. 작성자 본인은 댓글 수정 form을 열어 `PATCH /api/comments/{commentId}`를 호출하거나 `DELETE /api/comments/{commentId}`로 댓글을 삭제할 수 있다.
  9. `목록으로` 버튼을 누르면 커뮤니티 목록으로 돌아간다.
- Validation: post id 존재, 댓글 내용 trim 후 빈 문자열 제외
- Empty state: 댓글이 없으면 댓글 없음 메시지 표시
- Error state: 상세/댓글/좋아요 API 실패 시 `communitySyncStatus=error`, `communitySyncMessage` 표시
- Permission behavior: 게시글 상세 섹션은 authenticated. 상세/댓글 조회 API는 선택 인증이지만 UI 라우팅은 로그인 사용자에게만 허용하고, 댓글 작성과 좋아요 변경은 Bearer token과 `accessToken` cookie가 필요하다.
- Retry or recovery: 목록으로 이동 후 다시 선택하거나 댓글/좋아요를 다시 시도
- Side effects: active section과 active post state 변경, 상세 조회 시 백엔드 view count 증가, 댓글/좋아요/수정/삭제 백엔드 변경
- Related API: `GET /api/posts/{postId}`, `GET /api/posts/{postId}/comments`, `PATCH /api/posts/{postId}`, `DELETE /api/posts/{postId}`, `POST /api/posts/{postId}/comments`, `PATCH /api/comments/{commentId}`, `DELETE /api/comments/{commentId}`, `POST /api/posts/{postId}/likes`, `DELETE /api/posts/{postId}/likes`
- Related DB tables: 백엔드 posts, comments, likes, users
