# 엔드포인트 목록 - TrendScope-front

이 문서는 프론트엔드가 소비하는 백엔드 API 목록 전용이다. Request/Response 상세는 `specification.md`에 작성한다.

| Method | URL | Auth | 설명 |
| --- | --- | --- | --- |
| GET | `/api/auth` | public | Google OAuth 로그인 시작 |
| POST | `/api/auth/logout` | Bearer token + `accessToken` cookie | 현재 사용자 로그아웃 |
| GET | `/api/users/me` | Bearer token + `accessToken` cookie | 현재 사용자 조회 |
| GET | `/api/onboarding/keywords` | Bearer token + `accessToken` cookie | 내 온보딩 키워드 목록 조회 |
| POST | `/api/onboarding/keywords` | Bearer token + `accessToken` cookie | 내 온보딩 키워드 생성 |
| POST | `/api/onboarding/keywords/bulk` | Bearer token + `accessToken` cookie | 최초 로그인 온보딩 키워드 일괄 생성 |
