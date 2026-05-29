package com.trendscope.app.domain.news.dto;

import java.util.List;

public record NewsClusterItemResponse(
        String topic,
        int articleCount,
        List<KeywordBriefingArticleResponse> articles
) {
}
