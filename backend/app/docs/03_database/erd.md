# TrendPulse ERD Design

## 1. ?꾩껜 ERD ?ㅻ챸

TrendPulse MVP??以묒떖 愿怨꾨뒗 ?ъ슜?? ?⑤낫???ㅼ썙?? 寃뚯떆?? ?볤??대떎.

```text
User 1 : N OnboardingKeyword
User 1 : N Post
User 1 : N Comment
Post 1 : N Comment
```

?뺤옣 湲곕뒫? MVP ?뚯씠釉붿쓣 湲곗??쇰줈 ?먯뿰?ㅻ읇寃?遺숇뒗??

```text
OnboardingKeyword 1 : N NewsArticle
OnboardingKeyword 1 : N TrendAnalysis
TrendAnalysis 1 : N AiSummary
```

?ㅺ퀎 湲곗?:

- Google OAuth ?ъ슜?먯씠誘濡?鍮꾨?踰덊샇 而щ읆? 留뚮뱾吏 ?딅뒗??
- ?뚯썝 ?앸퀎? `email` unique ?쒖빟?쇰줈 蹂댁옣?쒕떎.
- PK??紐⑤뱺 二쇱슂 ?뚯씠釉붿뿉??UUID瑜??ъ슜?쒕떎.
- 寃뚯떆??移댄뀒怨좊━??MVP?먯꽌??enum?쇰줈 愿由ы븳??
- 寃뚯떆湲/?볤?? ?댁쁺 ?꾩떎?깆쓣 怨좊젮??soft delete瑜??곸슜?쒕떎.

## 2. ?뚯씠釉붾퀎 而щ읆 ?ㅺ퀎

### users

| Column | Type | Constraint | Description |
| --- | --- | --- | --- |
| id | CHAR(36) | PK | ?ъ슜??UUID |
| email | VARCHAR(120) | NOT NULL, UNIQUE | Google 怨꾩젙 email |
| name | VARCHAR(80) | NOT NULL | Google OAuth name |
| profile_image_url | VARCHAR(500) | NULL | Google ?꾨줈???대?吏 |
| provider | VARCHAR(30) | NOT NULL | `GOOGLE` |
| provider_id | VARCHAR(120) | NOT NULL | Google `sub` |
| role | VARCHAR(30) | NOT NULL | `USER`, `ADMIN` |
| created_at | DATETIME(6) | NOT NULL | ?앹꽦 ?쒓컖 |
| updated_at | DATETIME(6) | NOT NULL | ?섏젙 ?쒓컖 |

### onboarding_keywords

| Column | Type | Constraint | Description |
| --- | --- | --- | --- |
| id | CHAR(36) | PK | ?ㅼ썙??UUID |
| user_id | CHAR(36) | FK, NOT NULL | ?ъ슜??|
| keyword | VARCHAR(80) | NOT NULL | 愿???ㅼ썙??|
| category | VARCHAR(40) | NULL | ?좏깮 移댄뀒怨좊━ |
| is_active | BOOLEAN | NOT NULL | ?섏쭛 ????щ? |
| created_at | DATETIME(6) | NOT NULL | ?앹꽦 ?쒓컖 |
| updated_at | DATETIME(6) | NOT NULL | ?섏젙 ?쒓컖 |

?ъ슜?먮퀎 以묐났 ???諛⑹?瑜??꾪빐 `(user_id, keyword)` unique ?쒖빟???붾떎.

### posts

| Column | Type | Constraint | Description |
| --- | --- | --- | --- |
| id | CHAR(36) | PK | 寃뚯떆湲 UUID |
| user_id | CHAR(36) | FK, NOT NULL | ?묒꽦??|
| category | VARCHAR(30) | NOT NULL | 寃뚯떆??移댄뀒怨좊━ enum |
| title | VARCHAR(150) | NOT NULL | ?쒕ぉ |
| content | TEXT | NOT NULL | 蹂몃Ц |
| view_count | BIGINT | NOT NULL DEFAULT 0 | 議고쉶??|
| deleted_at | DATETIME(6) | NULL | soft delete ?쒓컖 |
| created_at | DATETIME(6) | NOT NULL | ?앹꽦 ?쒓컖 |
| updated_at | DATETIME(6) | NOT NULL | ?섏젙 ?쒓컖 |

### comments

| Column | Type | Constraint | Description |
| --- | --- | --- | --- |
| id | CHAR(36) | PK | ?볤? UUID |
| post_id | CHAR(36) | FK, NOT NULL | 寃뚯떆湲 |
| user_id | CHAR(36) | FK, NOT NULL | ?묒꽦??|
| content | VARCHAR(1000) | NOT NULL | ?볤? ?댁슜 |
| deleted_at | DATETIME(6) | NULL | soft delete ?쒓컖 |
| created_at | DATETIME(6) | NOT NULL | ?앹꽦 ?쒓컖 |
| updated_at | DATETIME(6) | NOT NULL | ?섏젙 ?쒓컖 |

## 3. PK / FK / Unique / Index ?뺣━

| Table | PK | FK | Unique | Index |
| --- | --- | --- | --- | --- |
| users | id | - | email, provider + provider_id | email |
| onboarding_keywords | id | user_id -> users.id | user_id + keyword | user_id, is_active |
| posts | id | user_id -> users.id | - | category + created_at, user_id |
| comments | id | post_id -> posts.id, user_id -> users.id | - | post_id + created_at, user_id |

## 4. ERD 愿???꾨찓??愿怨?

- `User`??OAuth濡?媛?낇븳 ?ㅼ젣 ?쒕퉬???ъ슜?먮떎.
- `OnboardingKeyword`???ъ슜?먮퀎 愿???ㅼ썙?쒖씠誘濡?諛섎뱶??`User`??醫낆냽?쒕떎.
- `Post`???묒꽦?먯씤 `User`? ?곌껐?섍퀬, 寃뚯떆??援щ텇? `BoardCategory` enum 媛믪쑝濡???ν븳??
- `Comment`??寃뚯떆湲怨??묒꽦???묒そ???곌껐?쒕떎.
- ?ν썑 `NewsArticle`? ?뱀젙 ?⑤낫???ㅼ썙?쒖뿉???섏쭛???댁뒪濡??곌껐?쒕떎.
- ?ν썑 `TrendAnalysis`???ㅼ썙?쒕퀎 遺꾩꽍 寃곌낵瑜???ν븳??
- ?ν썑 `AiSummary`??遺꾩꽍 寃곌낵 ?먮뒗 ?댁뒪 臾띠쓬??????붿빟 寃곌낵瑜???ν븳??

