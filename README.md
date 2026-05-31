# TrendScope

TrendScope는 사용자가 등록한 관심 키워드를 기준으로 뉴스 흐름을 수집하고, 트렌드 점수, 키워드 빈도, 오늘의 이슈, 추천 뉴스, AI 브리핑을 제공하는 뉴스 트렌드 분석 서비스입니다.

프론트엔드는 Next.js 단일 화면 앱으로 구성되어 있고, 백엔드는 Spring Boot REST API로 인증, 키워드, 뉴스 수집/분석, 커뮤니티, LLM 요약 기능을 제공합니다.

배포 사이트: [https://trend-scope-seven.vercel.app/](https://trend-scope-seven.vercel.app/)

> 참고: 백엔드 내부 설정, DB 이름, Docker 컨테이너 이름 일부에는 초기 프로젝트명인 `trendpulse`가 남아 있습니다. 서비스 문서와 사용자-facing 명칭은 `TrendScope`를 기준으로 작성합니다.

## 주요 기능

- Google OAuth 기반 로그인 및 JWT 인증
- 관심 키워드 온보딩, 추가, 조회, 삭제
- Naver News Search API 기반 뉴스 수집
- 내 키워드 기반 추천 뉴스 및 최신 뉴스 갱신
- 키워드별 뉴스 브리핑, 빈도 분석, 트렌드 점수, 오늘의 이슈
- LLM 기반 단일 뉴스 요약 및 여러 뉴스 묶음 요약
- 뉴스 북마크
- 커뮤니티 게시글, 댓글, 좋아요

## LLM 연동 안내

TrendScope 백엔드의 LLM 기능은 Sharon77770(주민재)의 개인 프로젝트인 [local-jarvis/jarvis-infra](https://github.com/local-jarvis/jarvis-infra)를 기반으로 동작하는 로컬 LLM 프록시를 전제로 합니다.

백엔드는 모델 서버를 직접 실행하지 않습니다. 별도로 실행 중인 OpenAI 호환 로컬 LLM 프록시의 `/v1/chat/completions` 엔드포인트를 호출합니다. 현재 뉴스 요약과 키워드 브리핑은 `LocalLlmClient`를 통해 이 로컬 프록시를 사용합니다.

기본 로컬 프록시 주소는 다음과 같습니다.

```text
http://localhost:8000
```

프록시가 실행 중인지 먼저 확인합니다.

```powershell
curl.exe http://localhost:8000/healthz
curl.exe http://localhost:8000/readyz
curl.exe http://localhost:8000/v1/models
```

Docker Compose로 백엔드를 실행할 때는 컨테이너에서 호스트 머신의 프록시에 접근해야 하므로 기본값이 `host.docker.internal:8000`으로 전달됩니다.

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Java 21, Spring Boot 4, Spring MVC, Spring Security, OAuth2 Client, JPA, WebClient |
| Database | MySQL 8 |
| Auth | Google OAuth, JWT, accessToken cookie |
| External API | Naver News Search API |
| LLM | local-jarvis/jarvis-infra 기반 OpenAI 호환 로컬 LLM 프록시 |
| Docs | Swagger UI, OpenAPI JSON, Markdown docs |

## 프로젝트 구조

```text
.
├── README.md
├── backend
│   └── app
│       ├── src/main/java/com/trendscope/app
│       ├── src/main/resources
│       ├── docs
│       ├── docker-compose.yml
│       ├── Dockerfile
│       └── build.gradle.kts
└── front-end
    ├── docs
    └── trend-scope-front
        ├── app
        ├── src
        ├── public
        └── package.json
```

## 사전 준비

- Java 21
- Node.js 20 이상
- Docker Desktop
- MySQL 8 또는 `backend/app/docker-compose.yml`의 MySQL 서비스
- Google OAuth 클라이언트
- Naver Developers 뉴스 검색 API 키
- local-jarvis/jarvis-infra 기반 로컬 LLM 프록시

## 환경 변수 설정

### Backend

```powershell
cd backend\app
Copy-Item .env.example .env
```

주요 환경 변수는 다음과 같습니다.

| 변수 | 설명 | 기본값 |
| --- | --- | --- |
| `SPRING_PROFILES_ACTIVE` | Spring profile | `local` |
| `SERVER_PORT` | 백엔드 포트 | `8080` |
| `MYSQL_HOST` | MySQL host | `localhost` |
| `MYSQL_PORT` | MySQL port | `3306` |
| `MYSQL_DATABASE` | DB 이름 | `trendpulse` |
| `MYSQL_USERNAME` | DB 사용자 | `trendpulse` |
| `MYSQL_PASSWORD` | DB 비밀번호 | `trendpulse` |
| `JWT_SECRET` | JWT 서명 secret | 직접 설정 |
| `JWT_STATIC_TOKEN` | 로컬 개발용 정적 토큰 | 직접 설정 |
| `GOOGLE_CLIENT_ID` | Google OAuth client id | 직접 설정 |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | 직접 설정 |
| `FRONTEND_REDIRECT_URL` | OAuth 성공 후 프론트 콜백 URL | `http://localhost:3000/oauth/callback` |
| `CORS_ALLOWED_ORIGINS` | 허용할 프론트 origin | `http://localhost:3000` |
| `NAVER_CLIENT_ID` | Naver API client id | 직접 설정 |
| `NAVER_CLIENT_SECRET` | Naver API client secret | 직접 설정 |
| `LOCAL_LLM_HOST` | 로컬 LLM 프록시 주소 | `localhost:8000` |
| `LOCAL_LLM_API_KEY` | LLM 프록시 인증 키 | 필요 시 설정 |
| `LOCAL_LLM_MODEL` | 사용할 로컬 모델명 | `gemma-3-4b-it-gguf` |
| `LOCAL_LLM_TIMEOUT_MS` | LLM 요청 timeout | `30000` |

### Frontend

```powershell
cd front-end\trend-scope-front
Copy-Item .env.example .env.local
```

주요 환경 변수는 다음과 같습니다.

| 변수 | 설명 | 기본값 |
| --- | --- | --- |
| `NEXT_PUBLIC_BACKEND_API_BASE_URL` | 백엔드 API base URL | `http://localhost:8080` |
| `NEXT_PUBLIC_ACCESS_TOKEN_STORAGE_KEY` | 브라우저 저장소 token key | `accessToken` |
| `NEXT_PUBLIC_ACCESS_TOKEN_COOKIE_KEY` | accessToken cookie key | `accessToken` |
| `NEXT_PUBLIC_ACCESS_TOKEN_COOKIE_MAX_AGE_SECONDS` | accessToken cookie 만료 초 | `3600` |
| `NEXT_PUBLIC_BACKEND_DEVELOPMENT_ACCESS_TOKEN` | 로컬 개발용 fallback token | 비움 |

`NEXT_PUBLIC_` 접두사가 붙은 값은 브라우저 번들에 포함됩니다. API secret은 이 접두사를 붙이지 마세요.

## 실행 방법

### 1. 로컬 LLM 프록시 실행

`local-jarvis/jarvis-infra` 기반 LLM 프록시를 먼저 실행하고 `http://localhost:8000`에서 OpenAI 호환 API가 응답하는지 확인합니다.

```powershell
curl.exe http://localhost:8000/v1/models
```

### 2. 백엔드와 MySQL 실행

Docker Compose 사용을 권장합니다.

```powershell
cd backend\app
docker compose up --build
```

실행 후 확인 URL:

| 서비스 | URL |
| --- | --- |
| Backend | `http://localhost:8080` |
| Swagger UI | `http://localhost:8080/swagger-ui/index.html` |
| OpenAPI JSON | `http://localhost:8080/v3/api-docs` |
| MySQL | `localhost:3306` |

로컬 `3306` 포트가 이미 사용 중이면 `backend/app/.env`에서 `MYSQL_PORT=3307`처럼 변경한 뒤 다시 실행합니다.

백엔드를 Docker 없이 실행하려면 MySQL을 별도로 띄운 뒤 다음 명령을 사용합니다.

```powershell
cd backend\app
.\gradlew.bat bootRun
```

### 3. 프론트엔드 실행

```powershell
cd front-end\trend-scope-front
npm install
npm run dev
```

브라우저에서 다음 주소로 접속합니다.

```text
http://localhost:3000
```

## 개발용 명령어

### Backend

```powershell
cd backend\app
.\gradlew.bat test
.\gradlew.bat bootRun
```

### Frontend

```powershell
cd front-end\trend-scope-front
npm run lint
npm run build
npm run dev
```

## API 문서

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- 프론트엔드가 소비하는 API 목록: `front-end/docs/api/endpoints.md`
- 프론트엔드 API 상세 스펙: `front-end/docs/api/specification.md`
- 백엔드 Docker 로컬 실행 문서: `backend/app/docs/09_deployment/docker_local_setup.md`

주요 API 그룹:

- `GET /api/auth`: Google OAuth 로그인 시작
- `POST /api/auth/logout`: 로그아웃
- `GET /api/users/me`: 현재 사용자 조회
- `/api/onboarding/keywords`: 온보딩 키워드 관리
- `/api/news/recommendations`: 내 키워드 기반 추천 뉴스
- `/api/news/{newsId}/summary`: 단일 뉴스 LLM 요약
- `/api/news/summary`: 여러 뉴스 묶음 LLM 요약
- `/api/news/keyword-briefings`: 키워드별 당일 뉴스 브리핑
- `/api/news/keyword-frequency`: 키워드 빈도 분석
- `/api/news/trend-scores`: 뉴스 트렌드 점수
- `/api/news/today-issues`: 오늘의 핵심 이슈
- `/api/news/bookmarks`: 뉴스 북마크
- `/api/posts`, `/api/comments`, `/api/posts/{postId}/likes`: 커뮤니티

## 인증 흐름

1. 프론트엔드에서 로그인 버튼을 누르면 백엔드 `GET /api/auth`로 이동합니다.
2. 백엔드는 Google OAuth 인증을 시작합니다.
3. 인증 성공 후 백엔드는 `FRONTEND_REDIRECT_URL`로 JWT access token을 전달합니다.
4. 프론트엔드는 token을 localStorage와 cookie에 저장합니다.
5. 보호 API 호출 시 `Authorization: Bearer {accessToken}` 헤더와 `accessToken` cookie를 함께 사용합니다.

로컬 개발 중 정적 토큰으로 보호 API를 확인하려면 `JWT_STATIC_TOKEN`과 프론트의 `NEXT_PUBLIC_BACKEND_DEVELOPMENT_ACCESS_TOKEN`을 같은 값으로 설정할 수 있습니다.

## 종료

Docker Compose로 띄운 백엔드와 MySQL을 종료합니다.

```powershell
cd backend\app
docker compose down
```

DB 볼륨까지 제거하려면 다음 명령을 사용합니다.

```powershell
docker compose down -v
```
