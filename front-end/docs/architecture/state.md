# 상태 문서 - TrendScope-front

중요한 상태 모델과 상태 전이를 이 문서에 기록한다.

## 상태 종류
| State | Owner | Source of Truth | Persisted | Notes |
| --- | --- | --- | --- | --- |
| `activeSection` | `useTrendScopeWorkspace` | React state | No | 현재 표시 중인 화면 섹션 |
| `activePostId` | `useTrendScopeWorkspace` | React state | No | 커뮤니티 상세 화면에서 선택된 게시글 ID |
| `activeCommunityBoardSectionId` | `useTrendScopeWorkspace` | React state | No | 커뮤니티 게시판 필터, `all` 또는 분야별 게시판 ID |
| `boardPosts` | `useTrendScopeWorkspace` | React state initialized from `TrendDashboardSnapshot` | No | 초기 게시글과 클라이언트에서 작성한 게시글 목록 |
| `postDraft` | `useTrendScopeWorkspace` | React state | No | 별도 글쓰기 화면의 게시판, 말머리, 제목, 내용 |
| `keywords` | `useTrendScopeWorkspace` | React state initialized from `TrendDashboardSnapshot` | No | 사용자가 화면에서 추가/수정/삭제 가능 |
| `keywordDraft` | `useTrendScopeWorkspace` | React state | No | 키워드 등록 input 값 |
| `searchDraft` | `useTrendScopeWorkspace` | React state | No | 별도 키워드 검색 화면과 홈 검색 input 값 |
| `searchBriefing` | `useTrendScopeWorkspace` | React state | No | 검색 완료 후 AI 브리핑 형식으로 표시할 클라이언트 결과 |
| `TrendDashboardSnapshot` | `trendDashboardService` | Static view model | No | 샘플 디자인 기반 초기 화면 데이터 |

## Enum 값
| Enum | Value | Meaning | Terminal | Notes |
| --- | --- | --- | --- | --- |
| `TrendScopeSection` | `home` | 첫 화면 | No | 오늘의 감자와 주요 지표 표시 |
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

## 상태 전이 규칙
| From | To | Trigger | Validator | Side Effects |
| --- | --- | --- | --- | --- |
| any section | `home`, `briefing`, `search`, `mypage`, `community`, `writePost` | 헤더 nav 또는 버튼 클릭 | section enum 값 | `activePostId` 초기화, window scroll top |
| `community` | `post` | 게시글 row 클릭 | post id 존재 여부 | `activePostId` 설정, window scroll top |
| `post` | `community` | 목록으로 버튼 클릭 | 없음 | `activePostId` 초기화 |
| `community` | `community` | 게시판 필터 클릭 | `CommunityBoardFilterId` | `visibleCommunityPosts` 재계산 |
| `writePost` | `community` | 게시글 등록 submit | 제목/내용 trim 후 빈 문자열 제외 | `boardPosts` 앞에 게시글 추가, 해당 게시판 필터로 이동, draft 초기화 |
| current keywords | keywords + new keyword | 키워드 등록 submit | trim 후 빈 문자열 제외 | `keywordDraft` 초기화 |
| current keywords | updated keywords | 수정 버튼 후 prompt confirm | 기존 keyword id 존재, 빈 문자열 제외 | 해당 keyword label 변경 |
| current keywords | filtered keywords | 삭제 버튼 클릭 | keyword id | 해당 keyword 제거 |
| `searchBriefing=null` 또는 이전 결과 | new search briefing | 키워드 검색 submit | 빈 문자열이면 기본 키워드 label 사용 | AI 브리핑 형식 결과 설정 |

## 인증 상태
- 현재 인증 상태, token, role, permission store는 구현하지 않았다.
- 인증 API 계약 확정 후 auth service/store 문서를 추가해야 한다.
