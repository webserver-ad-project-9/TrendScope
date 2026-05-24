# TrendPulse Table Specification

## JPA Entity 설계 방향

- PK는 `UUID` 타입과 `@GeneratedValue(strategy = GenerationType.UUID)`를 사용한다.
- MySQL에서는 UUID를 MVP 기준 `CHAR(36)`으로 저장한다.
- 모든 Entity는 `BaseEntity`를 상속해 `createdAt`, `updatedAt`을 공통 처리한다.
- API 응답에는 Entity를 직접 노출하지 않고 Response DTO를 사용한다.
- `User`에는 비밀번호를 두지 않는다. Google OAuth 기반이므로 `email`, `provider`, `providerId`만 저장한다.

## Enum 설계 방향

게시판 카테고리:

```text
POLITICS: 정치
ECONOMY: 경제
SOCIETY: 사회
LIFE: 생활
CULTURE: 문화
IT_SCIENCE: IT/과학
WORLD: 세계
SPORTS: 스포츠
ENTERTAINMENT: 엔터
```

JPA에서는 `@Enumerated(EnumType.STRING)`을 사용한다.

이유:

- 숫자 ordinal 저장은 enum 순서 변경 시 데이터가 깨질 수 있다.
- 문자열 저장은 DB에서 의미 확인이 쉽다.
- MVP에서는 카테고리 목록이 고정되어 있어 별도 테이블보다 enum이 구현과 유지보수에 유리하다.

## created_at / updated_at 처리 방식

- `BaseEntity`에 `@CreatedDate`, `@LastModifiedDate`를 둔다.
- 메인 클래스에 `@EnableJpaAuditing`을 적용한다.
- DB 컬럼은 `DATETIME(6)`으로 관리한다.
- 애플리케이션 레벨에서 생성/수정 시각을 자동 기록한다.

## Soft Delete 적용 여부

### User

MVP에서는 soft delete를 적용하지 않는다. OAuth 계정 삭제 정책은 별도 회원탈퇴 요구사항이 생길 때 확장한다.

### OnboardingKeyword

물리 삭제보다 `is_active`를 우선 사용한다. 뉴스 수집 대상에서 제외할 수 있고, 사용자의 과거 관심사를 분석 기능에 재활용할 수 있다.

### Post

soft delete 적용을 추천한다. 게시글 삭제 후에도 댓글, 신고, 운영 로그, 통계 정합성이 필요할 수 있다.

### Comment

soft delete 적용을 추천한다. 댓글 삭제 시 대댓글 기능이 추가되거나 게시글 댓글 수 통계를 유지해야 할 수 있다.

## 게시판 카테고리 설계 방식 비교

| 방식 | 장점 | 단점 | 적합 상황 |
| --- | --- | --- | --- |
| Enum | 구현 단순, JPA 매핑 쉬움, MVP에 적합 | 운영 중 카테고리 추가 시 배포 필요 | 카테고리가 고정된 서비스 |
| Category Table | 관리자 화면에서 동적 관리 가능, 정렬/노출명 관리 쉬움 | 테이블/관리 API 추가 필요, MVP에는 과함 | 카테고리를 자주 바꾸는 서비스 |

MVP 기준 최종 추천은 enum이다. 현재 요구사항의 9개 카테고리는 고정값이고, 캡스톤 규모에서는 enum이 명확하고 구현 비용이 낮다.

## MVP 기준 최종 추천 DB 구조

필수 테이블:

- `users`
- `onboarding_keywords`
- `posts`
- `comments`

카테고리:

- `posts.category`에 enum 문자열 저장
- 별도 `board_categories` 테이블은 만들지 않음

키워드:

- `onboarding_keywords.keyword` 저장
- `(user_id, keyword)` unique 제약 적용
- `is_active`로 수집 대상 여부 관리

OAuth:

- `users.email` unique
- `users.provider = GOOGLE`
- `users.provider_id = Google sub`
- password 컬럼 없음

## 향후 확장 테이블

### news_articles

```text
id CHAR(36) PK
keyword_id CHAR(36) FK
title VARCHAR(300)
origin_url VARCHAR(1000)
description TEXT
published_at DATETIME(6)
created_at DATETIME(6)
updated_at DATETIME(6)
```

### trend_analyses

```text
id CHAR(36) PK
keyword_id CHAR(36) FK
analysis_date DATE
article_count INT
trend_score DOUBLE
created_at DATETIME(6)
updated_at DATETIME(6)
```

### related_keywords

```text
id CHAR(36) PK
trend_analysis_id CHAR(36) FK
keyword VARCHAR(80)
frequency INT
created_at DATETIME(6)
updated_at DATETIME(6)
```

### ai_summaries

```text
id CHAR(36) PK
trend_analysis_id CHAR(36) FK
summary TEXT
model VARCHAR(80)
created_at DATETIME(6)
updated_at DATETIME(6)
```
