# TrendPulse Community Frontend API Spec

## 1. 공통 사항

### Base URL

```text
http://localhost:8080
```

### 공통 응답 구조

성공 응답:

```json
{
  "success": true,
  "data": {},
  "message": "요청 성공"
}
```

실패 응답:

```json
{
  "success": false,
  "errorCode": "POST_NOT_FOUND",
  "message": "게시글을 찾을 수 없습니다."
}
```

### 인증 Header

보호 API는 Bearer Token과 로그인 쿠키를 함께 사용한다.

```http
Authorization: Bearer {token}
Cookie: accessToken={token}
```

개발용 테스트 값:

```http
Authorization: Bearer mjyw123123123
Cookie: accessToken=mjyw123123123
```

브라우저에서는 `Cookie` 헤더를 직접 넣지 않고, Axios에 `withCredentials: true`를 설정한다.

---

## 2. Nullable / Count / 정렬 기준

### Nullable 기준

| 타입 | 기준 |
| --- | --- |
| 필수 문자열 | `null` 불가, 빈 문자열 불가 |
| 선택 문자열 | 값이 없으면 `null` |
| 배열 | 값이 없으면 `[]`, `null` 반환 금지 |
| count 숫자 | `null` 불가, 값이 없으면 `0` |
| boolean | `null` 불가, 기본 `false` |
| 날짜 | ISO-8601 문자열 |

날짜 예시:

```text
2026-05-27T10:30:00
```

### Count 처리 기준

| 필드 | 기준 |
| --- | --- |
| `likeCount` | 좋아요 테이블 기준 count, 취소된 좋아요 제외 |
| `commentCount` | 삭제되지 않은 댓글만 count |
| `viewCount` | 게시글 상세 조회 성공 시 1 증가 |

프론트는 count를 직접 계산하지 않는다.  
항상 백엔드 응답의 `likeCount`, `commentCount`, `viewCount`를 표시한다.

### 정렬 기준

| 목록 | 정렬 |
| --- | --- |
| 게시글 목록 | `createdAt DESC` |
| 댓글 목록 | `createdAt ASC` |

MVP에서는 좋아요순/조회순 정렬을 제공하지 않는다.

---

## 3. 카테고리

API 요청/응답에는 enum code만 사용한다.  
한글 label은 프론트에서 매핑한다.

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
  POLITICS: "정치",
  ECONOMY: "경제",
  IT_SCIENCE: "IT/과학",
  SOCIETY: "사회",
  WORLD: "세계",
  SPORTS: "스포츠",
  ENTERTAINMENT: "연예",
};
```

---

## 4. 프론트 페이지 구조

```text
app/community/page.tsx
- 전체 게시글 목록

app/community/[category]/page.tsx
- 카테고리별 게시글 목록

app/community/posts/new/page.tsx
- 게시글 작성

app/community/posts/[postId]/page.tsx
- 게시글 상세
- 댓글 목록
- 좋아요 버튼

app/community/posts/[postId]/edit/page.tsx
- 게시글 수정
```

---

## 5. TypeScript 타입 정의

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

## 6. API 연동 명세

## 6.1 카테고리 목록 조회

### `GET /api/community/categories`

게시판 카테고리 목록을 조회한다.

> 인증 불필요

### Request Params

없음

### Request Body

없음

### Response `200`

```json
{
  "success": true,
  "data": [
    { "code": "POLITICS", "label": "정치" },
    { "code": "ECONOMY", "label": "경제" },
    { "code": "IT_SCIENCE", "label": "IT/과학" },
    { "code": "SOCIETY", "label": "사회" },
    { "code": "WORLD", "label": "세계" },
    { "code": "SPORTS", "label": "스포츠" },
    { "code": "ENTERTAINMENT", "label": "연예" }
  ],
  "message": "요청 성공"
}
```

### 사용 화면

```text
CategoryTabs
/community
/community/[category]
```

---

## 6.2 게시글 목록 조회

### `GET /api/posts`

게시글 목록을 조회한다. 카테고리 필터와 pagination을 지원한다.

> Bearer Token 선택, 로그인 쿠키 선택

로그인한 경우 `isMine` 계산 가능.  
비로그인 사용자는 `isMine=false`.

### Request Params

| 이름 | 타입 | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| `category` | BoardCategory | X | 없음 | 카테고리 필터 |
| `page` | number | X | `0` | 0부터 시작 |
| `size` | number | X | `10` | 페이지 크기 |

### Response `200`

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "post-uuid",
        "category": "IT_SCIENCE",
        "title": "AI 반도체 뉴스가 급증하고 있습니다",
        "writerName": "홍길동",
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
  "message": "요청 성공"
}
```

