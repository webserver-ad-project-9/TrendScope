# TrendPulse ?꾨줎???꾨떖??Auth / Keyword API 紐낆꽭??

## 怨듯넻 ?ы빆

### Base URL

```text
http://localhost:8080
```

### ?몄쬆 諛⑹떇

TrendPulse???쇰컲 ?대찓??鍮꾨?踰덊샇 濡쒓렇?몄쓣 ?ъ슜?섏? ?딅뒗??

```text
濡쒓렇??諛⑹떇: Google OAuth
?몄쬆 諛⑹떇: Bearer Token + 濡쒓렇??荑좏궎
媛쒕컻??怨좎젙 ?좏겙: {DEV_STATIC_TOKEN}
濡쒓렇??荑좏궎 key: accessToken
```

蹂댄샇 API ?붿껌 ???꾨줎?몃뒗 ?꾨옒 ??媛믪쓣 ?④퍡 蹂대궡???쒕떎.

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
```

釉뚮씪?곗??먯꽌??`Cookie` ?ㅻ뜑瑜?吏곸젒 ?ｌ? ?딄퀬, `withCredentials: true` ?ㅼ젙?쇰줈 荑좏궎媛 ?먮룞 ?꾩넚?섍쾶 ?쒕떎.

### 怨듯넻 ?깃났 ?묐떟

```json
{
  "success": true,
  "data": {},
  "message": "?붿껌 ?깃났"
}
```

### 怨듯넻 ?먮윭 ?묐떟

```json
{
  "success": false,
  "errorCode": "INVALID_JWT_TOKEN",
  "message": "?좏슚?섏? ?딆? ?좏겙?낅땲??"
}
```

| Status | ?곹솴 | Response |
| --- | --- | --- |
| `401` | Bearer Token ?놁쓬/遺덉씪移?| `{"success": false, "errorCode": "INVALID_JWT_TOKEN", "message": "?좏슚?섏? ?딆? ?좏겙?낅땲??"}` |
| `401` | 濡쒓렇??荑좏궎 ?놁쓬 | `{"success": false, "errorCode": "LOGIN_COOKIE_REQUIRED", "message": "濡쒓렇??荑좏궎媛 ?놁뒿?덈떎."}` |
| `401` | ?좏겙 留뚮즺 | `{"success": false, "errorCode": "EXPIRED_JWT_TOKEN", "message": "?좏겙??留뚮즺?섏뿀?듬땲??"}` |
| `404` | ?ъ슜???놁쓬 | `{"success": false, "errorCode": "USER_NOT_FOUND", "message": "?ъ슜?먮? 李얠쓣 ???놁뒿?덈떎."}` |

---

## 1. 濡쒓렇??

### `GET /api/auth`

Google OAuth 濡쒓렇???섏씠吏濡?由щ떎?대젆?명븳??

> Bearer Token 遺덊븘?? 濡쒓렇??荑좏궎 遺덊븘??

### Request Body

?놁쓬

### Query Parameters

?놁쓬

### Response

`302 Redirect` -> Google OAuth ?몄쬆 ?섏씠吏

```http
Location: /oauth2/authorization/google
```

### ?꾨줎??援ы쁽 ?덉떆

```ts
const handleGoogleLogin = () => {
  window.location.href = "http://localhost:8080/api/auth";
};
```

### 硫붾え

?꾨옒 URL濡?吏곸젒 ?대룞?대룄 ?숈씪?섍쾶 Google OAuth 濡쒓렇?몄씠 ?쒖옉?쒕떎.

```http
GET http://localhost:8080/oauth2/authorization/google
```

---

## 2. OAuth Callback

### `GET /api/auth/login/callback`

Google OAuth ?몄쬆 ?꾨즺 ??Google???몄텧?섎뒗 諛깆뿏??肄쒕갚?대떎.

?꾨줎?몄뿉??吏곸젒 ?몄텧?섏? ?딅뒗??

> Bearer Token 遺덊븘?? 濡쒓렇??荑좏궎 遺덊븘??

### ?숈옉

1. Google OAuth ?몄쬆 ?깃났
2. 諛깆뿏?쒓? Google ?ъ슜???뺣낫 議고쉶
3. email 湲곗??쇰줈 湲곗〈 ?ъ슜??議고쉶
4. ?ъ슜?먭? ?놁쑝硫??먮룞 ?앹꽦
5. JWT Access Token 諛쒓툒
6. `accessToken` 濡쒓렇??荑좏궎 諛쒓툒
7. ?꾨줎?몄뿏??callback URL濡?由щ떎?대젆??

### Redirect URL

諛깆뿏?쒕뒗 濡쒓렇???깃났 ???꾨줎?몃줈 ?꾨옒 ?뺤떇?쇰줈 ?대룞?쒗궓??

```text
http://localhost:3000/oauth/callback?token={JWT}
```

?덉떆:

```text
http://localhost:3000/oauth/callback?token=eyJhbGciOiJIUzI1NiJ9...
```

### 諛쒓툒?섎뒗 荑좏궎

| ??ぉ | 媛?|
| --- | --- |
| key | `accessToken` |
| value | JWT Access Token |
| httpOnly | `false` |
| secure | `false` |
| path | `/` |
| maxAge | `3600` |

### ?꾨줎??Callback 泥섎━ ?덉떆

```ts
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    localStorage.setItem("accessToken", token);
    document.cookie = `accessToken=${token}; path=/; max-age=3600`;
    router.replace("/");
  }, [router, searchParams]);

  return null;
}
```

---

## 3. 媛쒕컻??Static Token ?몄쬆

?꾩옱 ?꾨줎???곕룞 ?뚯뒪?몃? ?꾪빐 ?꾨옒 怨좎젙 ?좏겙???덉슜?쒕떎.

```text
{DEV_STATIC_TOKEN}
```

?꾨줎???붿껌?먮뒗 Bearer Token怨?荑좏궎媛 ?????ㅼ뼱媛???쒕떎.

```http
Authorization: Bearer {DEV_STATIC_TOKEN}
Cookie: accessToken={DEV_STATIC_TOKEN}
```

釉뚮씪?곗? 肄섏넄?먯꽌 媛쒕컻??荑좏궎瑜??щ뒗 ?덉떆:

```ts
document.cookie = "accessToken={DEV_STATIC_TOKEN}; path=/; max-age=3600";
```

Axios ?ㅼ젙 ?덉떆:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = "Bearer {DEV_STATIC_TOKEN}";
  return config;
});
```

