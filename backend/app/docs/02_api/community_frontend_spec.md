# TrendPulse Community Frontend API Spec

## 1. 怨듯넻 ?ы빆

### Base URL

```text
http://localhost:8080
```

### 怨듯넻 ?묐떟 援ъ“

?깃났 ?묐떟:

```json
{
  "success": true,
  "data": {},
  "message": "?붿껌 ?깃났"
}
```

?ㅽ뙣 ?묐떟:

```json
{
  "success": false,
  "errorCode": "POST_NOT_FOUND",
  "message": "寃뚯떆湲??李얠쓣 ???놁뒿?덈떎."
}
```

### ?몄쬆 Header

蹂댄샇 API??Bearer Token怨?濡쒓렇??荑좏궎瑜??④퍡 ?ъ슜?쒕떎.

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
```

媛쒕컻???뚯뒪??媛?

```http
Authorization: Bearer {DEV_STATIC_TOKEN}
Cookie: accessToken={DEV_STATIC_TOKEN}
```

釉뚮씪?곗??먯꽌??`Cookie` ?ㅻ뜑瑜?吏곸젒 ?ｌ? ?딄퀬, Axios??`withCredentials: true`瑜??ㅼ젙?쒕떎.

---

## 2. Nullable / Count / ?뺣젹 湲곗?

### Nullable 湲곗?

| ???| 湲곗? |
| --- | --- |
| ?꾩닔 臾몄옄??| `null` 遺덇?, 鍮?臾몄옄??遺덇? |
| ?좏깮 臾몄옄??| 媛믪씠 ?놁쑝硫?`null` |
| 諛곗뿴 | 媛믪씠 ?놁쑝硫?`[]`, `null` 諛섑솚 湲덉? |
| count ?レ옄 | `null` 遺덇?, 媛믪씠 ?놁쑝硫?`0` |
| boolean | `null` 遺덇?, 湲곕낯 `false` |
| ?좎쭨 | ISO-8601 臾몄옄??|

?좎쭨 ?덉떆:

```text
2026-05-27T10:30:00
```

### Count 泥섎━ 湲곗?

| ?꾨뱶 | 湲곗? |
| --- | --- |
| `likeCount` | 醫뗭븘???뚯씠釉?湲곗? count, 痍⑥냼??醫뗭븘???쒖쇅 |
| `commentCount` | ??젣?섏? ?딆? ?볤?留?count |
| `viewCount` | 寃뚯떆湲 ?곸꽭 議고쉶 ?깃났 ??1 利앷? |

?꾨줎?몃뒗 count瑜?吏곸젒 怨꾩궛?섏? ?딅뒗??  
??긽 諛깆뿏???묐떟??`likeCount`, `commentCount`, `viewCount`瑜??쒖떆?쒕떎.

### ?뺣젹 湲곗?

| 紐⑸줉 | ?뺣젹 |
| --- | --- |
| 寃뚯떆湲 紐⑸줉 | `createdAt DESC` |
| ?볤? 紐⑸줉 | `createdAt ASC` |

MVP?먯꽌??醫뗭븘?붿닚/議고쉶???뺣젹???쒓났?섏? ?딅뒗??

---

## 3. 移댄뀒怨좊━

API ?붿껌/?묐떟?먮뒗 enum code留??ъ슜?쒕떎.  
?쒓? label? ?꾨줎?몄뿉??留ㅽ븨?쒕떎.

```ts
export type BoardCategory =
  | "POLITICS"
  | "ECONOMY"
  | "IT_SCIENCE"
  | "SOCIETY"
  | "WORLD"
  | "SPORTS"
  | "ENTERTAINMENT";
```

```ts
export const BOARD_CATEGORY_LABEL: Record<BoardCategory, string> = {
  POLITICS: "?뺤튂",
  ECONOMY: "寃쎌젣",
  IT_SCIENCE: "IT/怨쇳븰",
  SOCIETY: "?ы쉶",
  WORLD: "?멸퀎",
  SPORTS: "?ㅽ룷痢?,
  ENTERTAINMENT: "?곗삁",
};
```

---

## 4. ?꾨줎???섏씠吏 援ъ“

```text
app/community/page.tsx
- ?꾩껜 寃뚯떆湲 紐⑸줉

app/community/[category]/page.tsx
- 移댄뀒怨좊━蹂?寃뚯떆湲 紐⑸줉

