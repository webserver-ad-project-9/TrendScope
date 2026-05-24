# 흐름 문서 - TrendScope-front

주요 기능 흐름을 단계별로 기록한다.

## 첫 화면 확인
- Actor: 방문자
- Entry point: `/`
- Preconditions: Next.js 앱 실행
- Steps:
  1. `app/page.tsx`가 `getTrendDashboardSnapshot()`으로 초기 뷰 모델을 가져온다.
  2. `TrendScopeApp`이 헤더, 홈 섹션, 브리핑, 키워드 검색, 마이페이지, 커뮤니티, 게시글 작성, 게시글 상세 섹션을 조립한다.
  3. `activeSection=home` 상태로 오늘의 감자, 지표, 시각화가 표시된다.
- Validation: 없음
- Empty state: 없음
- Error state: 없음
- Permission behavior: public
- Retry or recovery: 새로고침
- Side effects: 없음
- Related API: 클라이언트 hydration 후 저장 token이 있으면 `GET /api/users/me`, `GET /api/onboarding/keywords`
- Related DB tables: 없음

## 로그인 및 사용자 확인
- Actor: 방문자
- Entry point: 헤더 `Google 로그인`
- Preconditions: 백엔드 서버가 실행 중이고 Google OAuth 설정이 완료됨
- Steps:
  1. 사용자가 헤더의 `Google 로그인` 버튼을 누른다.
  2. `authService.startGoogleOAuthLogin()`이 백엔드 `GET /api/auth`로 브라우저를 이동시킨다.
  3. 백엔드 OAuth 성공 후 프론트 `/oauth/callback?token={token}`으로 redirect한다.
  4. `OAuthCallbackClient`가 query token을 auth service에 전달한다.
  5. `apiClient`가 환경변수로 지정한 브라우저 storage key와 cookie key에 token을 저장한다.
  6. 홈으로 이동한 뒤 `useTrendScopeWorkspace`가 현재 사용자와 키워드 목록을 조회한다.
- Validation: token query가 없으면 저장하지 않고 홈으로 복귀
- Empty state: token이 없으면 익명 상태 유지
- Error state: 현재 사용자 조회 실패 시 `authStatus=error`
- Permission behavior: 로그인 전 보호 API는 호출하지 않고 `MISSING_ACCESS_TOKEN`으로 정규화
- Retry or recovery: 다시 Google 로그인 시도
- Side effects: 브라우저 token/cookie 저장
- Related API: `GET /api/auth`, `GET /api/users/me`, `GET /api/onboarding/keywords`
- Related DB tables: 백엔드 User, Keyword

## 로그아웃
- Actor: 로그인 사용자
- Entry point: 헤더 `로그아웃`
- Preconditions: 저장 token 존재
- Steps:
  1. 사용자가 로그아웃 버튼을 누른다.
  2. `logoutCurrentUser()`가 `POST /api/auth/logout`을 호출한다.
  3. 요청 성공/실패와 관계없이 로컬 token과 cookie를 제거한다.
  4. hook이 `currentUser=null`, `authStatus=anonymous`로 전환하고 예시 키워드를 표시한다.
- Validation: 없음
- Empty state: 없음
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
  4. hook이 빈 문자열을 제외하고 keyword service에 생성 요청을 보낸다.
  5. `POST /api/onboarding/keywords` 응답 DTO를 `KeywordViewModel`로 변환해 목록에 반영한다.
- Validation: trim 후 빈 문자열은 추가하지 않음
- Empty state: 백엔드 목록이 비어 있으면 빈 목록 메시지 표시
- Error state: API 실패 시 `keywordSyncStatus=error`, `keywordSyncMessage` 표시
- Permission behavior: token이 없으면 등록하지 않고 로그인 필요 메시지 표시
- Retry or recovery: token 저장 후 다시 등록하거나 새로고침
- Side effects: 백엔드 keyword 생성, 클라이언트 keyword state 갱신
- Related API: `GET /api/onboarding/keywords`, `POST /api/onboarding/keywords`
- Related DB tables: 백엔드 Keyword
- Notes: 키워드 수정/삭제 API는 백엔드 계약에 없어 호출하지 않는다.

## 키워드 검색 브리핑
- Actor: 사용자
- Entry point: 헤더 `키워드 검색` 또는 홈 검색 form
- Preconditions: 앱이 클라이언트에서 hydration 완료
- Steps:
  1. 사용자가 검색 키워드를 입력한다.
  2. submit이 `requestKeywordSearch()`를 호출한다.
  3. hook이 화면 표시용 `searchBriefing`을 설정한다.
  4. 검색 화면에 AI 브리핑과 같은 형식의 요약, 관련 키워드, 차트, 뉴스 목록이 표시된다.
