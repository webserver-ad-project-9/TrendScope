# TrendPulse Docker Local Setup

## 1. ?ㅽ뻾

```powershell
cd C:\Users\lyw01\Documents\GitHub\TrendScope\backend\app
docker compose up --build
```

## 2. ?쒕퉬??
| Service | URL |
| --- | --- |
| Backend | `http://localhost:8080` |
| Swagger UI | `http://localhost:8080/swagger-ui/index.html` |
| OpenAPI JSON | `http://localhost:8080/v3/api-docs` |
| MySQL | `localhost:3306` |

## 3. MySQL ?묒냽 ?뺣낫

```text
database: trendpulse
username: trendpulse
password: trendpulse
root password: root
```

## 4. 媛쒕컻???몄쬆 ?뚯뒪??
```powershell
curl.exe -i "http://localhost:8080/api/users/me" `
  -H "Authorization: Bearer {DEV_STATIC_TOKEN}" `
  -H "Cookie: accessToken={DEV_STATIC_TOKEN}"
```

## 5. ?ㅼ썙???앹꽦 ?뚯뒪??
```powershell
$jsonPath = "$env:TEMP\keyword.json"

@'
{
  "name": "AI 諛섎룄泥?
}
'@ | Set-Content -Path $jsonPath -Encoding utf8

curl.exe -i -X POST "http://localhost:8080/api/onboarding/keywords" `
  -H "Authorization: Bearer {DEV_STATIC_TOKEN}" `
  -H "Cookie: accessToken={DEV_STATIC_TOKEN}" `
  -H "Content-Type: application/json; charset=utf-8" `
  --data-binary "@$jsonPath"
```

## 6. 醫낅즺

```powershell
docker compose down
```

蹂쇰ⅷ源뚯? ??젣?섎젮硫?

```powershell
docker compose down -v
```

