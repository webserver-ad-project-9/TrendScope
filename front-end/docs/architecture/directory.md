# 디렉토리 문서 - TrendScope-front

이 파일은 현재 프로젝트 구조를 설명하는 기준 문서다.

## 현재 구조
| Path | Type | Responsibility | Owner | Notes |
| --- | --- | --- | --- | --- |
| `front-end/.codex` | directory | 저장소 작업 규칙과 사용자 참고자료 | Repository rules | 프로젝트 명세 위치가 아니며 `.codex/ref_docs`는 사용자 참고자료 전용 |
| `front-end/docs` | directory | 프로젝트 명세 문서 | Documentation | API, 아키텍처, 상태, DB 명세 유지 |
| `front-end/trend-scope-front` | directory | Next.js 프론트엔드 앱 | Frontend app | 실제 실행 대상 |
| `front-end/trend-scope-front/.env.example` | file | 환경변수 템플릿 | Configuration | 실제 token/secret 없이 필요한 env key만 문서화 |
| `front-end/trend-scope-front/.env.local` | ignored file | 로컬 환경변수 | Local configuration | Git 추적 제외, 개발자 로컬 값 관리 |
| `front-end/trend-scope-front/app` | directory | App Router route/layout/global style | Route/UI boundary | `page.tsx`는 화면 조립만 담당 |
| `front-end/trend-scope-front/app/page.tsx` | file | 홈 route entry | Route/UI boundary | service에서 초기 뷰 모델을 받아 앱 컴포넌트에 전달 |
| `front-end/trend-scope-front/app/oauth/callback/page.tsx` | file | OAuth 성공 redirect 처리 route | Route/UI boundary | Suspense 경계로 client callback 컴포넌트 렌더링 |
| `front-end/trend-scope-front/app/layout.tsx` | file | 루트 HTML, 메타데이터, 전역 CSS import | Route/UI boundary | `lang="ko"`, TrendScope metadata 설정 |
| `front-end/trend-scope-front/app/globals.css` | file | 전역 디자인 토큰과 화면 스타일 | Presentation style | 샘플 디자인을 기반으로 반응형 레이아웃 구현 |
| `front-end/trend-scope-front/src/components/auth` | directory | 인증 전용 client 컴포넌트 | Feature UI | OAuth callback query 처리 컴포넌트 |
| `front-end/trend-scope-front/src/components/ui` | directory | 공통 UI 컴포넌트 | Shared UI | `Button` 등 재사용 UI |
| `front-end/trend-scope-front/src/components/trend-scope` | directory | TrendScope 기능 전용 컴포넌트 | Feature UI | Header, section, shared briefing, visualization 컴포넌트 |
| `front-end/trend-scope-front/src/config` | directory | 런타임/빌드타임 설정 읽기 | Configuration | Next public env와 server-only env 경계 문서화 |
| `front-end/trend-scope-front/src/config/environment.ts` | file | 환경변수 access module | Configuration | 백엔드 Base URL, token storage/cookie key, 로컬 개발용 token fallback 설정 |
| `front-end/trend-scope-front/src/hooks` | directory | 화면 상태와 UI 유스케이스 | UI application state | `useTrendScopeWorkspace`가 탭/인증/키워드/검색 브리핑/커뮤니티 게시판/글쓰기/게시글 전환 관리 |
| `front-end/trend-scope-front/src/services` | directory | 좁은 service/API client 경계 | Service/Application | 초기 뷰 모델, 백엔드 API client, auth service, keyword service |
| `front-end/trend-scope-front/src/services/apiClient.ts` | file | 백엔드 API 공통 client | External integration | Base URL, Bearer header, cookie 동기화, 공통 오류 매핑 |
| `front-end/trend-scope-front/src/services/authService.ts` | file | 인증 use-case service | Service/Application | Google OAuth 시작, callback token 저장, 현재 사용자 조회, 로그아웃 |
| `front-end/trend-scope-front/src/services/keywordService.ts` | file | 온보딩 키워드 service | Service/Application | 백엔드 키워드 조회/생성 DTO를 UI view model로 변환 |
| `front-end/trend-scope-front/src/types` | directory | UI view model, auth view model, API DTO 타입 | Contract/types | DTO와 UI view model을 파일 단위로 분리 |
| `front-end/trend-scope-front/src/types/api.ts` | file | 백엔드 request/response DTO | Contract/types | API 응답 DTO 전용 |
| `front-end/trend-scope-front/src/types/auth.ts` | file | 인증 UI view model 및 상태 타입 | Contract/types | auth state와 current user view model |
| `front-end/trend-scope-front/public` | directory | 정적 asset | Static assets | Next 기본 asset 유지 |

## 주요 의존성 메모
- `app/page.tsx`는 `src/services`와 `src/components`에만 의존한다.
- `src/components`는 화면 표시와 이벤트 전달을 담당하며 직접 HTTP 호출을 하지 않는다.
- `src/hooks`는 브라우저 상호작용 상태와 service 호출 orchestration을 담당한다.
- `src/services/trendDashboardService.ts`는 외부 API 호출이 아니라 초기 뷰 모델 공급만 담당한다.
- `src/services/apiClient.ts`만 백엔드 HTTP 세부사항을 직접 다룬다.
- `.env.local`은 Git에 커밋하지 않고, 새 환경변수는 `.env.example`에 실제 token/secret 없이 추가한다.
