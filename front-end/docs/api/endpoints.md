# 엔드포인트 목록 - TrendScope-front

이 문서는 프론트엔드가 소비하는 백엔드 API 목록 전용이다. Request/Response 상세는 `specification.md`에 작성한다.

| Method | URL | Auth | 설명 |
| --- | --- | --- | --- |
| GET | `/api/auth` | public | Google OAuth 로그인 시작 |
| POST | `/api/auth/logout` | Bearer token + `accessToken` cookie | 현재 사용자 로그아웃 |
| GET | `/api/users/me` | Bearer token + `accessToken` cookie | 현재 사용자 조회 |
| GET | `/api/onboarding/keywords` | Bearer token + `accessToken` cookie | 내 온보딩 키워드 목록 조회 |
| POST | `/api/onboarding/keywords` | Bearer token + `accessToken` cookie | 내 온보딩 키워드 생성 |
| POST | `/api/onboarding/keywords/bulk` | Bearer token + `accessToken` cookie | 신규 가입 온보딩 키워드 일괄 생성 |
| GET | `/api/news/recommendations` | Bearer token + `accessToken` cookie | 내 키워드 기반 추천 뉴스 조회 및 선택적 최신 뉴스 수집 |
| POST | `/api/news/{newsId}/summary` | Bearer token + `accessToken` cookie | 단일 뉴스 LLM 요약 생성 |
| POST | `/api/news/summary` | Bearer token + `accessToken` cookie | 여러 뉴스 LLM 묶음 요약 생성 |
| GET | `/api/news/keyword-briefings` | Bearer token + `accessToken` cookie | 키워드별 당일 뉴스 브리핑 조회 |
| GET | `/api/news/keyword-frequency` | Bearer token + `accessToken` cookie | 내 키워드 기반 뉴스 빈도 키워드 조회 |
| GET | `/api/news/trend-scores` | Bearer token + `accessToken` cookie | 키워드별 뉴스 트렌드 점수 조회 |
| GET | `/api/news/today-issues` | Bearer token + `accessToken` cookie | 오늘의 핵심 이슈 목록 조회 |
| GET | `/api/news/suggested-keywords` | Bearer token + `accessToken` cookie | 뉴스 기반 추천 키워드 조회 |
| GET | `/api/news/statistics/daily-counts` | Bearer token + `accessToken` cookie | 일자별 뉴스 수 조회 |
| GET | `/api/news/clusters` | Bearer token + `accessToken` cookie | 뉴스 클러스터 목록 조회 |
| GET | `/api/news/sentiments` | Bearer token + `accessToken` cookie | 키워드별 뉴스 감성/리스크 조회 |
| POST | `/api/news/{newsId}/bookmarks` | Bearer token + `accessToken` cookie | 뉴스 북마크 생성 |
| GET | `/api/news/bookmarks` | Bearer token + `accessToken` cookie | 내 뉴스 북마크 목록 조회 |
| DELETE | `/api/news/{newsId}/bookmarks` | Bearer token + `accessToken` cookie | 뉴스 북마크 삭제 |
| GET | `/api/trend-analysis/summary` | Bearer token + `accessToken` cookie | 백엔드 트렌드 분석 요약 조회 |
| GET | `/api/community/categories` | public | 게시판 카테고리 목록 조회 |
| GET | `/api/posts` | optional Bearer token + `accessToken` cookie | 게시글 목록 조회 |
| POST | `/api/posts` | Bearer token + `accessToken` cookie | 게시글 생성 |
| GET | `/api/posts/{postId}` | optional Bearer token + `accessToken` cookie | 게시글 상세 조회 |
| PATCH | `/api/posts/{postId}` | Bearer token + `accessToken` cookie | 게시글 수정 |
| DELETE | `/api/posts/{postId}` | Bearer token + `accessToken` cookie | 게시글 삭제 |
| GET | `/api/posts/{postId}/comments` | optional Bearer token + `accessToken` cookie | 게시글 댓글 목록 조회 |
| POST | `/api/posts/{postId}/comments` | Bearer token + `accessToken` cookie | 게시글 댓글 생성 |
| PATCH | `/api/comments/{commentId}` | Bearer token + `accessToken` cookie | 댓글 수정 |
| DELETE | `/api/comments/{commentId}` | Bearer token + `accessToken` cookie | 댓글 삭제 |
| POST | `/api/posts/{postId}/likes` | Bearer token + `accessToken` cookie | 게시글 좋아요 생성 |
| DELETE | `/api/posts/{postId}/likes` | Bearer token + `accessToken` cookie | 게시글 좋아요 취소 |