app/community/posts/new/page.tsx
- 寃뚯떆湲 ?묒꽦

app/community/posts/[postId]/page.tsx
- 寃뚯떆湲 ?곸꽭
- ?볤? 紐⑸줉
- 醫뗭븘??踰꾪듉

app/community/posts/[postId]/edit/page.tsx
- 寃뚯떆湲 ?섏젙
```

---

## 5. TypeScript ????뺤쓽

```ts
export type BoardCategory =
  | "POLITICS"
  | "ECONOMY"
  | "IT_SCIENCE"
  | "SOCIETY"
  | "WORLD"
  | "SPORTS"
  | "ENTERTAINMENT";

export interface ApiResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  errorCode: string;
  message: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CategoryOption {
  code: BoardCategory;
  label: string;
}

export interface PostListItem {
  id: string;
  category: BoardCategory;
  title: string;
  writerName: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  isMine: boolean;
}

export interface PostDetail {
  id: string;
  category: BoardCategory;
  title: string;
  content: string;
  writer: {
    id: string;
    name: string;
  };
  likeCount: number;
  commentCount: number;
  viewCount: number;
  likedByMe: boolean;
  isMine: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  writerName: string;
  isMine: boolean;
  createdAt: string;
}

export interface CreatePostRequest {
  category: BoardCategory;
  title: string;
  content: string;
}

export interface UpdatePostRequest {
  category: BoardCategory;
  title: string;
  content: string;
}

export interface CreateCommentRequest {
  content: string;
}

export interface LikeResponse {
  postId: string;
  liked: boolean;
  likeCount: number;
}
```

---

## 6. API ?곕룞 紐낆꽭

## 6.1 移댄뀒怨좊━ 紐⑸줉 議고쉶

### `GET /api/community/categories`

寃뚯떆??移댄뀒怨좊━ 紐⑸줉??議고쉶?쒕떎.

> ?몄쬆 遺덊븘??

### Request Params

?놁쓬

### Request Body

?놁쓬

### Response `200`

```json
{
  "success": true,
  "data": [
    { "code": "POLITICS", "label": "?뺤튂" },
    { "code": "ECONOMY", "label": "寃쎌젣" },
    { "code": "IT_SCIENCE", "label": "IT/怨쇳븰" },
    { "code": "SOCIETY", "label": "?ы쉶" },
    { "code": "WORLD", "label": "?멸퀎" },
    { "code": "SPORTS", "label": "?ㅽ룷痢? },
    { "code": "ENTERTAINMENT", "label": "?곗삁" }
  ],
  "message": "?붿껌 ?깃났"
}
```

### ?ъ슜 ?붾㈃

```text
CategoryTabs
/community
/community/[category]
```

---

## 6.2 寃뚯떆湲 紐⑸줉 議고쉶

### `GET /api/posts`

寃뚯떆湲 紐⑸줉??議고쉶?쒕떎. 移댄뀒怨좊━ ?꾪꽣? pagination??吏?먰븳??

> Bearer Token ?좏깮, 濡쒓렇??荑좏궎 ?좏깮

濡쒓렇?명븳 寃쎌슦 `isMine` 怨꾩궛 媛??  
鍮꾨줈洹몄씤 ?ъ슜?먮뒗 `isMine=false`.

### Request Params

| ?대쫫 | ???| ?꾩닔 | 湲곕낯媛?| ?ㅻ챸 |
| --- | --- | --- | --- | --- |
| `category` | BoardCategory | X | ?놁쓬 | 移댄뀒怨좊━ ?꾪꽣 |
| `page` | number | X | `0` | 0遺???쒖옉 |
| `size` | number | X | `10` | ?섏씠吏 ?ш린 |

### Response `200`

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "post-uuid",
        "category": "IT_SCIENCE",
        "title": "AI 諛섎룄泥??댁뒪媛 湲됱쬆?섍퀬 ?덉뒿?덈떎",
        "writerName": "?띻만??,
        "likeCount": 12,
        "commentCount": 3,
        "viewCount": 45,
        "createdAt": "2026-05-27T10:30:00",
        "isMine": false
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 1,
    "totalPages": 1
  },
  "message": "?붿껌 ?깃났"
}
```

### 泥섎━ 湲곗?

```text
category ?놁쑝硫??꾩껜 寃뚯떆湲 議고쉶
category ?덉쑝硫??대떦 移댄뀒怨좊━留?議고쉶
??젣??寃뚯떆湲? ?쒖쇅
?뺣젹? createdAt DESC
content媛 ?놁쑝硫?[] 諛섑솚
```

### ?ъ슜 ?붾㈃

```text
/community
/community/[category]
PostList
PostCard
```

---

## 6.3 寃뚯떆湲 ?곸꽭 議고쉶

### `GET /api/posts/{postId}`

寃뚯떆湲 ?곸꽭 ?뺣낫瑜?議고쉶?쒕떎.

> Bearer Token ?좏깮, 濡쒓렇??荑좏궎 ?좏깮

濡쒓렇?명븳 寃쎌슦 `likedByMe`, `isMine` 怨꾩궛 媛??  
鍮꾨줈洹몄씤 ?ъ슜?먮뒗 `likedByMe=false`, `isMine=false`.

### Path Variables

| ?대쫫 | ???| ?ㅻ챸 |
| --- | --- | --- |
| `postId` | string(UUID) | 寃뚯떆湲 ID |

### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "post-uuid",
    "category": "IT_SCIENCE",
    "title": "AI 諛섎룄泥??댁뒪媛 湲됱쬆?섍퀬 ?덉뒿?덈떎",
    "content": "蹂몃Ц?낅땲??",
    "writer": {
      "id": "user-uuid",
      "name": "?띻만??
    },
    "likeCount": 12,
    "commentCount": 3,
    "viewCount": 46,
    "likedByMe": true,
    "isMine": false,
    "createdAt": "2026-05-27T10:30:00",
    "updatedAt": "2026-05-27T10:30:00"
  },
  "message": "?붿껌 ?깃났"
}
```

### 泥섎━ 湲곗?

```text
議고쉶 ?깃났 ??viewCount 1 利앷?
??젣??寃뚯떆湲? 404
?볤?? ?곸꽭 ?묐떟???ы븿?섏? ?딆쓬
?볤?? GET /api/posts/{postId}/comments 濡?蹂꾨룄 議고쉶
```

### ?ъ슜 ?붾㈃

```text
/community/posts/[postId]
LikeButton
CommentList
```

---

## 6.4 寃뚯떆湲 ?묒꽦

### `POST /api/posts`

寃뚯떆湲???묒꽦?쒕떎.

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
  "category": "IT_SCIENCE",
  "title": "AI 諛섎룄泥??댁뒪媛 湲됱쬆?섍퀬 ?덉뒿?덈떎",
  "content": "蹂몃Ц?낅땲??"
}
```