---

## 4. 濡쒓렇?꾩썐

### `POST /api/auth/logout`

?꾨줎?몄뿉????ν븳 ?좏겙怨?荑좏궎瑜??쒓굅?섏뿬 濡쒓렇?꾩썐 泥섎━?쒕떎.

?꾩옱 諛깆뿏?쒕뒗 Access Token only 援ъ“???쒕쾭????λ맂 refresh token? ?녿떎.

> Bearer Token ?꾩슂, 濡쒓렇??荑좏궎 ?꾩슂

### Request Body

?놁쓬

### Request Header

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
```

### Response `200`

```json
{
  "success": true,
  "data": null,
  "message": "?붿껌 ?깃났"
}
```

### ?꾨줎??泥섎━ ?덉떆

```ts
const logout = async () => {
  await api.post("/api/auth/logout");
  localStorage.removeItem("accessToken");
  document.cookie = "accessToken=; path=/; max-age=0";
  window.location.href = "/login";
};
```

---

## 5. ?꾩옱 ?ъ슜??議고쉶

### `GET /api/users/me`

?꾩옱 濡쒓렇?명븳 ?ъ슜?먯쓽 湲곕낯 ?뺣낫瑜?議고쉶?쒕떎.

> Bearer Token ?꾩슂, 濡쒓렇??荑좏궎 ?꾩슂

### Request Body

?놁쓬

### Request Header

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
```

### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "4f4f9a2d-22e3-4b4e-8d01-83f9959dfc71",
    "email": "user@example.com",
    "name": "?띻만??,
    "role": "USER"
  },
  "message": "?붿껌 ?깃났"
}
```

### ?먮윭

| Status | ?곹솴 | Response |
| --- | --- | --- |
| `401` | ?좏겙 ?놁쓬/遺덉씪移?| `{"success": false, "errorCode": "INVALID_JWT_TOKEN", "message": "?좏슚?섏? ?딆? ?좏겙?낅땲??"}` |
| `404` | ?좎? ?놁쓬 | `{"success": false, "errorCode": "USER_NOT_FOUND", "message": "?ъ슜?먮? 李얠쓣 ???놁뒿?덈떎."}` |

---

## 6. ?⑤낫???ㅼ썙???앹꽦

### `POST /api/onboarding/keywords`

?꾩옱 濡쒓렇?명븳 ?ъ슜?먯쓽 愿???ㅼ썙?쒕? ?앹꽦?쒕떎.

?ㅼ썙???섏쭛/遺꾩꽍 ??곸씠 ?섎뒗 ?곗씠?곗씠誘濡?Bearer Token怨?濡쒓렇??荑좏궎媛 紐⑤몢 ?꾩슂?섎떎.

> Bearer Token ?꾩슂, 濡쒓렇??荑좏궎 ?꾩슂

### Request Header

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
Content-Type: application/json
```

### Request Body

```json
{
  "name": "AI 諛섎룄泥?
}
```

| ?꾨뱶 | ???| ?꾩닔 | ?ㅻ챸 |
| --- | --- | --- | --- |
| `name` | string | O | ?깅줉??愿???ㅼ썙??|

### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "6f84a524-9621-4d58-a454-75c84a8c5bb8",
    "name": "AI 諛섎룄泥?
  },
  "message": "?붿껌 ?깃났"
}
```

### ?먮윭

| Status | ?곹솴 | Response |
| --- | --- | --- |
| `400` | ?ㅼ썙???꾨씫 | `{"success": false, "errorCode": "INVALID_REQUEST", "message": "?ㅼ썙?쒕뒗 ?꾩닔?낅땲??"}` |
| `401` | ?몄쬆 ?ㅽ뙣 | `{"success": false, "errorCode": "INVALID_JWT_TOKEN", "message": "?좏슚?섏? ?딆? ?좏겙?낅땲??"}` |
| `409` | 以묐났 ?ㅼ썙??| `{"success": false, "errorCode": "KEYWORD_DUPLICATED", "message": "?대? ?깅줉???ㅼ썙?쒖엯?덈떎."}` |

### 媛쒕컻???몄텧 ?덉떆

```http
POST http://localhost:8080/api/onboarding/keywords
Authorization: Bearer {DEV_STATIC_TOKEN}
Cookie: accessToken={DEV_STATIC_TOKEN}
Content-Type: application/json
```

```json
{
  "name": "AI 諛섎룄泥?
}
```

---

## 7. ???⑤낫???ㅼ썙??紐⑸줉 議고쉶

### `GET /api/onboarding/keywords`

?꾩옱 濡쒓렇?명븳 ?ъ슜?먭? ?깅줉???⑤낫???ㅼ썙??紐⑸줉??議고쉶?쒕떎.

> Bearer Token ?꾩슂, 濡쒓렇??荑좏궎 ?꾩슂

### Request Header

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
```

### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "id": "6f84a524-9621-4d58-a454-75c84a8c5bb8",
      "name": "AI 諛섎룄泥?
    }
  ],
  "message": "?붿껌 ?깃났"
}
```

---

## 8. ?⑤낫???ㅼ썙???쇨큵 ?앹꽦

### `POST /api/onboarding/keywords/bulk`

?꾨줎???좉? UI?먯꽌 ?좏깮???щ윭 愿???ㅼ썙?쒕? ??踰덉뿉 ??ν븳??

?대? ??λ맂 ?ㅼ썙?쒕뒗 以묐났 ??ν븯吏 ?딄퀬 嫄대꼫?대떎.

> Bearer Token ?꾩슂, 濡쒓렇??荑좏궎 ?꾩슂

### Request Header

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
Content-Type: application/json
```

