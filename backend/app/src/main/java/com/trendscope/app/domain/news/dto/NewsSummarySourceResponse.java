package com.trendscope.app.domain.news.dto;

import com.trendscope.app.domain.news.entity.NewsArticle;
import java.time.LocalDateTime;
import java.util.UUID;

public record NewsSummarySourceResponse(
        UUID id,
        String title,
        String originUrl,
        LocalDateTime publishedAt
) {
    public static NewsSummarySourceResponse from(NewsArticle article) {
        return new NewsSummarySourceResponse(
                article.getId(),
                article.getTitle(),
                article.getOriginUrl(),
                article.getPublishedAt()
        );
    }
}
