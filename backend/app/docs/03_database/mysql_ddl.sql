CREATE TABLE users (
    id CHAR(36) NOT NULL,
    email VARCHAR(120) NOT NULL,
    name VARCHAR(80) NOT NULL,
    profile_image_url VARCHAR(500),
    provider VARCHAR(30) NOT NULL,
    provider_id VARCHAR(120) NOT NULL,
    role VARCHAR(30) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email),
    UNIQUE KEY uk_users_provider_provider_id (provider, provider_id),
    KEY idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE onboarding_keywords (
    id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    keyword VARCHAR(80) NOT NULL,
    category VARCHAR(40),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_onboarding_keywords_user_keyword (user_id, keyword),
    KEY idx_onboarding_keywords_user_id (user_id),
    KEY idx_onboarding_keywords_active (is_active),
    CONSTRAINT fk_onboarding_keywords_user
        FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE posts (
    id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    category VARCHAR(30) NOT NULL,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    view_count BIGINT NOT NULL DEFAULT 0,
    deleted_at DATETIME(6),
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    KEY idx_posts_category_created_at (category, created_at),
    KEY idx_posts_user_id (user_id),
    CONSTRAINT fk_posts_user
        FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE comments (
    id CHAR(36) NOT NULL,
    post_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    content VARCHAR(1000) NOT NULL,
    deleted_at DATETIME(6),
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    KEY idx_comments_post_created_at (post_id, created_at),
    KEY idx_comments_user_id (user_id),
    CONSTRAINT fk_comments_post
        FOREIGN KEY (post_id) REFERENCES posts (id),
    CONSTRAINT fk_comments_user
        FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
