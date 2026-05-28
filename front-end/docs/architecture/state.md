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
| `selectedOnboardingKeywordNames` | `useTrendScopeWorkspace` | React state | No | 신규 가입 후보 사용자가 직접 입력해 선택한 관심 키워드명 목록 |
| `onboardingKeywordDraft` | `useTrendScopeWorkspace` | React state | No | 신규 가입 온보딩 직접 입력 키워드 |
| `oauthSignupHint` | `authService` | OAuth callback query | sessionStorage until auth bootstrap | OAuth 직후 온보딩 표시 여부를 판단하는 1회성 hint |
| `keywords` | `useTrendScopeWorkspace` | Backend `GET /api/onboarding/keywords` | Backend | 로그인 사용자의 온보딩 키워드 목록 |
| `keywordDraft` | `useTrendScopeWorkspace` | React state | No | 키워드 등록 input 값 |
| `keywordSyncStatus` | `useTrendScopeWorkspace` | React state + keyword service result | No | 키워드 조회/저장 동기화 상태 |
| `keywordSyncMessage` | `useTrendScopeWorkspace` | React state | No | 키워드 동기화 성공/실패 메시지 |
| `newsRecommendation` | `useTrendScopeWorkspace` | Backend `GET /api/news/recommendations` | Backend | 로그인 사용자의 키워드 기반 추천 뉴스 projection |
| `newsSummariesByArticleId` | `useTrendScopeWorkspace` | Backend `POST /api/news/{newsId}/summary` | Backend | 뉴스 카드별 LLM 요약 결과 |
| `newsSyncStatus` | `useTrendScopeWorkspace` | React state + news service result | No | 추천 뉴스 조회/수집/요약 동기화 상태 |
| `newsSyncMessage` | `useTrendScopeWorkspace` | React state | No | 뉴스 API 성공/실패 메시지 |
| `summarizingNewsId` | `useTrendScopeWorkspace` | React state | No | 현재 요약 요청 중인 뉴스 ID |
| `trendAnalysisSummary` | `useTrendScopeWorkspace` | Backend `GET /api/trend-analysis/summary` | Backend | 백엔드가 집계한 평균 트렌드 점수 projection |
| `trendAnalysisSyncStatus` | `useTrendScopeWorkspace` | React state + trend analysis service result | No | 트렌드 분석 요약 조회 상태 |
| `trendAnalysisSyncMessage` | `useTrendScopeWorkspace` | React state | No | 트렌드 분석 API 성공/실패 메시지 |
| `communityBoardSections` | `useTrendScopeWorkspace` | Backend `GET /api/community/categories` | Backend | 게시판 카테고리 UI view model |
| `boardPosts` | `useTrendScopeWorkspace` | Backend `GET /api/posts` | Backend | 게시글 목록의 UI view model projection |
| `activePost` | `useTrendScopeWorkspace` | Backend `GET /api/posts/{postId}` + `GET /api/posts/{postId}/comments` | Backend | 상세 화면에 표시할 게시글과 댓글 |
| `communitySyncStatus` | `useTrendScopeWorkspace` | React state + community service result | No | 커뮤니티 API 조회/저장 동기화 상태 |
| `communitySyncMessage` | `useTrendScopeWorkspace` | React state | No | 커뮤니티 API 성공/실패 메시지 |
| `postDraft` | `useTrendScopeWorkspace` | React state | No | 별도 글쓰기 화면의 게시판, 제목, 내용 |
| `postCommentDraft` | `useTrendScopeWorkspace` | React state | No | 게시글 상세 화면의 댓글 입력값 |

