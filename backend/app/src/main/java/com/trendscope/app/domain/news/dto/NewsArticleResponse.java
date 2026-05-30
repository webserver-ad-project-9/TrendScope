package com.trendscope.app.domain.news.dto;

import com.trendscope.app.domain.news.entity.NewsArticle;
import java.util.UUID;

public record NewsArticleResponse(
        UUID id,
        String title
) {
    public static NewsArticleResponse from(NewsArticle article) {
        return new NewsArticleResponse(article.getId(), article.getTitle());
    }
}