- Validation: 빈 문자열이면 `입력한 키워드` 기본 label 사용
- Empty state: 요청 전에는 검색 안내 카드 표시
- Error state: 없음
- Permission behavior: 현재 인증 미연동
- Retry or recovery: 다른 키워드로 다시 submit
- Side effects: 클라이언트 React state 변경
- Related API: 향후 뉴스 분석 API 필요
- Related DB tables: 향후 `News`, `TrendAnalysis` table 필요

## AI 브리핑 확인
- Actor: 사용자
- Entry point: 헤더 `AI 브리핑`
- Preconditions: 초기 snapshot 존재
- Steps:
  1. 사용자가 AI 브리핑 탭으로 이동한다.
  2. 등록 키워드, 요약, 관련 뉴스, 트렌드 그래프, 워드 클라우드, 관련 키워드가 표시된다.
- Validation: 없음
- Empty state: 현재 초기 snapshot이 항상 존재
- Error state: 없음
- Permission behavior: 현재 인증 미연동
- Retry or recovery: 새로고침
- Side effects: active section 변경
- Related API: 향후 뉴스/분석 조회 API 필요
- Related DB tables: 향후 `Keyword`, `News`, `TrendAnalysis` table 필요

## 커뮤니티 게시판 탐색
- Actor: 사용자
- Entry point: 헤더 `커뮤니티`
- Preconditions: 초기 board post snapshot 존재
- Steps:
  1. 사용자가 커뮤니티 탭으로 이동한다.
  2. 전체, 경제, 사회, IT, 정치, 문화, 세계 게시판 필터 중 하나를 선택한다.
  3. hook이 `activeCommunityBoardSectionId`를 변경한다.
  4. 선택한 게시판에 맞는 게시글 목록이 표시된다.
- Validation: `CommunityBoardFilterId`에 정의된 값만 사용
- Empty state: 선택 게시판에 게시글이 없으면 목록이 비어 있을 수 있음
- Error state: 없음
- Permission behavior: 현재 인증 미연동
- Retry or recovery: 전체 필터로 전환
- Side effects: 커뮤니티 게시판 필터 state 변경
- Related API: 향후 커뮤니티 게시판 목록 API 필요
- Related DB tables: 향후 community board/post/comment table 필요

## 커뮤니티 게시글 작성
- Actor: 사용자
- Entry point: 커뮤니티 `글쓰기` 버튼
- Preconditions: 앱이 클라이언트에서 hydration 완료
- Steps:
  1. 사용자가 커뮤니티 화면에서 글쓰기 버튼을 누른다.
  2. `writePost` 섹션으로 이동한다.
  3. 사용자가 게시판, 말머리, 제목, 내용을 입력한다.
  4. 게시글 등록 submit이 `submitPostDraft()`를 호출한다.
  5. hook이 제목/내용을 검증하고 클라이언트 `boardPosts` 앞에 새 게시글을 추가한다.
  6. 작성한 게시글의 게시판 필터가 선택된 커뮤니티 목록으로 이동한다.
- Validation: 제목과 내용은 trim 후 빈 문자열이면 등록하지 않음
- Empty state: 제목/내용이 없으면 등록 버튼 비활성화
- Error state: 없음
- Permission behavior: 현재 인증 미연동
- Retry or recovery: 입력 후 다시 submit
- Side effects: 클라이언트 boardPosts와 postDraft state 변경
- Related API: 향후 게시글 생성 API 필요
- Related DB tables: 향후 community board/post/comment table 필요

## 커뮤니티 게시글 상세
- Actor: 사용자
- Entry point: 커뮤니티 게시글 목록
- Preconditions: 초기 board post snapshot 또는 클라이언트 작성 게시글 존재
- Steps:
  1. 게시글 목록에서 row를 클릭한다.
  2. hook이 `activePostId`와 `activeSection=post`를 설정한다.
  3. 게시글 상세와 댓글이 표시된다.
  4. `목록으로` 버튼을 누르면 커뮤니티 목록으로 돌아간다.
- Validation: post id가 snapshot에 없으면 빈 상세 fallback 표시
- Empty state: 현재 초기 board post snapshot이 항상 존재하나 필터에 따라 목록이 비어 있을 수 있음
- Error state: 없음
- Permission behavior: 현재 인증 미연동
- Retry or recovery: 목록으로 이동 후 다시 선택
- Side effects: active section과 active post state 변경
- Related API: 향후 커뮤니티 API 필요
- Related DB tables: 향후 community post/comment table 필요