## Enum 값
| Enum | Value | Meaning | Terminal | Notes |
| --- | --- | --- | --- | --- |
| `TrendScopeSection` | `home` | 첫 화면 | No | public 진입 화면 |
| `TrendScopeSection` | `onboarding` | 신규 가입 키워드 선택 | No | OAuth 완료 후 신규 가입 후보에게 직접 입력 키워드 선택 표시 |
| `TrendScopeSection` | `briefing` | AI 브리핑 | No | 로그인 사용자만 접근, 트렌드 분석 요약과 추천 뉴스 표시 |
| `TrendScopeSection` | `mypage` | 마이페이지 | No | 로그인 사용자만 접근, 키워드 관리 |
| `TrendScopeSection` | `community` | 커뮤니티 목록 | No | 로그인 사용자만 접근, 분야별 게시판 필터와 게시글 목록 |
| `TrendScopeSection` | `writePost` | 게시글 작성 | No | 로그인 사용자만 접근, 별도 글쓰기 화면 |
| `TrendScopeSection` | `post` | 게시글 상세 | No | 로그인 사용자만 접근, 선택된 게시글과 댓글 표시 |
| `CommunityBoardFilterId` | `all` | 전체 게시판 | No | 모든 분야 게시글 표시 |
| `CommunityBoardSectionId` | `politics` | 정치 게시판 | No | 백엔드 `POLITICS`와 매핑 |
| `CommunityBoardSectionId` | `economy` | 경제 게시판 | No | 백엔드 `ECONOMY`와 매핑 |
| `CommunityBoardSectionId` | `society` | 사회 게시판 | No | 백엔드 `SOCIETY`와 매핑 |
| `CommunityBoardSectionId` | `it` | IT/과학 게시판 | No | 백엔드 `IT_SCIENCE`와 매핑 |
| `CommunityBoardSectionId` | `global` | 세계 게시판 | No | 백엔드 `WORLD`와 매핑 |
| `CommunityBoardSectionId` | `sports` | 스포츠 게시판 | No | 백엔드 `SPORTS`와 매핑 |
| `CommunityBoardSectionId` | `entertainment` | 연예 게시판 | No | 백엔드 `ENTERTAINMENT`와 매핑 |
| `AuthStatus` | `checking` | 로그인 상태 확인 중 | No | 현재 사용자 조회 요청 전/진행 중 |
| `AuthStatus` | `authenticated` | 로그인 사용자 확인됨 | No | `currentUser` 존재 |
| `AuthStatus` | `anonymous` | 저장된 token 없음 | No | 보호 API 호출 전 로그인 필요 |
| `AuthStatus` | `error` | 로그인 상태 확인 실패 | No | 백엔드 오류 또는 인증 오류 |
| `KeywordSyncStatus` | `idle` | 키워드 동기화 대기 | No | 익명 또는 로그아웃 상태 |
| `KeywordSyncStatus` | `loading` | 키워드 목록 조회 중 | No | 로그인 사용자 확인 후 |
| `KeywordSyncStatus` | `saving` | 키워드 생성 요청 중 | No | 키워드 생성 또는 bulk 생성 진행 중 |
| `KeywordSyncStatus` | `ready` | 백엔드 키워드 반영 완료 | No | 조회/생성 성공 |
| `KeywordSyncStatus` | `error` | 키워드 API 실패 | No | 공통 API 오류 메시지 표시 |
| `NewsSyncStatus` | `idle` | 추천 뉴스 동기화 대기 | No | 익명 상태 또는 키워드 없음 |
| `NewsSyncStatus` | `loading` | 추천 뉴스 조회 중 | No | `GET /api/news/recommendations?refresh=false` 진행 중 |
| `NewsSyncStatus` | `refreshing` | 최신 뉴스 수집 중 | No | `GET /api/news/recommendations?refresh=true` 진행 중 |
| `NewsSyncStatus` | `summarizing` | 뉴스 요약 생성 중 | No | `POST /api/news/{newsId}/summary` 진행 중 |
| `NewsSyncStatus` | `ready` | 뉴스 API 반영 완료 | No | 추천 조회/수집/요약 성공 |
| `NewsSyncStatus` | `error` | 뉴스 API 실패 | No | 공통 API 오류 메시지 표시 |
| `TrendAnalysisSyncStatus` | `idle` | 트렌드 분석 대기 | No | 익명 상태 |
| `TrendAnalysisSyncStatus` | `loading` | 트렌드 분석 조회 중 | No | `GET /api/trend-analysis/summary` 진행 중 |
| `TrendAnalysisSyncStatus` | `ready` | 트렌드 분석 반영 완료 | No | 조회 성공 |
| `TrendAnalysisSyncStatus` | `error` | 트렌드 분석 API 실패 | No | 공통 API 오류 메시지 표시 |
| `CommunitySyncStatus` | `idle` | 커뮤니티 동기화 대기 | No | 초기 상태 |
| `CommunitySyncStatus` | `loading` | 커뮤니티 API 조회 중 | No | 카테고리, 목록, 상세 조회 진행 중 |
| `CommunitySyncStatus` | `saving` | 커뮤니티 API 저장 중 | No | 게시글/댓글/좋아요 변경 요청 진행 중 |
| `CommunitySyncStatus` | `ready` | 커뮤니티 API 반영 완료 | No | 조회/저장 성공 |
| `CommunitySyncStatus` | `error` | 커뮤니티 API 실패 | No | 공통 API 오류 메시지 표시 |

