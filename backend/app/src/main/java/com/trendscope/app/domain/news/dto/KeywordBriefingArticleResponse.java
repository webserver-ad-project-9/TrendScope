package com.trendscope.app.domain.news.dto;

import com.trendscope.app.domain.news.entity.NewsArticle;
import java.time.LocalDateTime;

public record KeywordBriefingArticleResponse(
        String title,
        String url,
        LocalDateTime publishedAt
) {
    public static KeywordBriefingArticleResponse from(NewsArticle article) {
        return new KeywordBriefingArticleResponse(
                article.getTitle(),
                article.getOriginUrl(),
                article.getPublishedAt()
        );
    }
}
