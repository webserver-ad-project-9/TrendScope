# TrendPulse ERD Design

## 1. 전체 ERD 설명

TrendPulse MVP의 중심 관계는 사용자, 온보딩 키워드, 게시판, 댓글이다.

```text
User 1 : N OnboardingKeyword
User 1 : N Post
User 1 : N Comment
Post 1 : N Comment
```

확장 기능은 MVP 테이블을 기준으로 자연스럽게 붙는다.

```text
OnboardingKeyword 1 : N NewsArticle
OnboardingKeyword 1 : N TrendAnalysis
TrendAnalysis 1 : N AiSummary
```

설계 기준:

- Google OAuth 사용자이므로 비밀번호 컬럼은 만들지 않는다.
- 회원 식별은 `email` unique 제약으로 보장한다.
- PK는 모든 주요 테이블에서 UUID를 사용한다.
- 게시판 카테고리는 MVP에서는 enum으로 관리한다.
- 게시글/댓글은 운영 현실성을 고려해 soft delete를 적용한다.

## 2. 테이블별 컬럼 설계

### users

| Column | Type | Constraint | Description |
| --- | --- | --- | --- |
| id | CHAR(36) | PK | 사용자 UUID |
| email | VARCHAR(120) | NOT NULL, UNIQUE | Google 계정 email |
| name | VARCHAR(80) | NOT NULL | Google OAuth name |
| profile_image_url | VARCHAR(500) | NULL | Google 프로필 이미지 |
| provider | VARCHAR(30) | NOT NULL | `GOOGLE` |
| provider_id | VARCHAR(120) | NOT NULL | Google `sub` |
| role | VARCHAR(30) | NOT NULL | `USER`, `ADMIN` |
| created_at | DATETIME(6) | NOT NULL | 생성 시각 |
| updated_at | DATETIME(6) | NOT NULL | 수정 시각 |

### onboarding_keywords

| Column | Type | Constraint | Description |
| --- | --- | --- | --- |
| id | CHAR(36) | PK | 키워드 UUID |
| user_id | CHAR(36) | FK, NOT NULL | 사용자 |
| keyword | VARCHAR(80) | NOT NULL | 관심 키워드 |
| category | VARCHAR(40) | NULL | 선택 카테고리 |
| is_active | BOOLEAN | NOT NULL | 수집 대상 여부 |
| created_at | DATETIME(6) | NOT NULL | 생성 시각 |
| updated_at | DATETIME(6) | NOT NULL | 수정 시각 |

사용자별 중복 저장 방지를 위해 `(user_id, keyword)` unique 제약을 둔다.

### posts

| Column | Type | Constraint | Description |
| --- | --- | --- | --- |
| id | CHAR(36) | PK | 게시글 UUID |
| user_id | CHAR(36) | FK, NOT NULL | 작성자 |
| category | VARCHAR(30) | NOT NULL | 게시판 카테고리 enum |
| title | VARCHAR(150) | NOT NULL | 제목 |
| content | TEXT | NOT NULL | 본문 |
| view_count | BIGINT | NOT NULL DEFAULT 0 | 조회수 |
| deleted_at | DATETIME(6) | NULL | soft delete 시각 |
| created_at | DATETIME(6) | NOT NULL | 생성 시각 |
| updated_at | DATETIME(6) | NOT NULL | 수정 시각 |

### comments

| Column | Type | Constraint | Description |
| --- | --- | --- | --- |
| id | CHAR(36) | PK | 댓글 UUID |
| post_id | CHAR(36) | FK, NOT NULL | 게시글 |
| user_id | CHAR(36) | FK, NOT NULL | 작성자 |
| content | VARCHAR(1000) | NOT NULL | 댓글 내용 |
| deleted_at | DATETIME(6) | NULL | soft delete 시각 |
| created_at | DATETIME(6) | NOT NULL | 생성 시각 |
| updated_at | DATETIME(6) | NOT NULL | 수정 시각 |

## 3. PK / FK / Unique / Index 정리

| Table | PK | FK | Unique | Index |
| --- | --- | --- | --- | --- |
| users | id | - | email, provider + provider_id | email |
| onboarding_keywords | id | user_id -> users.id | user_id + keyword | user_id, is_active |
| posts | id | user_id -> users.id | - | category + created_at, user_id |
| comments | id | post_id -> posts.id, user_id -> users.id | - | post_id + created_at, user_id |

## 4. ERD 관점 도메인 관계

- `User`는 OAuth로 가입한 실제 서비스 사용자다.
- `OnboardingKeyword`는 사용자별 관심 키워드이므로 반드시 `User`에 종속된다.
- `Post`는 작성자인 `User`와 연결되고, 게시판 구분은 `BoardCategory` enum 값으로 저장한다.
- `Comment`는 게시글과 작성자 양쪽에 연결된다.
- 향후 `NewsArticle`은 특정 온보딩 키워드에서 수집된 뉴스로 연결한다.
- 향후 `TrendAnalysis`는 키워드별 분석 결과를 저장한다.
- 향후 `AiSummary`는 분석 결과 또는 뉴스 묶음에 대한 요약 결과를 저장한다.
