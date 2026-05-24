# TrendPulse JWT Access Token Flow

## 1. 설정

`application.yml`

```yaml
jwt:
  secret: mjyw123123
  access-token-expiration: 3600000
```

## 2. 구현 기준

- JWT 라이브러리: `jjwt 0.11.5`
- 알고리즘: HS256
- 토큰 종류: Access Token only
- Refresh Token: MVP에서는 제외
- Payload:

```json
{
  "sub": "user-uuid",
  "email": "user@example.com"
}
```

## 3. 인증 흐름

```text
Google OAuth 로그인
→ OAuthSuccessHandler 실행
→ JwtProvider가 Access Token 생성
→ Frontend callback URL로 token 전달
→ Frontend localStorage 저장
→ API 요청 시 Authorization: Bearer {token}
→ JwtAuthenticationFilter가 Bearer 제거
→ JwtProvider가 서명/만료 검증
→ userId 추출
→ CustomUserDetailsService로 사용자 조회
→ SecurityContext 인증 저장
→ /api/users/me 호출 성공
```

## 4. Frontend 저장 예시

```ts
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if (token) {
  localStorage.setItem("accessToken", token);
}
```

## 5. API 요청 예시

```http
GET /api/users/me HTTP/1.1
Host: localhost:8080
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

성공 응답:

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Request succeeded",
  "data": {
    "id": "4f4f9a2d-22e3-4b4e-8d01-83f9959dfc71",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "USER"
  }
}
```

## 6. 주요 클래스 위치

```text
src/main/java/com/trendscope/app/global/security/jwt/JwtProvider.java
src/main/java/com/trendscope/app/global/security/jwt/JwtAuthenticationFilter.java
src/main/java/com/trendscope/app/global/security/jwt/JwtTokenResolver.java
src/main/java/com/trendscope/app/global/security/SecurityConfig.java
src/main/java/com/trendscope/app/global/security/oauth/OAuthSuccessHandler.java
```