### Request Body

```json
{
  "names": ["AI 諛섎룄泥?, "寃쎌젣", "?ㅽ룷痢?]
}
```

| ?꾨뱶 | ???| ?꾩닔 | ?ㅻ챸 |
| --- | --- | --- | --- |
| `names` | string[] | O | ?ъ슜?먭? ?좉?濡??좏깮??愿???ㅼ썙??紐⑸줉 |

### Response `200`

?덈줈 ??λ맂 ?ㅼ썙?쒕쭔 諛섑솚?쒕떎.

```json
{
  "success": true,
  "data": [
    {
      "id": "6823e9eb-3d76-47ec-9243-cd62589db5aa",
      "name": "ai 諛섎룄泥?
    },
    {
      "id": "4bf8a3c6-1744-42ea-a861-6e9d105a7a77",
      "name": "寃쎌젣"
    },
    {
      "id": "29d84c2d-efcb-4110-9067-26302c5d64ec",
      "name": "?ㅽ룷痢?
    }
  ],
  "message": "?붿껌 ?깃났"
}
```

### 媛쒕컻???몄텧 ?덉떆

```powershell
$jsonPath = "$env:TEMP\keywords-bulk.json"

@'
{
  "names": ["AI 諛섎룄泥?, "寃쎌젣", "?ㅽ룷痢?]
}
'@ | Set-Content -Path $jsonPath -Encoding utf8

curl.exe -i -X POST "http://localhost:8080/api/onboarding/keywords/bulk" `
  -H "Authorization: Bearer {DEV_STATIC_TOKEN}" `
  -H "Cookie: accessToken={DEV_STATIC_TOKEN}" `
  -H "Content-Type: application/json; charset=utf-8" `
  --data-binary "@$jsonPath"
```

### ?먮윭

| Status | ?곹솴 | Response |
| --- | --- | --- |
| `400` | names媛 鍮꾩뼱 ?덉쓬 | `{"success": false, "errorCode": "INVALID_REQUEST", "message": "?ㅼ썙??紐⑸줉? ?꾩닔?낅땲??"}` |
| `401` | ?몄쬆 ?ㅽ뙣 | `{"success": false, "errorCode": "INVALID_JWT_TOKEN", "message": "?좏슚?섏? ?딆? ?좏겙?낅땲??"}` |

---

## API ?몄쬆 ?뺣━

| API | Bearer Token | 濡쒓렇??荑좏궎 | ?ㅻ챸 |
| --- | --- | --- | --- |
| `GET /api/auth` | - | - | Google OAuth 濡쒓렇???쒖옉 |
| `GET /oauth2/authorization/google` | - | - | Spring Security OAuth 濡쒓렇???쒖옉 |
| `GET /api/auth/login/callback` | - | - | Google OAuth callback |
| `POST /api/auth/logout` | O | O | 濡쒓렇?꾩썐 |
| `GET /api/users/me` | O | O | ?꾩옱 ?ъ슜??議고쉶 |
| `POST /api/onboarding/keywords` | O | O | ?⑤낫???ㅼ썙???앹꽦 |
| `POST /api/onboarding/keywords/bulk` | O | O | ?⑤낫???ㅼ썙???쇨큵 ?앹꽦 |
| `GET /api/onboarding/keywords` | O | O | ???⑤낫???ㅼ썙??紐⑸줉 議고쉶 |

## ?꾨줎???꾨떖 ?붿빟

```text
濡쒓렇???쒖옉:
GET http://localhost:8080/api/auth

濡쒓렇???깃났 ???대룞:
http://localhost:3000/oauth/callback?token={JWT}

蹂댄샇 API ?붿껌:
Authorization: Bearer {JWT}
Cookie: accessToken={JWT}

媛쒕컻???뚯뒪??媛?
Authorization: Bearer {DEV_STATIC_TOKEN}
Cookie: accessToken={DEV_STATIC_TOKEN}
```

