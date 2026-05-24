# 컴포넌트 및 모듈 문서 - TrendScope-front

프로젝트 단위를 어떻게 분리하고 재사용하는지 기록한다.

## 분리 기준
- 공통 단위: `src/components/ui`에 둔다. 특정 도메인 문구나 데이터 구조를 알지 않아야 한다.
- 기능 전용 단위: `src/components/trend-scope`에 둔다. TrendScope 화면 섹션, 헤더, 시각화 컴포넌트가 여기에 속한다.
- Service/Application 단위: `src/services`에 둔다. 현재는 API 계약 전 초기 화면 뷰 모델만 제공한다.
- Repository/Adapter 단위: 아직 없음. 외부 API 계약 확정 후 `client` 또는 `adapter` 경계를 추가한다.
- UI 또는 Presentation 단위: 컴포넌트는 props 기반 렌더링과 이벤트 콜백 호출만 담당한다.

## 현재 주요 컴포넌트
| Component/Module | Path | Responsibility |
| --- | --- | --- |
| `TrendScopeApp` | `src/components/trend-scope/TrendScopeApp.tsx` | 전체 화면 조립과 hook state 배선 |
| `TrendScopeHeader` | `src/components/trend-scope/TrendScopeHeader.tsx` | 브랜드, 주요 탭, 로그인/시작 버튼 표시 |
| `HomeSection` | `src/components/trend-scope/TrendScopeSections.tsx` | 첫 화면, 오늘의 감자, 핵심 지표 표시 |
| `BriefingSection` | `src/components/trend-scope/TrendScopeSections.tsx` | AI 브리핑, 키워드, 뉴스, 차트 표시 |
| `SearchSection` | `src/components/trend-scope/TrendScopeSections.tsx` | 별도 키워드 검색 화면과 검색 결과 브리핑 표시 |
| `MyPageSection` | `src/components/trend-scope/TrendScopeSections.tsx` | 키워드 추가/수정/삭제 UI |
| `CommunitySection` | `src/components/trend-scope/TrendScopeSections.tsx` | 분야별 게시판 필터와 게시글 목록 표시 |
| `WritePostSection` | `src/components/trend-scope/TrendScopeSections.tsx` | 별도 게시글 작성 화면 |
| `PostSection` | `src/components/trend-scope/TrendScopeSections.tsx` | 게시글 상세와 댓글 표시 |
| `BriefingContent` | `src/components/trend-scope/TrendScopeSections.tsx` | 기본 AI 브리핑과 검색 결과 브리핑의 공통 형식 렌더링 |
| `TrendBarChart`, `WordCloud`, `RelatedKeywordMap`, `SignalMapVisual` | `src/components/trend-scope/TrendScopeVisuals.tsx` | 대시보드 시각화 표시 |
| `Button` | `src/components/ui/Button.tsx` | 공통 버튼 스타일과 variant 제공 |

## 계약 규칙
- Props는 `readonly` 기반 명시 타입으로 정의한다.
- 화면 데이터는 `src/types/trend.ts`의 view model 타입을 사용한다.
- API response DTO와 UI view model은 분리해야 한다. 현재 타입은 UI view model이며 API DTO가 아니다.
- 컴포넌트는 `fetch`, 외부 SDK, 인증 토큰 저장소에 직접 접근하지 않는다.

## 상태 소유 경계
- `useTrendScopeWorkspace`: active section, active post, keyword draft, search draft, client-only search briefing result, community board filter, board posts, post draft를 소유한다.
- `TrendScopeApp`: hook 결과를 섹션 컴포넌트에 전달한다.
- 섹션 컴포넌트: 폼 submit과 버튼 클릭을 콜백으로 전달한다.

## 재사용 기준
- 도메인 문구와 TrendScope 전용 레이아웃이 들어간 컴포넌트는 기능 전용 컴포넌트로 유지한다.
- 스타일 variant만 가진 UI는 `src/components/ui`로 이동할 수 있다.
- 두 개 이상의 기능 화면에서 동일한 상호작용 규칙이 반복될 때 hook 분리를 검토한다.
