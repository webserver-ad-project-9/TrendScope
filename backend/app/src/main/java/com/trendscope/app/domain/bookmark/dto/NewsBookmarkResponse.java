package com.trendscope.app.domain.bookmark.dto;

import com.trendscope.app.domain.bookmark.entity.NewsBookmark;
import java.time.LocalDateTime;
import java.util.UUID;

public record NewsBookmarkResponse(
        UUID bookmarkId,
        UUID newsId,
        String title,
        String url,
        LocalDateTime publishedAt
) {
    public static NewsBookmarkResponse from(NewsBookmark bookmark) {
        var article = bookmark.getNewsArticle();
        return new NewsBookmarkResponse(
                bookmark.getId(),
                article.getId(),
                article.getTitle(),
                article.getOriginUrl(),
                article.getPublishedAt()
        );
    }
}