### 처리 기준

```text
category 없으면 전체 게시글 조회
category 있으면 해당 카테고리만 조회
삭제된 게시글은 제외
정렬은 createdAt DESC
content가 없으면 [] 반환
```

### 사용 화면

```text
/community
/community/[category]
PostList
PostCard
```

---

## 6.3 게시글 상세 조회

### `GET /api/posts/{postId}`

게시글 상세 정보를 조회한다.

> Bearer Token 선택, 로그인 쿠키 선택

로그인한 경우 `likedByMe`, `isMine` 계산 가능.  
비로그인 사용자는 `likedByMe=false`, `isMine=false`.

### Path Variables

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| `postId` | string(UUID) | 게시글 ID |

### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "post-uuid",
    "category": "IT_SCIENCE",
    "title": "AI 반도체 뉴스가 급증하고 있습니다",
    "content": "본문입니다.",
    "writer": {
      "id": "user-uuid",
      "name": "홍길동"
    },
    "likeCount": 12,
    "commentCount": 3,
    "viewCount": 46,
    "likedByMe": true,
    "isMine": false,
    "createdAt": "2026-05-27T10:30:00",
    "updatedAt": "2026-05-27T10:30:00"
  },
  "message": "요청 성공"
}
```

### 처리 기준

```text
조회 성공 시 viewCount 1 증가
삭제된 게시글은 404
댓글은 상세 응답에 포함하지 않음
댓글은 GET /api/posts/{postId}/comments 로 별도 조회
```

### 사용 화면

```text
/community/posts/[postId]
LikeButton
CommentList
```

---

## 6.4 게시글 작성

### `POST /api/posts`

게시글을 작성한다.

> Bearer Token 필요, 로그인 쿠키 필요

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
  "title": "AI 반도체 뉴스가 급증하고 있습니다",
  "content": "본문입니다."
}
```

### Validation

| 필드 | 기준 |
| --- | --- |
| `category` | 필수 |
| `title` | 필수, 1~150자 |
| `content` | 필수 |

### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "post-uuid"
  },
  "message": "요청 성공"
}
```

### 사용 화면

```text
/community/posts/new
PostEditor
```

---

## 6.5 게시글 수정

### `PATCH /api/posts/{postId}`

게시글을 수정한다.

> Bearer Token 필요, 로그인 쿠키 필요, 작성자만 가능

### Path Variables

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| `postId` | string(UUID) | 게시글 ID |

### Request Body

```json
{
  "category": "IT_SCIENCE",
  "title": "수정된 제목",
  "content": "수정된 본문입니다."
}
```

### 처리 기준

```text
부분 수정 아님
category, title, content 모두 보낸다
작성자가 아니면 403
```

### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "post-uuid",
    "category": "IT_SCIENCE",
    "title": "수정된 제목",
    "content": "수정된 본문입니다.",
    "writer": {
      "id": "user-uuid",
      "name": "홍길동"
    },
    "likeCount": 12,
    "commentCount": 3,
    "viewCount": 46,
    "likedByMe": true,
    "isMine": true,
    "createdAt": "2026-05-27T10:30:00",
    "updatedAt": "2026-05-27T11:00:00"
  },
  "message": "요청 성공"
}
```

### 사용 화면

```text
/community/posts/[postId]/edit
PostEditor
```

---

## 6.6 게시글 삭제

### `DELETE /api/posts/{postId}`

게시글을 삭제한다.

> Bearer Token 필요, 로그인 쿠키 필요, 작성자만 가능

### Path Variables

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| `postId` | string(UUID) | 게시글 ID |

### Response `200`

```json
{
  "success": true,
  "data": null,
  "message": "요청 성공"
}
```

### 처리 기준

```text
soft delete
삭제 후 목록에서 제외
삭제 성공 후 프론트는 목록 페이지로 이동
```

### 사용 화면

```text
/community/posts/[postId]
```

---

## 6.7 댓글 목록 조회

### `GET /api/posts/{postId}/comments`

게시글의 댓글 목록을 조회한다.

> Bearer Token 선택, 로그인 쿠키 선택

### Path Variables

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| `postId` | string(UUID) | 게시글 ID |

### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "id": "comment-uuid",
      "content": "저도 같은 흐름을 봤습니다.",
      "writerName": "김민재",
      "isMine": false,
      "createdAt": "2026-05-27T10:40:00"
    }
  ],
  "message": "요청 성공"
}
```

### 처리 기준

```text
댓글이 없으면 []
정렬은 createdAt ASC
삭제된 댓글은 제외
```

### 사용 화면

```text
/community/posts/[postId]
CommentList
```

---

## 6.8 댓글 작성

### `POST /api/posts/{postId}/comments`

댓글을 작성한다.

> Bearer Token 필요, 로그인 쿠키 필요

### Path Variables

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| `postId` | string(UUID) | 게시글 ID |

### Request Body

```json
{
  "content": "저도 같은 흐름을 봤습니다."
}
```

### Validation

| 필드 | 기준 |
| --- | --- |
| `content` | 필수, 1~1000자 |

### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "comment-uuid",
    "content": "저도 같은 흐름을 봤습니다.",
    "writerName": "김민재",
    "isMine": true,
    "createdAt": "2026-05-27T10:40:00"
  },
  "message": "요청 성공"
}
```

### 사용 화면

```text
/community/posts/[postId]
CommentForm
```

---

## 6.9 댓글 수정

### `PATCH /api/comments/{commentId}`

댓글 내용을 수정한다.

> Bearer Token 필요, 로그인 쿠키 필요, 작성자만 가능

### Path Variables

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| `commentId` | string(UUID) | 댓글 ID |

### Request Body

```json
{
  "content": "수정된 댓글입니다."
}
```

### Validation

| 필드 | 기준 |
| --- | --- |
| `content` | 필수, 1~1000자 |

### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "comment-uuid",
    "content": "수정된 댓글입니다.",
    "writerName": "김민재",
    "isMine": true,
    "createdAt": "2026-05-27T10:40:00"
  },
  "message": "요청 성공"
}
```

### 처리 기준

```text
작성자만 수정 가능
작성자가 아니면 403 FORBIDDEN
삭제된 댓글은 404 COMMENT_NOT_FOUND
```

### 사용 화면

```text
/community/posts/[postId]
CommentList
```

---

## 6.10 댓글 삭제

### `DELETE /api/comments/{commentId}`

댓글을 삭제한다.

> Bearer Token 필요, 로그인 쿠키 필요, 작성자만 가능

### Path Variables

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| `commentId` | string(UUID) | 댓글 ID |

### Request Body

없음

### Response `200`

```json
{
  "success": true,
  "data": null,
  "message": "요청 성공"
}
```

### 처리 기준

```text
soft delete
작성자만 삭제 가능
삭제 후 댓글 목록에서 제외
삭제 성공 후 comments query와 post detail query를 invalidate
```

### 사용 화면

```text
/community/posts/[postId]
CommentList
```

---

## 6.11 좋아요

### `POST /api/posts/{postId}/likes`

게시글에 좋아요를 누른다.

> Bearer Token 필요, 로그인 쿠키 필요

### Path Variables

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| `postId` | string(UUID) | 게시글 ID |

### Response `200`

```json
{
  "success": true,
  "data": {
    "postId": "post-uuid",
    "liked": true,
    "likeCount": 13
  },
  "message": "요청 성공"
}
```

### 처리 기준

```text
이미 좋아요 상태면 409 LIKE_ALREADY_EXISTS
프론트는 응답의 likeCount를 최종 표시값으로 사용
```

### 사용 화면

```text
/community/posts/[postId]
LikeButton
```

---

## 6.12 좋아요 취소

### `DELETE /api/posts/{postId}/likes`

게시글 좋아요를 취소한다.

> Bearer Token 필요, 로그인 쿠키 필요

### Path Variables

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| `postId` | string(UUID) | 게시글 ID |

### Response `200`

```json
{
  "success": true,
  "data": {
    "postId": "post-uuid",
    "liked": false,
    "likeCount": 12
  },
  "message": "요청 성공"
}
```

### 처리 기준

```text
좋아요가 없으면 404 LIKE_NOT_FOUND
프론트는 응답의 likeCount를 최종 표시값으로 사용
```

### 사용 화면

```text
/community/posts/[postId]
LikeButton
```

---

## 7. Axios API 함수 설계

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

## 8. 화면별 데이터 흐름

### 카테고리 탭 클릭

```text
CategoryTabs 클릭
→ selectedCategory 변경
→ /community/[category] 이동
→ getPostsByCategory(category, page, size)
→ PostList 렌더링
```

### 게시글 목록 조회

```text
/community 또는 /community/[category] 진입
→ React Query useQuery 실행
→ GET /api/posts
→ PostCard 목록 표시
```

### 게시글 상세 진입

```text
PostCard 클릭
→ /community/posts/[postId] 이동
→ getPostDetail(postId)
→ getComments(postId)
→ PostDetail, CommentList, LikeButton 렌더링
```

### 게시글 작성 후 이동

```text
PostEditor 제출
→ createPost()
→ 성공 시 /community/posts/{postId} 이동
→ posts query invalidate
```

### 댓글 작성 후 갱신

```text
CommentForm 제출
→ createComment(postId)
→ 성공 시 comments query invalidate
→ post detail query invalidate
→ commentCount 갱신
```

### 좋아요 클릭 후 UI 갱신

```text
LikeButton 클릭
→ likedByMe true면 unlikePost()
→ likedByMe false면 likePost()
→ optimistic update로 likedByMe, likeCount 즉시 변경
→ 실패 시 rollback
```

---

## 9. React Query 기준

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

### Invalidate 기준

| 동작 | invalidate |
| --- | --- |
| 게시글 작성 성공 | posts |
| 게시글 수정 성공 | post detail, posts |
| 게시글 삭제 성공 | posts |
| 댓글 작성 성공 | comments, post detail, posts |
| 댓글 수정 성공 | comments |
| 댓글 삭제 성공 | comments, post detail, posts |
| 좋아요 성공/취소 성공 | post detail, posts |

---

## 10. Optimistic Update 기준

Optimistic update 허용:

```text
likedByMe
likeCount
```

Optimistic update 금지:

```text
commentCount
viewCount
totalElements
totalPages
```

좋아요 실패 시 처리:

```text
이전 likedByMe, likeCount로 rollback
post detail query invalidate
posts list query invalidate
토스트 메시지 표시
```

---

## 11. 인증 처리 기준

### 인증 필요 API

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

### 인증 선택 API

```text
GET /api/posts
GET /api/posts/{postId}
GET /api/posts/{postId}/comments
```

### 비로그인 처리

```text
비로그인 사용자가 작성/댓글/좋아요 클릭
→ 로그인 페이지 이동 또는 로그인 모달 표시
```

### 수정/삭제 버튼 노출

```ts
if (post.isMine) {
  // 수정/삭제 버튼 표시
}
```

---

## 12. 에러 처리 기준

| Status | errorCode | 프론트 처리 |
| --- | --- | --- |
| `400` | `INVALID_REQUEST` | 입력값 검증 메시지 표시 |
| `400` | `INVALID_CATEGORY` | 카테고리 선택 오류 표시 |
| `401` | `INVALID_JWT_TOKEN` | 로그인 페이지 이동 |
| `403` | `FORBIDDEN` | 권한 없음 토스트 |
| `404` | `POST_NOT_FOUND` | 게시글 없음 화면 |
| `404` | `COMMENT_NOT_FOUND` | 댓글 없음 토스트 |
| `409` | `LIKE_ALREADY_EXISTS` | likedByMe=true로 동기화 후 재조회 |
| `404` | `LIKE_NOT_FOUND` | likedByMe=false로 동기화 후 재조회 |

---

## 13. UI 컴포넌트 구조

```text
features/community/
├── api/
│   └── communityApi.ts
├── components/
│   ├── CategoryTabs.tsx
│   ├── PostList.tsx
│   ├── PostCard.tsx
│   ├── PostEditor.tsx
│   ├── CommentList.tsx
│   ├── CommentForm.tsx
│   └── LikeButton.tsx
├── hooks/
│   ├── usePosts.ts
│   ├── usePostDetail.ts
│   ├── useComments.ts
│   └── usePostLike.ts
├── types/
│   └── community.ts
└── utils/
    ├── categoryLabel.ts
    └── formatCommunityDate.ts
```

---

## 14. 구현 우선순위

```text
1. community.ts 타입 정의
2. communityApi.ts Axios 함수 작성
3. React Query key/hook 작성
4. CategoryTabs 구현
5. PostList / PostCard 구현
6. 게시글 상세 화면 구현
7. PostEditor 작성/수정 공용 구현
8. CommentList / CommentForm 구현
9. LikeButton optimistic update 구현
10. 수정/삭제 버튼 isMine 기준 적용
```