### Validation

| ?꾨뱶 | 湲곗? |
| --- | --- |
| `category` | ?꾩닔 |
| `title` | ?꾩닔, 1~150??|
| `content` | ?꾩닔 |

### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "post-uuid"
  },
  "message": "?붿껌 ?깃났"
}
```

### ?ъ슜 ?붾㈃

```text
/community/posts/new
PostEditor
```

---

## 6.5 寃뚯떆湲 ?섏젙

### `PATCH /api/posts/{postId}`

寃뚯떆湲???섏젙?쒕떎.

> Bearer Token ?꾩슂, 濡쒓렇??荑좏궎 ?꾩슂, ?묒꽦?먮쭔 媛??

### Path Variables

| ?대쫫 | ???| ?ㅻ챸 |
| --- | --- | --- |
| `postId` | string(UUID) | 寃뚯떆湲 ID |

### Request Body

```json
{
  "category": "IT_SCIENCE",
  "title": "?섏젙???쒕ぉ",
  "content": "?섏젙??蹂몃Ц?낅땲??"
}
```

### 泥섎━ 湲곗?

```text
遺遺??섏젙 ?꾨떂
category, title, content 紐⑤몢 蹂대궦??
?묒꽦?먭? ?꾨땲硫?403
```

### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "post-uuid",
    "category": "IT_SCIENCE",
    "title": "?섏젙???쒕ぉ",
    "content": "?섏젙??蹂몃Ц?낅땲??",
    "writer": {
      "id": "user-uuid",
      "name": "?띻만??
    },
    "likeCount": 12,
    "commentCount": 3,
    "viewCount": 46,
    "likedByMe": true,
    "isMine": true,
    "createdAt": "2026-05-27T10:30:00",
    "updatedAt": "2026-05-27T11:00:00"
  },
  "message": "?붿껌 ?깃났"
}
```

