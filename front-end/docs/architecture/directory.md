# 디렉토리 문서 - TrendScope-front

이 파일은 현재 프로젝트 구조를 설명하는 기준 문서다.

## 현재 구조
| Path | Type | Responsibility | Owner | Notes |
| --- | --- | --- | --- | --- |
| `front-end/.codex` | directory | 저장소 작업 규칙과 사용자 참고자료 | Repository rules | 프로젝트 명세 위치가 아니며 `.codex/ref_docs`는 사용자 참고자료 전용 |
| `front-end/docs` | directory | 프로젝트 명세 문서 | Documentation | API, 아키텍처, 상태, DB 명세 유지 |
| `front-end/trend-scope-front` | directory | Next.js 프론트엔드 앱 | Frontend app | 실제 실행 대상 |
| `front-end/trend-scope-front/app` | directory | App Router route/layout/global style | Route/UI boundary | `page.tsx`는 화면 조립만 담당 |
| `front-end/trend-scope-front/app/page.tsx` | file | 홈 route entry | Route/UI boundary | service에서 초기 뷰 모델을 받아 앱 컴포넌트에 전달 |
| `front-end/trend-scope-front/app/layout.tsx` | file | 루트 HTML, 메타데이터, 전역 CSS import | Route/UI boundary | `lang="ko"`, TrendScope metadata 설정 |
| `front-end/trend-scope-front/app/globals.css` | file | 전역 디자인 토큰과 화면 스타일 | Presentation style | 샘플 디자인을 기반으로 반응형 레이아웃 구현 |
| `front-end/trend-scope-front/src/components/ui` | directory | 공통 UI 컴포넌트 | Shared UI | `Button` 등 재사용 UI |
| `front-end/trend-scope-front/src/components/trend-scope` | directory | TrendScope 기능 전용 컴포넌트 | Feature UI | Header, section, shared briefing, visualization 컴포넌트 |
| `front-end/trend-scope-front/src/hooks` | directory | 화면 상태와 UI 유스케이스 | UI application state | `useTrendScopeWorkspace`가 탭/키워드/검색 브리핑/커뮤니티 게시판/글쓰기/게시글 전환 관리 |
| `front-end/trend-scope-front/src/services` | directory | 좁은 service 경계 | Service/Application | 현재는 API 미연동 초기 뷰 모델 제공만 수행 |
| `front-end/trend-scope-front/src/types` | directory | UI view model 및 상태 타입 | Contract/types | API DTO나 persistence entity가 아님 |
| `front-end/trend-scope-front/public` | directory | 정적 asset | Static assets | Next 기본 asset 유지 |

## 주요 의존성 메모
- `app/page.tsx`는 `src/services`와 `src/components`에만 의존한다.
- `src/components`는 화면 표시와 이벤트 전달을 담당하며 직접 HTTP 호출을 하지 않는다.
- `src/hooks`는 브라우저 상호작용 상태만 다루며 persistence나 외부 API를 다루지 않는다.
- `src/services/trendDashboardService.ts`는 외부 API 호출이 아니라 초기 뷰 모델 공급만 담당한다.
