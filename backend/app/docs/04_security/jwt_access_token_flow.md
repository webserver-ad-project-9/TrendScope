# TrendPulse JWT Access Token Flow

## 1. ?ㅼ젙

`application.yml`

```yaml
jwt:
  secret: {JWT_SECRET}
  access-token-expiration: 3600000
```

## 2. 援ы쁽 湲곗?

- JWT ?쇱씠釉뚮윭由? `jjwt 0.11.5`
- ?뚭퀬由ъ쬁: HS256
- ?좏겙 醫낅쪟: Access Token only
- Refresh Token: MVP?먯꽌???쒖쇅
- Payload:

```json
{
  "sub": "user-uuid",
  "email": "user@example.com"
}
```

## 3. ?몄쬆 ?먮쫫

```text
Google OAuth 濡쒓렇??
??OAuthSuccessHandler ?ㅽ뻾
??JwtProvider媛 Access Token ?앹꽦
??Frontend callback URL濡?token ?꾨떖
??Frontend localStorage ???
??API ?붿껌 ??Authorization: Bearer {token}
??JwtAuthenticationFilter媛 Bearer ?쒓굅
??JwtProvider媛 ?쒕챸/留뚮즺 寃利?
??userId 異붿텧
??CustomUserDetailsService濡??ъ슜??議고쉶
??SecurityContext ?몄쬆 ???
??/api/users/me ?몄텧 ?깃났
```

## 4. Frontend ????덉떆

```ts
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if (token) {
  localStorage.setItem("accessToken", token);
}
```

## 5. API ?붿껌 ?덉떆

```http
GET /api/users/me HTTP/1.1
Host: localhost:8080
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

?꾨줎???곕룞 ?뚯뒪?몄뿉?쒕뒗 ?꾨옒 static bearer token???ъ슜?????덈떎.

```http
Authorization: Bearer {DEV_STATIC_TOKEN}
```

???좏겙? JWT媛 ?꾨땲??濡쒖뺄 媛쒕컻???고쉶 ?몄쬆 ?좏겙?대떎.

?깃났 ?묐떟:

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Request succeeded",
  "data": {
    "id": "4f4f9a2d-22e3-4b4e-8d01-83f9959dfc71",
    "email": "user@example.com",
    "name": "?띻만??,
    "role": "USER"
  }
}
```

## 6. 二쇱슂 ?대옒???꾩튂

```text
src/main/java/com/trendscope/app/global/security/jwt/JwtProvider.java
src/main/java/com/trendscope/app/global/security/jwt/JwtAuthenticationFilter.java
src/main/java/com/trendscope/app/global/security/jwt/JwtTokenResolver.java
src/main/java/com/trendscope/app/global/security/SecurityConfig.java
src/main/java/com/trendscope/app/global/security/oauth/OAuthSuccessHandler.java
```