### ?ъ슜 ?붾㈃

```text
/community/posts/[postId]/edit
PostEditor
```

---

## 6.6 寃뚯떆湲 ??젣

### `DELETE /api/posts/{postId}`

寃뚯떆湲????젣?쒕떎.

> Bearer Token ?꾩슂, 濡쒓렇??荑좏궎 ?꾩슂, ?묒꽦?먮쭔 媛??

### Path Variables

| ?대쫫 | ???| ?ㅻ챸 |
| --- | --- | --- |
| `postId` | string(UUID) | 寃뚯떆湲 ID |

### Response `200`

```json
{
  "success": true,
  "data": null,
  "message": "?붿껌 ?깃났"
}
```

### 泥섎━ 湲곗?

```text
soft delete
??젣 ??紐⑸줉?먯꽌 ?쒖쇅
??젣 ?깃났 ???꾨줎?몃뒗 紐⑸줉 ?섏씠吏濡??대룞
```

### ?ъ슜 ?붾㈃

```text
/community/posts/[postId]
```

---

## 6.7 ?볤? 紐⑸줉 議고쉶

### `GET /api/posts/{postId}/comments`

寃뚯떆湲???볤? 紐⑸줉??議고쉶?쒕떎.

> Bearer Token ?좏깮, 濡쒓렇??荑좏궎 ?좏깮

### Path Variables

| ?대쫫 | ???| ?ㅻ챸 |
| --- | --- | --- |
| `postId` | string(UUID) | 寃뚯떆湲 ID |

### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "id": "comment-uuid",
      "content": "???媛숈? ?먮쫫??遊ㅼ뒿?덈떎.",
      "writerName": "源誘쇱옱",
      "isMine": false,
      "createdAt": "2026-05-27T10:40:00"
    }
  ],
  "message": "?붿껌 ?깃났"
}
```

### 泥섎━ 湲곗?

```text
?볤????놁쑝硫?[]
?뺣젹? createdAt ASC
??젣???볤?? ?쒖쇅
```

### ?ъ슜 ?붾㈃

```text
/community/posts/[postId]
CommentList
```

---

## 6.8 ?볤? ?묒꽦

### `POST /api/posts/{postId}/comments`

?볤????묒꽦?쒕떎.

> Bearer Token ?꾩슂, 濡쒓렇??荑좏궎 ?꾩슂

### Path Variables

| ?대쫫 | ???| ?ㅻ챸 |
| --- | --- | --- |
| `postId` | string(UUID) | 寃뚯떆湲 ID |

### Request Body

```json
{
  "content": "???媛숈? ?먮쫫??遊ㅼ뒿?덈떎."
}
```

### Validation

| ?꾨뱶 | 湲곗? |
| --- | --- |
| `content` | ?꾩닔, 1~1000??|

### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "comment-uuid",
    "content": "???媛숈? ?먮쫫??遊ㅼ뒿?덈떎.",
    "writerName": "源誘쇱옱",
    "isMine": true,
    "createdAt": "2026-05-27T10:40:00"
  },
  "message": "?붿껌 ?깃났"
}
```

### ?ъ슜 ?붾㈃

```text
/community/posts/[postId]
CommentForm
```

---

## 6.9 ?볤? ?섏젙

### `PATCH /api/comments/{commentId}`

?볤? ?댁슜???섏젙?쒕떎.

> Bearer Token ?꾩슂, 濡쒓렇??荑좏궎 ?꾩슂, ?묒꽦?먮쭔 媛??

### Path Variables

| ?대쫫 | ???| ?ㅻ챸 |
| --- | --- | --- |
| `commentId` | string(UUID) | ?볤? ID |

### Request Body

```json
{
  "content": "?섏젙???볤??낅땲??"
}
```

### Validation

| ?꾨뱶 | 湲곗? |
| --- | --- |
| `content` | ?꾩닔, 1~1000??|

### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "comment-uuid",
    "content": "?섏젙???볤??낅땲??",
    "writerName": "源誘쇱옱",
    "isMine": true,
    "createdAt": "2026-05-27T10:40:00"
  },
  "message": "?붿껌 ?깃났"
}
```

### 泥섎━ 湲곗?

```text
?묒꽦?먮쭔 ?섏젙 媛??
?묒꽦?먭? ?꾨땲硫?403 FORBIDDEN
??젣???볤?? 404 COMMENT_NOT_FOUND
```

### ?ъ슜 ?붾㈃

```text
/community/posts/[postId]
CommentList
```

---

## 6.10 ?볤? ??젣

### `DELETE /api/comments/{commentId}`

?볤?????젣?쒕떎.

> Bearer Token ?꾩슂, 濡쒓렇??荑좏궎 ?꾩슂, ?묒꽦?먮쭔 媛??

### Path Variables

| ?대쫫 | ???| ?ㅻ챸 |
| --- | --- | --- |
| `commentId` | string(UUID) | ?볤? ID |

### Request Body

?놁쓬

### Response `200`

```json
{
  "success": true,
  "data": null,
  "message": "?붿껌 ?깃났"
}
```

### 泥섎━ 湲곗?

```text
soft delete
?묒꽦?먮쭔 ??젣 媛??
??젣 ???볤? 紐⑸줉?먯꽌 ?쒖쇅
??젣 ?깃났 ??comments query? post detail query瑜?invalidate
```

### ?ъ슜 ?붾㈃

```text
/community/posts/[postId]
CommentList
```

---

## 6.11 醫뗭븘??

### `POST /api/posts/{postId}/likes`

寃뚯떆湲??醫뗭븘?붾? ?꾨Ⅸ??

> Bearer Token ?꾩슂, 濡쒓렇??荑좏궎 ?꾩슂

### Path Variables

| ?대쫫 | ???| ?ㅻ챸 |
| --- | --- | --- |
| `postId` | string(UUID) | 寃뚯떆湲 ID |

### Response `200`

```json
{
  "success": true,
  "data": {
    "postId": "post-uuid",
    "liked": true,
    "likeCount": 13
  },
  "message": "?붿껌 ?깃났"
}
```

### 泥섎━ 湲곗?

```text
?대? 醫뗭븘???곹깭硫?409 LIKE_ALREADY_EXISTS
?꾨줎?몃뒗 ?묐떟??likeCount瑜?理쒖쥌 ?쒖떆媛믪쑝濡??ъ슜
```

### ?ъ슜 ?붾㈃

```text
/community/posts/[postId]
LikeButton
```

---

## 6.12 醫뗭븘??痍⑥냼

### `DELETE /api/posts/{postId}/likes`

寃뚯떆湲 醫뗭븘?붾? 痍⑥냼?쒕떎.

> Bearer Token ?꾩슂, 濡쒓렇??荑좏궎 ?꾩슂

### Path Variables

| ?대쫫 | ???| ?ㅻ챸 |
| --- | --- | --- |
| `postId` | string(UUID) | 寃뚯떆湲 ID |

### Response `200`

```json
{
  "success": true,
  "data": {
    "postId": "post-uuid",
    "liked": false,
    "likeCount": 12
  },
  "message": "?붿껌 ?깃났"
}
```

### 泥섎━ 湲곗?

```text
醫뗭븘?붽? ?놁쑝硫?404 LIKE_NOT_FOUND
?꾨줎?몃뒗 ?묐떟??likeCount瑜?理쒖쥌 ?쒖떆媛믪쑝濡??ъ슜
```

### ?ъ슜 ?붾㈃

```text
/community/posts/[postId]
LikeButton
```

---

## 7. Axios API ?⑥닔 ?ㅺ퀎

```ts
import { api } from "@/shared/api/axios";
import type {
  ApiResponse,
  BoardCategory,
  CategoryOption,
  Comment,
  CreateCommentRequest,
  CreatePostRequest,
  LikeResponse,
  PageResponse,
  PostDetail,
  PostListItem,
  UpdatePostRequest,
} from "../types/community";

export const getCategories = async () => {
  const res = await api.get<ApiResponse<CategoryOption[]>>(
    "/api/community/categories"
  );
  return res.data.data;
};

export const getPostsByCategory = async (
  category?: BoardCategory,
  page = 0,
  size = 10
) => {
  const res = await api.get<ApiResponse<PageResponse<PostListItem>>>(
    "/api/posts",
    {
      params: { category, page, size },
    }
  );
  return res.data.data;
};

export const getPostDetail = async (postId: string) => {
  const res = await api.get<ApiResponse<PostDetail>>(`/api/posts/${postId}`);
  return res.data.data;
};