## 상태 전이 규칙
| From | To | Trigger | Validator | Side Effects |
| --- | --- | --- | --- | --- |
| `checking` auth | `authenticated` auth | `GET /api/users/me` 성공 | 저장 token 존재, 백엔드 사용자 응답 | `currentUser` 설정 |
| `checking` auth | `anonymous` auth | 저장 token 없음 | `MISSING_ACCESS_TOKEN` | 백엔드 기반 보호 상태를 비움 |
| any auth | `anonymous` auth + `home` section | 로그아웃 | 없음 | `POST /api/auth/logout`, local token/cookie 제거, active post와 백엔드 기반 상태 초기화 |
| `authenticated` auth | `ready` keywords | `GET /api/onboarding/keywords` 성공 | 백엔드 응답 DTO 유효 | `keywords`를 백엔드 목록으로 대체 |
| `authenticated` auth + empty keywords | `onboarding` section | OAuth callback 직후 signup hint가 `signup` 또는 `unknown` | 백엔드 키워드 목록 비어 있음 | 신규 가입 키워드 온보딩 표시 |
| `onboarding` section | `saving` keywords | 온보딩 키워드 저장 submit | 로그인 사용자, 선택 키워드 존재 | `POST /api/onboarding/keywords/bulk` |
| `saving` keywords | `ready` keywords | 온보딩 bulk 생성 성공 | 백엔드 응답 DTO 유효 | 생성된 keyword view model 반영, 홈으로 이동 |
| `ready` 또는 `idle` keywords | `saving` keywords | 키워드 등록 submit | trim 후 빈 문자열 제외 | `POST /api/onboarding/keywords` |
| `saving` keywords | `ready` keywords | 키워드 생성 성공 | 백엔드 응답 DTO 유효 | 생성된 keyword view model 추가 |
| `saving` keywords | `error` keywords | 키워드 생성 실패 | API error mapping | `keywordSyncMessage` 설정 |
| `authenticated` auth | `loading` trend analysis | 로그인 사용자 확인 | `currentUser` 존재 | `GET /api/trend-analysis/summary` |
| `loading` trend analysis | `ready` trend analysis | 트렌드 분석 조회 성공 | 백엔드 응답 DTO 유효 | `trendAnalysisSummary` 교체 |
| any trend analysis | `error` trend analysis | 트렌드 분석 조회 실패 | API error mapping | `trendAnalysisSyncMessage` 설정 |
| `authenticated` auth + `ready` keywords | `loading` news | 로그인 사용자와 키워드 존재 | 키워드 1개 이상 | `GET /api/news/recommendations?refresh=false&limit=20` |
| `loading` news | `ready` news | 추천 뉴스 조회 성공 | 백엔드 응답 DTO 유효 | `newsRecommendation` 교체, 기존 요약 초기화 |
| `ready` news | `refreshing` news | 최신 뉴스 가져오기 클릭 | 로그인 사용자, 키워드 1개 이상 | `GET /api/news/recommendations?refresh=true&limit=20` |
| `refreshing` news | `ready` news | 최신 뉴스 수집 성공 | 백엔드 응답 DTO 유효 | 추천 뉴스 목록 교체, 기존 요약 초기화 |
| `ready` news | `summarizing` news | 뉴스 카드 AI 요약 클릭 | 로그인 사용자, news id 존재 | `POST /api/news/{newsId}/summary` |
| `summarizing` news | `ready` news | 요약 성공 | 백엔드 응답 DTO 유효 | `newsSummariesByArticleId[newsId]` 저장 |
| any news | `error` news | 추천/수집/요약 실패 | API error mapping | `newsSyncMessage` 설정, 기존 추천 목록 유지 |
| `idle` community | `loading` community | 앱 진입 | 없음 | `GET /api/community/categories`, `GET /api/posts` |
| `loading` community | `ready` community | 게시글 목록 조회 성공 | 백엔드 page DTO 유효 | `boardPosts`를 백엔드 목록으로 대체 |
| `loading` community | `error` community | 커뮤니티 조회 실패 | API error mapping | `communitySyncMessage` 설정 |
| any section | `home` | 홈 nav 또는 브랜드 클릭 | section enum 값 | `activePostId`, `activePost` 초기화, window scroll top |
| any section | `briefing`, `mypage`, `community`, `writePost`, `post`, `onboarding` | 헤더 nav 또는 기능 버튼 클릭 | 로그인 사용자 존재 | 필요 시 `activePostId` 초기화, window scroll top |
| any section | `home` | 비로그인 사용자가 보호 섹션 접근 | 로그인 사용자 없음 | `alert("로그인이 필요한 기능입니다.")`, `activePostId`, `activePost` 초기화, window scroll top |
| `onboarding` selected keywords | selected keywords +/- keyword | 직접 입력 추가 또는 선택 chip 클릭 | trim 후 빈 문자열 제외, 중복 제외 | React state 갱신 |
| `community` | `post` | 게시글 row 클릭 | post id 존재 여부 | `activePostId` 설정, `GET /api/posts/{postId}`, `GET /api/posts/{postId}/comments`, window scroll top |
| `post` | `community` | 목록으로 버튼 클릭 | 없음 | `activePostId`, `activePost` 초기화 |
| `community` | `community` | 게시판 필터 클릭 | `CommunityBoardFilterId` | `visibleCommunityPosts` 재계산 |
| `writePost` | `post` | 게시글 등록 submit | 로그인 사용자, 제목/내용 trim 후 빈 문자열 제외 | `POST /api/posts`, `GET /api/posts`, `GET /api/posts/{postId}`, draft 초기화 |
| `post` active post | updated active post | 댓글 등록 submit | 로그인 사용자, 댓글 trim 후 빈 문자열 제외 | `POST /api/posts/{postId}/comments`, 상세/댓글 재조회 |
| `post` active post | liked/unliked active post | 좋아요 버튼 클릭 | 로그인 사용자, active post 존재 | optimistic `likedByMe`/`likeCount` 변경, `POST/DELETE /api/posts/{postId}/likes`, 실패 시 rollback |
| current keywords | keywords + new keyword | 키워드 등록 submit | trim 후 빈 문자열 제외, 인증 token 존재 | 백엔드 생성 후 `keywordDraft` 초기화 |

