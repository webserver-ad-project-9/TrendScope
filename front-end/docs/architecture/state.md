# 상태 문서 - TrendScope-front

중요한 상태 모델과 상태 전이를 이 문서에 기록한다.

## 상태 종류
| State | Owner | Source of Truth | Persisted | Notes |
| --- | --- | --- | --- | --- |
| `activeSection` | `useTrendScopeWorkspace` | React state | No | 현재 표시 중인 화면 섹션 |
| `activePostId` | `useTrendScopeWorkspace` | React state | No | 커뮤니티 상세 화면에서 선택된 게시글 ID |
| `activeCommunityBoardSectionId` | `useTrendScopeWorkspace` | React state | No | 커뮤니티 게시판 필터, `all` 또는 분야별 게시판 ID |
| `currentUser` | `useTrendScopeWorkspace` | Backend `GET /api/users/me` | No | 로그인 사용자의 UI view model |
| `authStatus` | `useTrendScopeWorkspace` | React state + auth service result | No | 로그인 확인, 인증됨, 익명, 오류 상태 |
| `authMessage` | `useTrendScopeWorkspace` | React state | No | 인증 실패 메시지 |
| `selectedOnboardingKeywordNames` | `useTrendScopeWorkspace` | React state | Temporary localStorage before OAuth | 최초 로그인 전 사용자가 선택한 관심 키워드명 목록 |
| `onboardingKeywordDraft` | `useTrendScopeWorkspace` | React state | No | 최초 로그인 온보딩 직접 입력 키워드 |
| `pendingOnboardingKeywordNames` | `keywordService` | localStorage `trendscope.pendingOnboardingKeywords` | Until auth bootstrap | OAuth redirect 전 선택값을 보존하고 로그인 후 bulk 생성에 사용 |
| `keywordSyncStatus` | `useTrendScopeWorkspace` | React state + keyword service result | No | 키워드 조회/저장 동기화 상태 |
| `keywordSyncMessage` | `useTrendScopeWorkspace` | React state | No | 키워드 동기화 성공/실패 메시지 |
| `boardPosts` | `useTrendScopeWorkspace` | React state initialized from `TrendDashboardSnapshot` | No | 초기 게시글과 클라이언트에서 작성한 게시글 목록 |
| `postDraft` | `useTrendScopeWorkspace` | React state | No | 별도 글쓰기 화면의 게시판, 말머리, 제목, 내용 |
| `keywords` | `useTrendScopeWorkspace` | Backend keyword list after auth, fallback snapshot before auth | Backend | 로그인 후 백엔드 온보딩 키워드 목록으로 대체 |
| `keywordDraft` | `useTrendScopeWorkspace` | React state | No | 키워드 등록 input 값 |
| `searchDraft` | `useTrendScopeWorkspace` | React state | No | 별도 키워드 검색 화면과 홈 검색 input 값 |
| `searchBriefing` | `useTrendScopeWorkspace` | React state | No | 검색 완료 후 AI 브리핑 형식으로 표시할 클라이언트 결과 |
| `TrendDashboardSnapshot` | `trendDashboardService` | Static view model | No | 샘플 디자인 기반 초기 화면 데이터 |

## Enum 값
| Enum | Value | Meaning | Terminal | Notes |
| --- | --- | --- | --- | --- |
| `TrendScopeSection` | `home` | 첫 화면 | No | 오늘의 감자와 주요 지표 표시 |
| `TrendScopeSection` | `onboarding` | 최초 로그인 키워드 선택 | No | OAuth 시작 전 관심 키워드 토글과 직접 입력 표시 |
| `TrendScopeSection` | `briefing` | AI 브리핑 | No | 요약, 뉴스, 차트 표시 |
| `TrendScopeSection` | `search` | 키워드 검색 | No | 검색 input과 검색 결과 브리핑 표시 |
| `TrendScopeSection` | `mypage` | 마이페이지 | No | 키워드 관리 |
| `TrendScopeSection` | `community` | 커뮤니티 목록 | No | 분야별 게시판 필터와 게시글 목록 |
| `TrendScopeSection` | `writePost` | 게시글 작성 | No | 별도 글쓰기 화면 |
| `TrendScopeSection` | `post` | 게시글 상세 | No | 선택된 게시글과 댓글 표시 |
| `CommunityBoardFilterId` | `all` | 전체 게시판 | No | 모든 분야 게시글 표시 |
| `CommunityBoardSectionId` | `economy` | 경제 게시판 | No | 증시, 기업, 산업 흐름 |
| `CommunityBoardSectionId` | `society` | 사회 게시판 | No | 생활, 정책, 사건 이슈 |
| `CommunityBoardSectionId` | `it` | IT 게시판 | No | AI, 플랫폼, 반도체 기술 |
| `CommunityBoardSectionId` | `politics` | 정치 게시판 | No | 국회, 정당, 선거 이슈 |
| `CommunityBoardSectionId` | `culture` | 문화 게시판 | No | 콘텐츠, 엔터, 라이프스타일 |
| `CommunityBoardSectionId` | `global` | 세계 게시판 | No | 해외 시장과 국제 이슈 |
| `AuthStatus` | `checking` | 로그인 상태 확인 중 | No | 현재 사용자 조회 요청 전/진행 중 |
| `AuthStatus` | `authenticated` | 로그인 사용자 확인됨 | No | `currentUser` 존재 |
| `AuthStatus` | `anonymous` | 저장된 token 없음 | No | 보호 API 호출 전 로그인 필요 |
| `AuthStatus` | `error` | 로그인 상태 확인 실패 | No | 백엔드 오류 또는 인증 오류 |
| `KeywordSyncStatus` | `idle` | 키워드 동기화 대기 | No | 익명 또는 로그아웃 상태 |
| `KeywordSyncStatus` | `loading` | 키워드 목록 조회 중 | No | 로그인 사용자 확인 후 |
| `KeywordSyncStatus` | `saving` | 키워드 생성 요청 중 | No | `POST /api/onboarding/keywords` 진행 중 |
| `KeywordSyncStatus` | `ready` | 백엔드 키워드 반영 완료 | No | 조회/생성 성공 |
| `KeywordSyncStatus` | `error` | 키워드 API 실패 | No | 공통 API 오류 메시지 표시 |