export const createPost = async (body: CreatePostRequest) => {
  const res = await api.post<ApiResponse<{ id: string }>>("/api/posts", body);
  return res.data.data;
};

export const updatePost = async (
  postId: string,
  body: UpdatePostRequest
) => {
  const res = await api.patch<ApiResponse<PostDetail>>(
    `/api/posts/${postId}`,
    body
  );
  return res.data.data;
};

export const deletePost = async (postId: string) => {
  const res = await api.delete<ApiResponse<null>>(`/api/posts/${postId}`);
  return res.data.data;
};

export const createComment = async (
  postId: string,
  body: CreateCommentRequest
) => {
  const res = await api.post<ApiResponse<Comment>>(
    `/api/posts/${postId}/comments`,
    body
  );
  return res.data.data;
};

export const getComments = async (postId: string) => {
  const res = await api.get<ApiResponse<Comment[]>>(
    `/api/posts/${postId}/comments`
  );
  return res.data.data;
};

export const updateComment = async (
  commentId: string,
  body: CreateCommentRequest
) => {
  const res = await api.patch<ApiResponse<Comment>>(
    `/api/comments/${commentId}`,
    body
  );
  return res.data.data;
};

export const deleteComment = async (commentId: string) => {
  const res = await api.delete<ApiResponse<null>>(
    `/api/comments/${commentId}`
  );
  return res.data.data;
};

export const likePost = async (postId: string) => {
  const res = await api.post<ApiResponse<LikeResponse>>(
    `/api/posts/${postId}/likes`
  );
  return res.data.data;
};

