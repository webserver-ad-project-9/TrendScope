# 컴포넌트 및 모듈 문서 - TrendScope-front

프로젝트 단위를 어떻게 분리하고 재사용하는지 기록한다.

## 분리 기준
- 공통 단위: `src/components/ui`에 둔다. 특정 도메인 문구나 데이터 구조를 알지 않아야 한다.
- 기능 전용 단위: `src/components/trend-scope`에 둔다. TrendScope 화면 섹션, 헤더, 시각화 컴포넌트가 여기에 속한다.
- Service/Application 단위: `src/services`에 둔다. 초기 화면 뷰 모델과 백엔드 Auth/User/Keyword API use-case, 최초 온보딩 키워드 임시 저장과 bulk 생성 use-case를 제공한다.
- Repository/Adapter 단위: `apiClient.ts`가 현재 백엔드 REST API adapter 역할을 담당한다.
- UI 또는 Presentation 단위: 컴포넌트는 props 기반 렌더링과 이벤트 콜백 호출만 담당한다.

## 현재 주요 컴포넌트
| Component/Module | Path | Responsibility |
| --- | --- | --- |
| `TrendScopeApp` | `src/components/trend-scope/TrendScopeApp.tsx` | 전체 화면 조립과 hook state 배선 |
| `TrendScopeHeader` | `src/components/trend-scope/TrendScopeHeader.tsx` | 브랜드, 주요 탭, 로그인/시작 버튼 표시 |
| `OAuthCallbackClient` | `src/components/auth/OAuthCallbackClient.tsx` | OAuth callback query token을 저장하고 홈으로 이동 |
| `HomeSection` | `src/components/trend-scope/TrendScopeSections.tsx` | 첫 화면, 오늘의 감자, 핵심 지표 표시 |
| `OnboardingSection` | `src/components/trend-scope/TrendScopeSections.tsx` | 최초 로그인 전 관심 키워드 토글, 직접 입력, Google OAuth 시작 CTA 표시 |
| `BriefingSection` | `src/components/trend-scope/TrendScopeSections.tsx` | AI 브리핑, 키워드, 뉴스, 차트 표시 |
| `SearchSection` | `src/components/trend-scope/TrendScopeSections.tsx` | 별도 키워드 검색 화면과 검색 결과 브리핑 표시 |
| `MyPageSection` | `src/components/trend-scope/TrendScopeSections.tsx` | 로그인 사용자와 온보딩 키워드 조회/등록 UI |
| `CommunitySection` | `src/components/trend-scope/TrendScopeSections.tsx` | 분야별 게시판 필터와 게시글 목록 표시 |
| `WritePostSection` | `src/components/trend-scope/TrendScopeSections.tsx` | 별도 게시글 작성 화면 |
| `PostSection` | `src/components/trend-scope/TrendScopeSections.tsx` | 게시글 상세와 댓글 표시 |
| `BriefingContent` | `src/components/trend-scope/TrendScopeSections.tsx` | 기본 AI 브리핑과 검색 결과 브리핑의 공통 형식 렌더링 |
| `TrendBarChart`, `WordCloud`, `RelatedKeywordMap`, `SignalMapVisual` | `src/components/trend-scope/TrendScopeVisuals.tsx` | 대시보드 시각화 표시 |
| `Button` | `src/components/ui/Button.tsx` | 공통 버튼 스타일과 variant 제공 |
| `apiClient` | `src/services/apiClient.ts` | 백엔드 Base URL, 인증 header/cookie, 공통 응답/오류 처리 |
| `authService` | `src/services/authService.ts` | Google OAuth 시작, token 저장, 현재 사용자 조회, 로그아웃 |
| `keywordService` | `src/services/keywordService.ts` | 온보딩 키워드 조회/생성/bulk 생성, 최초 로그인 선택값 임시 저장, DTO to view model 변환 |

## 계약 규칙
- Props는 `readonly` 기반 명시 타입으로 정의한다.
- 화면 데이터는 `src/types/trend.ts`의 view model 타입을 사용한다.
- API response DTO와 UI view model은 분리한다. `src/types/api.ts`는 백엔드 DTO, `src/types/trend.ts`와 `src/types/auth.ts`는 UI-facing view model/status다.
- 컴포넌트는 `fetch`, 외부 SDK, 인증 토큰 저장소에 직접 접근하지 않는다.
- OAuth callback client는 query 읽기와 auth service 호출만 담당하고 token 저장 구현은 service/client 경계에 둔다.

## 상태 소유 경계
- `useTrendScopeWorkspace`: active section, auth state, 최초 온보딩 키워드 선택 state, keyword server state projection, active post, keyword draft, search draft, client-only search briefing result, community board filter, board posts, post draft를 소유한다.
- `TrendScopeApp`: hook 결과를 섹션 컴포넌트에 전달한다.
- 섹션 컴포넌트: 폼 submit과 버튼 클릭을 콜백으로 전달한다.

## 재사용 기준
- 도메인 문구와 TrendScope 전용 레이아웃이 들어간 컴포넌트는 기능 전용 컴포넌트로 유지한다.
- 스타일 variant만 가진 UI는 `src/components/ui`로 이동할 수 있다.
- 두 개 이상의 기능 화면에서 동일한 상호작용 규칙이 반복될 때 hook 분리를 검토한다.
