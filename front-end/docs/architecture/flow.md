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
- Related API: 없음
- Related DB tables: 없음

## 키워드 관리
- Actor: 사용자
- Entry point: 헤더 `마이페이지`
- Preconditions: 앱이 클라이언트에서 hydration 완료
- Steps:
  1. 사용자가 새 키워드를 입력한다.
  2. 등록 submit이 `useTrendScopeWorkspace.addKeyword()`를 호출한다.
  3. hook이 빈 문자열을 제외하고 `keywords` 상태에 새 항목을 추가한다.
  4. 수정 버튼은 prompt로 새 label을 받아 해당 keyword를 갱신한다.
  5. 삭제 버튼은 해당 keyword를 클라이언트 상태에서 제거한다.
- Validation: trim 후 빈 문자열은 추가/수정하지 않음
- Empty state: 모든 키워드 삭제 시 목록이 비어 있을 수 있음
- Error state: 없음
- Permission behavior: 현재 인증 미연동이므로 public UI state
- Retry or recovery: 새로고침 시 초기 keyword snapshot으로 복구
- Side effects: 클라이언트 React state 변경
- Related API: 향후 `keywords` API 필요
- Related DB tables: 향후 `Keyword` table 필요

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
