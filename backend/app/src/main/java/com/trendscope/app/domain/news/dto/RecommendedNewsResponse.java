package com.trendscope.app.domain.news.dto;

import com.trendscope.app.domain.news.entity.NewsArticle;
import java.time.LocalDateTime;
import java.util.UUID;

public record RecommendedNewsResponse(
        UUID id,
        UUID keywordId,
        String matchedKeyword,
        String title,
        String description,
        String originUrl,
        LocalDateTime publishedAt,
        String recommendationReason
) {
    public static RecommendedNewsResponse from(NewsArticle article) {
        String keyword = article.getKeyword().getName();
        return new RecommendedNewsResponse(
                article.getId(),
                article.getKeyword().getId(),
                keyword,
                article.getTitle(),
                article.getDescription(),
                article.getOriginUrl(),
                article.getPublishedAt(),
                "'" + keyword + "' 키워드와 관련된 최신 뉴스입니다."
        );
    }
}
