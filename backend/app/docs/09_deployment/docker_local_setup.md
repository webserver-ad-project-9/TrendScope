# TrendPulse Docker Local Setup

## 1. 실행

```powershell
cd C:\Users\lyw01\Documents\GitHub\TrendScope\backend\app
docker compose up --build
```

## 2. 서비스

| Service | URL |
| --- | --- |
| Backend | `http://localhost:8080` |
| Swagger UI | `http://localhost:8080/swagger-ui/index.html` |
| OpenAPI JSON | `http://localhost:8080/v3/api-docs` |
| MySQL | `localhost:3306` |

## 3. MySQL 접속 정보

```text
database: trendpulse
username: trendpulse
password: trendpulse
root password: root
```

## 4. 개발용 인증 테스트

```powershell
curl.exe -i "http://localhost:8080/api/users/me" `
  -H "Authorization: Bearer mjyw123123123" `
  -H "Cookie: accessToken=mjyw123123123"
```

## 5. 키워드 생성 테스트

```powershell
$jsonPath = "$env:TEMP\keyword.json"

@'
{
  "name": "AI 반도체"
}
'@ | Set-Content -Path $jsonPath -Encoding utf8

curl.exe -i -X POST "http://localhost:8080/api/onboarding/keywords" `
  -H "Authorization: Bearer mjyw123123123" `
  -H "Cookie: accessToken=mjyw123123123" `
  -H "Content-Type: application/json; charset=utf-8" `
  --data-binary "@$jsonPath"
```

## 6. 종료

```powershell
docker compose down
```

볼륨까지 삭제하려면:

```powershell
docker compose down -v
```
