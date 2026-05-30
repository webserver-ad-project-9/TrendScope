# TrendPulse Swagger/OpenAPI Specification

## 1. ?묒뾽 湲곗?

??臾몄꽌???꾩옱 Controller濡?援ы쁽??API留?Swagger 臾몄꽌????곸쑝濡?愿由ы븳??

?꾩쭅 援ы쁽?섏? ?딆? API??Swagger???몄텧?섏? ?딅뒗??

## 2. Swagger ?섏〈??

```kotlin
implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:3.0.3")
```

?꾩옱 ?꾨줈?앺듃??Spring Boot `4.0.6` 湲곕컲?대?濡?springdoc 3.x starter瑜??ъ슜?쒕떎.

## 3. Swagger ?묒냽 URL

```text
Swagger UI: http://localhost:8080/swagger-ui/index.html
OpenAPI JSON: http://localhost:8080/v3/api-docs
```

## 4. ?몄쬆 諛⑹떇

TrendPulse??Google OAuth 濡쒓렇?몃쭔 吏?먰븳??

```text
GET /oauth2/authorization/google
```

OAuth ?깃났 ??諛깆뿏?쒕뒗 JWT Access Token??諛쒓툒?섍퀬, ?꾨줎?몄뿏?쒕뒗 ?댄썑 蹂댄샇 API ?붿껌??Bearer Token??遺숈씤??

```http
Authorization: Bearer {accessToken}
```

Swagger Authorize ?낅젰李쎌뿉??`Bearer` ?놁씠 JWT 媛믩쭔 ?낅젰?쒕떎.

## 5. ?꾩옱 Swagger ?몄텧 API

| Group | Method | Endpoint | Auth | 援ы쁽 ?곹깭 |
| --- | --- | --- | --- | --- |
| Auth | GET | `/oauth2/authorization/google` | Public | Spring Security 湲곕낯 ?붾뱶?ъ씤??|
| Auth | GET | `/api/auth` | Public | 援ы쁽??|
| Auth | GET | `/api/auth/login` | Public | 援ы쁽??|
| Auth | POST | `/api/auth/logout` | Required | 援ы쁽??|
| User | GET | `/api/users/me` | Required | 援ы쁽??|
| Onboarding Keyword | POST | `/api/onboarding/keywords` | Required | 援ы쁽??|
| Onboarding Keyword | GET | `/api/onboarding/keywords` | Required | 援ы쁽??|
| Post | POST | `/api/posts` | Required | 援ы쁽??|

## 6. 怨듯넻 ?깃났 ?묐떟

```json
{
  "success": true,
  "data": {},
  "message": "?붿껌 ?깃났"
}
```

## 7. 怨듯넻 ?ㅽ뙣 ?묐떟

```json
{
  "success": false,
  "errorCode": "POST_NOT_FOUND",
  "message": "寃뚯떆湲??李얠쓣 ???놁뒿?덈떎."
}
```

## 8. 援ы쁽??API ?붿빟

### `GET /oauth2/authorization/google`

Google OAuth 濡쒓렇?몄쓣 ?쒖옉?쒕떎.

> Bearer Token 遺덊븘??

### `GET /api/auth/login`

Spring Security OAuth ?붾뱶?ъ씤?몃줈 redirect?쒕떎.

> Bearer Token 遺덊븘??

### `GET /api/auth`

?꾨줎?몄뿏??濡쒓렇??踰꾪듉?먯꽌 ?ъ슜?????덈뒗 Google OAuth 濡쒓렇??吏꾩엯?먯씠??

> Bearer Token 遺덊븘??

### `POST /api/auth/logout`

Access Token only 援ъ“?먯꽌 ?대씪?댁뼵??濡쒓렇?꾩썐??泥섎━?쒕떎.

> Bearer Token ?꾩슂

### `GET /api/users/me`

?꾩옱 JWT ?몄쬆???깃났???ъ슜???뺣낫瑜?議고쉶?쒕떎.

> Bearer Token ?꾩슂

### `POST /api/onboarding/keywords`

?꾩옱 ?ъ슜?먯쓽 ?⑤낫???ㅼ썙?쒕? ?앹꽦?쒕떎.

> Bearer Token ?꾩슂

Request:

```json
{
  "name": "AI 諛섎룄泥?
}
```

### `GET /api/onboarding/keywords`

?꾩옱 ?ъ슜?먯쓽 ?⑤낫???ㅼ썙??紐⑸줉??議고쉶?쒕떎.

> Bearer Token ?꾩슂

### `POST /api/posts`

移댄뀒怨좊━ 寃뚯떆?먯뿉 寃뚯떆湲???묒꽦?쒕떎.

> Bearer Token ?꾩슂

Request:

```json
{
  "category": "IT_SCIENCE",
  "title": "AI 諛섎룄泥??댁뒪媛 湲됱쬆?섍퀬 ?덉뒿?덈떎",
  "content": "??쒕낫?쒖뿉??AI 諛섎룄泥??ㅼ썙???몃젋?쒓? ?곸듅?섎뒗 寃껋씠 蹂댁뿬 怨듭쑀?⑸땲??"
}
```

## 9. ?꾩쭅 Swagger???몄텧?섏? ?딅뒗 API

?꾨옒 API??MVP ?덉젙 踰붿쐞?댁?留?Controller 湲곕뒫 援ы쁽 ?꾧퉴吏 Swagger???묒꽦?섏? ?딅뒗??

```text
PATCH /api/onboarding/keywords/{keywordId}
DELETE /api/onboarding/keywords/{keywordId}
PATCH /api/onboarding/keywords/{keywordId}/active
GET /api/posts
GET /api/posts/{postId}
PATCH /api/posts/{postId}
DELETE /api/posts/{postId}
POST /api/posts/{postId}/comments
GET /api/posts/{postId}/comments
PATCH /api/comments/{commentId}
DELETE /api/comments/{commentId}
```

## 10. Swagger JWT ?뚯뒪??諛⑸쾿

1. 釉뚮씪?곗??먯꽌 `/oauth2/authorization/google`濡?濡쒓렇?명븳??
2. OAuth ?깃났 ???꾨줎??callback URL??`token` 媛믪쓣 蹂듭궗?쒕떎.
3. `/swagger-ui/index.html`濡??묒냽?쒕떎.
4. ?곗륫 ?곷떒 `Authorize` 踰꾪듉???꾨Ⅸ??
5. `Bearer` ?놁씠 JWT 媛믩쭔 ?낅젰?쒕떎.
6. 蹂댄샇 API瑜??몄텧?쒕떎.