## 인증 상태
- Token은 React state에 복제하지 않고 `apiClient`가 환경변수로 지정한 브라우저 저장소 key와 cookie key를 읽고 쓴다.
- OAuth callback에서 신규 가입 여부 hint를 sessionStorage에 저장하고 인증 bootstrap에서 한 번만 소비한다.
- 로그인 후 백엔드 키워드 목록이 비어 있고 OAuth signup hint가 `signup` 또는 `unknown`일 때만 온보딩 화면을 자동 표시한다.
- 홈을 제외한 모든 기능 섹션은 로그인 사용자만 접근할 수 있다.
- 비로그인 사용자가 보호 섹션 또는 보호 기능 버튼에 접근하면 `alert("로그인이 필요한 기능입니다.")`를 표시하고 홈으로 돌아간다.
- 보호 API 호출 시 token 소스는 localStorage, `accessToken` 쿠키, 로컬 개발용 token 환경변수 순서로 확인한다. 쿠키나 개발용 token을 사용하면 `apiClient`가 localStorage와 cookie를 다시 동기화한다.
- 선택 인증 커뮤니티 조회 API는 token이 있으면 Bearer header와 cookie를 함께 보내고, token이 없으면 익명 조회로 호출한다.
- 뉴스 추천/수집/요약 API와 트렌드 분석 요약 API는 보호 API이므로 Bearer header와 `accessToken` cookie가 필요하다.
- Role은 `currentUser.role`로 표시 가능한 view model에만 보관하며, 프론트 권한 분기에는 아직 사용하지 않는다.
- Refresh token 또는 자동 갱신 계약은 없다.
- 백엔드 host, 외부 key, 개발용 token은 코드에 하드코딩하지 않는다.
