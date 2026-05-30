# 컴포넌트 및 모듈 문서 - TrendScope-front

프로젝트 단위를 어떻게 분리하고 재사용하는지 기록한다.

## 분리 기준
- 공통 단위: `src/components/ui`에 둔다. 특정 도메인 문구나 데이터 구조를 알지 않아야 한다.
- 기능 전용 단위: `src/components/trend-scope`에 둔다. TrendScope 화면 섹션과 헤더가 여기에 속한다.
- Service/Application 단위: `src/services`에 둔다. 백엔드 Auth/User/Keyword/News/TrendAnalysis/Community API use-case, OAuth signup hint, 신규 가입 온보딩 키워드 bulk 생성 use-case를 제공한다.
- Repository/Adapter 단위: `apiClient.ts`가 현재 백엔드 REST API adapter 역할을 담당한다.
- UI 또는 Presentation 단위: 컴포넌트는 props 기반 렌더링과 이벤트 콜백 호출만 담당한다.

## 현재 주요 컴포넌트
| Component/Module | Path | Responsibility |
| --- | --- | --- |
| `TrendScopeApp` | `src/components/trend-scope/TrendScopeApp.tsx` | 전체 화면 조립과 hook state 배선 |
| `TrendScopeHeader` | `src/components/trend-scope/TrendScopeHeader.tsx` | 브랜드, 주요 탭, 로그인/시작 버튼 표시와 섹션 이동 이벤트 전달 |
| `OAuthCallbackClient` | `src/components/auth/OAuthCallbackClient.tsx` | OAuth callback query token을 저장하고 홈으로 이동 |
| `HomeSection` | `src/components/trend-scope/TrendScopeSections.tsx` | public 첫 화면 표시. 로그인 전 안내 문구와 로그인 후 기존 뉴스 대시보드 키워드별 브리핑 projection 표시 |
| `OnboardingSection` | `src/components/trend-scope/TrendScopeSections.tsx` | 신규 가입 후보의 직접 입력 키워드 선택과 첫 키워드 저장 CTA 표시 |
| `BriefingSection` | `src/components/trend-scope/TrendScopeSections.tsx` | 백엔드 트렌드 분석 요약과 추천 뉴스/요약 패널 표시 |
| `DashboardSection` | `src/components/trend-scope/TrendScopeSections.tsx` | back-docs 뉴스 대시보드/키워드 브리핑/북마크 API 응답 표시 |
| `TrendAnalysisPanel` | `src/components/trend-scope/TrendScopeSections.tsx` | `GET /api/trend-analysis/summary` 결과 표시 |
| `RecommendedNewsPanel` | `src/components/trend-scope/TrendScopeSections.tsx` | `GET /api/news/recommendations` 결과, refresh action, `POST /api/news/summary` 묶음 요약 표시 |
| `RecommendedNewsCard` | `src/components/trend-scope/TrendScopeSections.tsx` | 추천 뉴스 카드, `POST /api/news/{newsId}/summary`, 뉴스 북마크 action 표시 |
| `MyPageSection` | `src/components/trend-scope/TrendScopeSections.tsx` | 로그인 사용자와 온보딩 키워드 조회/등록 UI |
| `CommunitySection` | `src/components/trend-scope/TrendScopeSections.tsx` | 백엔드 게시글 목록의 분야별 필터와 게시글 목록 표시 |
| `WritePostSection` | `src/components/trend-scope/TrendScopeSections.tsx` | 별도 게시글 작성 화면 |
| `PostSection` | `src/components/trend-scope/TrendScopeSections.tsx` | 백엔드 게시글 상세, 댓글, 좋아요, 게시글/댓글 수정 삭제 표시와 이벤트 전달 |
| `Button` | `src/components/ui/Button.tsx` | 공통 버튼 스타일과 variant 제공 |
| `apiClient` | `src/services/apiClient.ts` | 백엔드 Base URL, 인증 header/cookie, 공통 응답/오류 처리 |
| `authService` | `src/services/authService.ts` | Google OAuth 시작, token 저장, 현재 사용자 조회, 로그아웃 |
| `keywordService` | `src/services/keywordService.ts` | 온보딩 키워드 조회/생성/bulk 생성, DTO to view model 변환 |
| `newsService` | `src/services/newsService.ts` | 추천 뉴스 조회, 최신 뉴스 수집 refresh, 단일/묶음 LLM 요약, 키워드 브리핑, 뉴스 대시보드, 북마크 DTO to view model 변환 |
| `trendAnalysisService` | `src/services/trendAnalysisService.ts` | 트렌드 분석 요약 조회, DTO to view model 변환 |
| `communityService` | `src/services/communityService.ts` | 커뮤니티 카테고리/게시글/댓글/좋아요와 게시글/댓글 수정 삭제 API 호출, DTO to view model 변환 |