export const unlikePost = async (postId: string) => {
  const res = await api.delete<ApiResponse<LikeResponse>>(
    `/api/posts/${postId}/likes`
  );
  return res.data.data;
};
```

---

## 8. ?붾㈃蹂??곗씠???먮쫫

### 移댄뀒怨좊━ ???대┃

```text
CategoryTabs ?대┃
??selectedCategory 蹂寃?
??/community/[category] ?대룞
??getPostsByCategory(category, page, size)
??PostList ?뚮뜑留?
```

### 寃뚯떆湲 紐⑸줉 議고쉶

```text
/community ?먮뒗 /community/[category] 吏꾩엯
??React Query useQuery ?ㅽ뻾
??GET /api/posts
??PostCard 紐⑸줉 ?쒖떆
```

### 寃뚯떆湲 ?곸꽭 吏꾩엯

```text
PostCard ?대┃
??/community/posts/[postId] ?대룞
??getPostDetail(postId)
??getComments(postId)
??PostDetail, CommentList, LikeButton ?뚮뜑留?
```

### 寃뚯떆湲 ?묒꽦 ???대룞

```text
PostEditor ?쒖텧
??createPost()
???깃났 ??/community/posts/{postId} ?대룞
??posts query invalidate
```

### ?볤? ?묒꽦 ??媛깆떊

```text
CommentForm ?쒖텧
??createComment(postId)
???깃났 ??comments query invalidate
??post detail query invalidate
??commentCount 媛깆떊
```

### 醫뗭븘???대┃ ??UI 媛깆떊

```text
LikeButton ?대┃
??likedByMe true硫?unlikePost()
??likedByMe false硫?likePost()
??optimistic update濡?likedByMe, likeCount 利됱떆 蹂寃?
???ㅽ뙣 ??rollback
```

---

## 9. React Query 湲곗?

### Query Key

```ts
export const communityKeys = {
  categories: ["community", "categories"] as const,
  posts: (category?: BoardCategory, page = 0, size = 10) =>
    ["community", "posts", category ?? "ALL", page, size] as const,
  post: (postId: string) => ["community", "post", postId] as const,
  comments: (postId: string) => ["community", "comments", postId] as const,
};
```

### Invalidate 湲곗?

| ?숈옉 | invalidate |
| --- | --- |
| 寃뚯떆湲 ?묒꽦 ?깃났 | posts |
| 寃뚯떆湲 ?섏젙 ?깃났 | post detail, posts |
| 寃뚯떆湲 ??젣 ?깃났 | posts |
| ?볤? ?묒꽦 ?깃났 | comments, post detail, posts |
| ?볤? ?섏젙 ?깃났 | comments |
| ?볤? ??젣 ?깃났 | comments, post detail, posts |
| 醫뗭븘???깃났/痍⑥냼 ?깃났 | post detail, posts |

---

## 10. Optimistic Update 湲곗?

Optimistic update ?덉슜:

```text
likedByMe
likeCount
```

Optimistic update 湲덉?:

```text
commentCount
viewCount
totalElements
totalPages
```

醫뗭븘???ㅽ뙣 ??泥섎━:

```text
?댁쟾 likedByMe, likeCount濡?rollback
post detail query invalidate
posts list query invalidate
?좎뒪??硫붿떆吏 ?쒖떆
```

---

## 11. ?몄쬆 泥섎━ 湲곗?

### ?몄쬆 ?꾩슂 API

```text
POST /api/posts
PATCH /api/posts/{postId}
DELETE /api/posts/{postId}
POST /api/posts/{postId}/comments
PATCH /api/comments/{commentId}
DELETE /api/comments/{commentId}
POST /api/posts/{postId}/likes
DELETE /api/posts/{postId}/likes
```

### ?몄쬆 ?좏깮 API

```text
GET /api/posts
GET /api/posts/{postId}
GET /api/posts/{postId}/comments
```

### 鍮꾨줈洹몄씤 泥섎━

```text
鍮꾨줈洹몄씤 ?ъ슜?먭? ?묒꽦/?볤?/醫뗭븘???대┃
??濡쒓렇???섏씠吏 ?대룞 ?먮뒗 濡쒓렇??紐⑤떖 ?쒖떆
```

### ?섏젙/??젣 踰꾪듉 ?몄텧

```ts
if (post.isMine) {
  // ?섏젙/??젣 踰꾪듉 ?쒖떆
}
```

---

## 12. ?먮윭 泥섎━ 湲곗?

| Status | errorCode | ?꾨줎??泥섎━ |
| --- | --- | --- |
| `400` | `INVALID_REQUEST` | ?낅젰媛?寃利?硫붿떆吏 ?쒖떆 |
| `400` | `INVALID_CATEGORY` | 移댄뀒怨좊━ ?좏깮 ?ㅻ쪟 ?쒖떆 |
| `401` | `INVALID_JWT_TOKEN` | 濡쒓렇???섏씠吏 ?대룞 |
| `403` | `FORBIDDEN` | 沅뚰븳 ?놁쓬 ?좎뒪??|
| `404` | `POST_NOT_FOUND` | 寃뚯떆湲 ?놁쓬 ?붾㈃ |
| `404` | `COMMENT_NOT_FOUND` | ?볤? ?놁쓬 ?좎뒪??|
| `409` | `LIKE_ALREADY_EXISTS` | likedByMe=true濡??숆린?????ъ“??|
| `404` | `LIKE_NOT_FOUND` | likedByMe=false濡??숆린?????ъ“??|

---

## 13. UI 而댄룷?뚰듃 援ъ“

```text
features/community/
?쒋?? api/
??  ?붴?? communityApi.ts
?쒋?? components/
??  ?쒋?? CategoryTabs.tsx
??  ?쒋?? PostList.tsx
??  ?쒋?? PostCard.tsx
??  ?쒋?? PostEditor.tsx
??  ?쒋?? CommentList.tsx
??  ?쒋?? CommentForm.tsx
??  ?붴?? LikeButton.tsx
?쒋?? hooks/
??  ?쒋?? usePosts.ts
??  ?쒋?? usePostDetail.ts
??  ?쒋?? useComments.ts
??  ?붴?? usePostLike.ts
?쒋?? types/
??  ?붴?? community.ts
?붴?? utils/
    ?쒋?? categoryLabel.ts
    ?붴?? formatCommunityDate.ts
```

---

## 14. 援ы쁽 ?곗꽑?쒖쐞

```text
1. community.ts ????뺤쓽
2. communityApi.ts Axios ?⑥닔 ?묒꽦
3. React Query key/hook ?묒꽦
4. CategoryTabs 援ы쁽
5. PostList / PostCard 援ы쁽
6. 寃뚯떆湲 ?곸꽭 ?붾㈃ 援ы쁽
7. PostEditor ?묒꽦/?섏젙 怨듭슜 援ы쁽
8. CommentList / CommentForm 援ы쁽
9. LikeButton optimistic update 援ы쁽
10. ?섏젙/??젣 踰꾪듉 isMine 湲곗? ?곸슜
```