## 상태 전이 규칙
| From | To | Trigger | Validator | Side Effects |
| --- | --- | --- | --- | --- |
| `checking` auth | `authenticated` auth | `GET /api/users/me` 성공 | 저장 token 존재, 백엔드 사용자 응답 | `currentUser` 설정 |
| `checking` auth | `anonymous` auth | 저장 token 없음 | `MISSING_ACCESS_TOKEN` | 키워드는 snapshot fallback 유지 |
| any auth | `anonymous` auth | 로그아웃 | 없음 | `POST /api/auth/logout`, local token/cookie 제거 |
| `authenticated` auth | `ready` keywords | `GET /api/onboarding/keywords` 성공 | 백엔드 응답 DTO 유효 | `keywords`를 백엔드 목록으로 대체 |
| `authenticated` auth + empty keywords | `saving` keywords | pending 온보딩 키워드 존재 | 백엔드 키워드 목록 비어 있음, pending keyword list 존재 | `POST /api/onboarding/keywords/bulk` |
| `saving` keywords | `ready` keywords | 온보딩 bulk 생성 성공 | 백엔드 응답 DTO 유효 | 생성된 keyword view model 반영, pending keyword storage 제거 |
| `ready` 또는 `idle` keywords | `saving` keywords | 키워드 등록 submit | trim 후 빈 문자열 제외 | `POST /api/onboarding/keywords` |
| `saving` keywords | `ready` keywords | 키워드 생성 성공 | 백엔드 응답 DTO 유효 | 생성된 keyword view model 추가 |
| `saving` keywords | `error` keywords | 키워드 생성 실패 | API error mapping | `keywordSyncMessage` 설정 |
| any section | `home`, `onboarding`, `briefing`, `search`, `mypage`, `community`, `writePost` | 헤더 nav 또는 버튼 클릭 | section enum 값 | `activePostId` 초기화, window scroll top |
| `onboarding` selected keywords | selected keywords +/- keyword | 추천 키워드 토글 또는 직접 입력 추가 | trim 후 빈 문자열 제외, 중복 제외 | React state 갱신 |
| `community` | `post` | 게시글 row 클릭 | post id 존재 여부 | `activePostId` 설정, window scroll top |
| `post` | `community` | 목록으로 버튼 클릭 | 없음 | `activePostId` 초기화 |
| `community` | `community` | 게시판 필터 클릭 | `CommunityBoardFilterId` | `visibleCommunityPosts` 재계산 |
| `writePost` | `community` | 게시글 등록 submit | 제목/내용 trim 후 빈 문자열 제외 | `boardPosts` 앞에 게시글 추가, 해당 게시판 필터로 이동, draft 초기화 |
| current keywords | keywords + new keyword | 키워드 등록 submit | trim 후 빈 문자열 제외, 인증 token 존재 | 백엔드 생성 후 `keywordDraft` 초기화 |
| `searchBriefing=null` 또는 이전 결과 | new search briefing | 키워드 검색 submit | 빈 문자열이면 기본 키워드 label 사용 | AI 브리핑 형식 결과 설정 |

## 인증 상태
- Token은 React state에 복제하지 않고 `apiClient`가 환경변수로 지정한 브라우저 저장소 key와 cookie key를 읽고 쓴다.
- 최초 온보딩 키워드 선택값은 OAuth redirect 전 `trendscope.pendingOnboardingKeywords` localStorage key에만 임시 저장한다.
- 로그인 후 백엔드 키워드 목록이 비어 있을 때만 pending 선택값을 `POST /api/onboarding/keywords/bulk`로 저장한다. 기존 백엔드 키워드가 있으면 pending 선택값은 폐기한다.
- 보호 API 호출 시 token 소스는 localStorage, `accessToken` 쿠키, 로컬 개발용 token 환경변수 순서로 확인한다. 쿠키나 개발용 token을 사용하면 `apiClient`가 localStorage와 cookie를 다시 동기화한다.
- Role은 `currentUser.role`로 표시 가능한 view model에만 보관하며, 프론트 권한 분기에는 아직 사용하지 않는다.
- Refresh token 또는 자동 갱신 계약은 없다.
- 백엔드 host, 외부 key, 개발용 token은 코드에 하드코딩하지 않는다.
