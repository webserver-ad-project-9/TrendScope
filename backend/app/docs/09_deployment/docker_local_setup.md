# TrendPulse Docker Local Setup

## 1. 사전 준비

백엔드는 로컬 LLM을 직접 실행하지 않는다. 별도로 실행 중인 llama.cpp 기반 LLM 프록시 서버의 OpenAI 호환 API를 호출한다.

기본 프록시 주소는 다음과 같다.

```text
http://localhost:8000
```

프록시 서버가 준비되었는지 확인한다.

```powershell
curl.exe http://localhost:8000/healthz
curl.exe http://localhost:8000/readyz
curl.exe http://localhost:8000/v1/models
```

## 2. 환경 변수

로컬 실행 기본값은 `.env.example`과 `application.yml`에 정의되어 있다.

```env
MYSQL_PORT=3306

LOCAL_LLM_HOST=localhost:8000
LOCAL_LLM_API_KEY=
LOCAL_LLM_MODEL=gemma-3-4b-it-gguf
LOCAL_LLM_TIMEOUT_MS=30000
```

`MYSQL_PORT`는 Docker Compose가 호스트에 공개하는 MySQL 포트다. 예를 들어 로컬 `3306` 포트가 이미 사용 중이면 `.env`에서 다음처럼 바꾼 뒤 Compose를 실행한다.

```env
MYSQL_PORT=3307
```

백엔드 컨테이너는 Compose 내부 네트워크의 `mysql:3306`으로 접속하므로 `docker-compose.yml`의 백엔드 `MYSQL_PORT` 값은 `3306`으로 유지한다.

`LOCAL_LLM_HOST`에는 `localhost:8000` 또는 `http://localhost:8000` 형식을 사용할 수 있다. 인증이 켜진 프록시를 사용하면 `LOCAL_LLM_API_KEY`에 API 키를 넣는다.

Docker Compose로 백엔드를 실행할 때는 컨테이너에서 호스트 머신의 프록시에 접근해야 하므로 기본값이 `host.docker.internal:8000`으로 전달된다. 다른 위치의 프록시를 쓰려면 Compose 실행 전에 `LOCAL_LLM_HOST`를 설정한다.

```powershell
$env:LOCAL_LLM_HOST = "192.168.0.10:8000"
docker compose up --build
```

## 3. 실행

```powershell
cd C:\Users\User\Documents\GitHub\TrendScope\workspace\backend\app
docker compose up --build
```

## 4. 서비스

| Service | URL |
| --- | --- |
| Backend | `http://localhost:8080` |
| Swagger UI | `http://localhost:8080/swagger-ui/index.html` |
| OpenAPI JSON | `http://localhost:8080/v3/api-docs` |
| MySQL | `localhost:${MYSQL_PORT:-3306}` |
| Local LLM Proxy | `http://localhost:8000` |

## 5. MySQL 접속 정보

```text
database: trendpulse
username: trendpulse
password: trendpulse
root password: root
```

## 6. 개발용 인증 테스트

```powershell
curl.exe -i "http://localhost:8080/api/users/me" `
  -H "Authorization: Bearer {DEV_STATIC_TOKEN}" `
  -H "Cookie: accessToken={DEV_STATIC_TOKEN}"
```

## 7. 키워드 생성 테스트

```powershell
$jsonPath = "$env:TEMP\keyword.json"

@'
{
  "name": "AI 반도체"
}
'@ | Set-Content -Path $jsonPath -Encoding utf8

curl.exe -i -X POST "http://localhost:8080/api/onboarding/keywords" `
  -H "Authorization: Bearer {DEV_STATIC_TOKEN}" `
  -H "Cookie: accessToken={DEV_STATIC_TOKEN}" `
  -H "Content-Type: application/json; charset=utf-8" `
  --data-binary "@$jsonPath"
```

## 8. 종료

```powershell
docker compose down
```

볼륨까지 제거하려면 다음 명령을 사용한다.

```powershell
docker compose down -v
```
