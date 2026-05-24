# 아키텍처 문서 - TrendScope-front

## 요약
AI 기반 뉴스 트렌드 분석 서비스의 프론트엔드다. 현재 구현은 `sample_design.html`을 기준으로 한 Next.js 단일 화면 앱이며, 외부 뉴스/AI API 계약이 확정되지 않아 실제 HTTP 연동은 포함하지 않는다.

## 기본 정보
- 프로젝트 루트: `front-end`
- 앱 루트: `front-end/trend-scope-front`
- 스택: Next.js App Router, React, TypeScript, Tailwind CSS
- 인증 사용: 화면 요소만 존재, 인증 API 연동 없음
- 외부 API 연동: Naver News API/OpenAI API 계약 확정 전이므로 미구현

## 계층 방향
- `app/page.tsx`: 라우팅 단위 화면 조립. 초기 뷰 모델 service를 호출하고 앱 컴포넌트에 전달한다.
- `src/components`: UI 표시와 사용자 이벤트 전달만 담당한다.
- `src/hooks`: 탭 이동, 키워드 편집, 별도 검색 화면 결과 표시, 커뮤니티 게시판 필터, 게시글 작성, 게시글 상세 전환 같은 화면 상태 전이를 담당한다.
- `src/services`: API 계약 전까지 초기 화면 뷰 모델을 제공한다. 외부 API 호출은 수행하지 않는다.
- `src/types`: UI view model과 화면 상태 타입을 정의한다.

## React 흐름
```text
app/page.tsx
  -> src/services/trendDashboardService.ts
  -> src/components/trend-scope/TrendScopeApp.tsx
  -> src/hooks/useTrendScopeWorkspace.ts
  -> src/components/trend-scope/*
```

## 데이터 흐름
- 초기 렌더링 시 `getTrendDashboardSnapshot()`이 참조용 대시보드 데이터를 반환한다.
- `TrendScopeApp`은 초기 데이터를 props로 받아 하위 섹션 컴포넌트에 전달한다.
- 키워드 추가/수정/삭제, 키워드 검색 결과 브리핑, 커뮤니티 게시판 필터, 작성 게시글, 커뮤니티 상세 화면은 `useTrendScopeWorkspace`의 클라이언트 상태로만 관리한다.
- 현재 구현은 서버 저장, API 호출, 인증 토큰 처리, 외부 뉴스 수집을 하지 않는다.

## 인증 흐름
- 헤더에 로그인/시작하기 버튼은 존재하지만 인증 요청을 보내지 않는다.
- 인증 API 계약 확정 후 auth service/store 경계를 추가해야 한다.

## API 흐름
- 공개 API endpoint는 추가하지 않았다.
- 향후 백엔드 계약이 확정되면 UI 컴포넌트가 직접 `fetch`를 호출하지 않고 service 또는 client 경계를 통해 호출해야 한다.

## 저장 흐름
- 현재 키워드, 게시판 필터, 작성 게시글, 게시글 상세 전환은 브라우저 메모리 상태다.
- 새로고침 시 사용자가 추가/수정한 상태는 유지되지 않는다.

## 외부 연동 흐름
- Naver News API, OpenAI API, 백엔드 REST API는 계약 미확정 상태다.
- 연동 시 전용 client/adapter를 만들고 timeout, retry, failure mapping을 문서화해야 한다.

## 아키텍처 결정
| Date | Decision | Reason | Impact |
| --- | --- | --- | --- |
| 2026-05-25 | `sample_design.html`을 Next.js App Router 기반 React 컴포넌트로 분리 | 단일 HTML의 DOM 조작을 React 상태 흐름으로 전환 | `app/page.tsx`, `src/components`, `src/hooks`, `src/services`, `src/types` 구조 생성 |
| 2026-05-25 | 외부 API 호출 없이 로컬 초기 뷰 모델만 제공 | 백엔드/API 계약이 확인되지 않음 | UI는 동작하지만 실제 뉴스 수집/AI 요약/인증 저장은 수행하지 않음 |
| 2026-05-25 | 키워드 검색을 마이페이지에서 별도 화면으로 분리 | 키워드 관리와 검색/분석 탐색 책임을 분리 | `search` 섹션 추가, 검색 완료 후 AI 브리핑과 같은 형식으로 결과 표시 |
| 2026-05-25 | 커뮤니티를 분야별 게시판과 별도 글쓰기 화면으로 분리 | 게시글 목록 탐색과 작성 책임 분리 | 경제/사회/IT/정치/문화/세계 필터, `writePost` 섹션, 클라이언트 작성 게시글 상태 추가 |
