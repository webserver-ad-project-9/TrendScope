package com.trendscope.app.domain.news.dto;

import java.util.List;

public record KeywordBriefingGroupResponse(
        String keyword,
        int collectedCount,
        String summary,
        List<KeywordBriefingArticleResponse> articles
) {
}