## 계약 규칙
- Props는 `readonly` 기반 명시 타입으로 정의한다.
- 화면 데이터는 `src/types/trend.ts`의 view model 타입을 사용한다.
- API response DTO와 UI view model은 분리한다. `src/types/api.ts`는 백엔드 DTO, `src/types/trend.ts`와 `src/types/auth.ts`는 UI-facing view model/status다.
- 컴포넌트는 `fetch`, 외부 SDK, 인증 토큰 저장소에 직접 접근하지 않는다.
- OAuth callback client는 query 읽기와 auth service 호출만 담당하고 token 및 signup hint 저장 구현은 service/client 경계에 둔다.

## UI 표시 안정성
- 긴 사용자 이름, 이메일, 뉴스 제목, 원문 링크, 게시글 제목, 댓글 본문은 레이아웃을 밀어내지 않도록 CSS에서 `min-width: 0`, `overflow-wrap`, responsive grid 전환으로 처리한다.
- 헤더 navigation은 좁은 화면에서 가로 스크롤 가능한 탭으로 유지하고, 인증 버튼과 action 버튼은 모바일에서 한 줄 폭 버튼으로 전환한다.
- Dashboard, briefing, community toolbar의 action 버튼은 `section-actions` 래퍼로 묶어 줄바꿈과 정렬을 표시 계층에서만 제어한다.
- 뉴스 대시보드의 최상위 카드 높이는 고정하고, 카드 본문이 넘치면 카드 내부 세로 스크롤로 읽도록 처리한다.
- 홈 오늘의 브리핑 카드도 키워드별 브리핑 목록이 길어지면 카드 내부 목록 스크롤로 읽도록 처리한다.
- 색상과 타이포그래피는 실 서비스형 밝은 운영 UI 기준으로 관리하며, 기능 데이터가 없는 상태에서는 백엔드 응답 없음/빈 목록 상태만 표시한다.

## 상태 소유 경계
- `useTrendScopeWorkspace`: active section, auth state, 보호 섹션 접근 guard, 신규 가입 온보딩 키워드 선택 state, keyword server state projection, news recommendation/summary/dashboard/bookmark server state projection, trend analysis server state projection, active post, keyword draft, community board filter, backend board posts projection, post draft/edit draft, comment draft/edit draft, community sync status를 소유한다.
- `TrendScopeApp`: hook 결과를 섹션 컴포넌트에 전달한다.
- 섹션 컴포넌트: 폼 submit과 버튼 클릭을 콜백으로 전달하며 인증 여부를 직접 판단하지 않는다.

## 재사용 기준
- 도메인 문구와 TrendScope 전용 레이아웃이 들어간 컴포넌트는 기능 전용 컴포넌트로 유지한다.
- 스타일 variant만 가진 UI는 `src/components/ui`로 이동할 수 있다.
- 두 개 이상의 기능 화면에서 동일한 상호작용 규칙이 반복될 때 hook 분리를 검토한다.
