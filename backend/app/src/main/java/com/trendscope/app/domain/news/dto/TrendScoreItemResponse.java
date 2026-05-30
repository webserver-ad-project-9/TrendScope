package com.trendscope.app.domain.news.dto;

import java.util.UUID;

public record TrendScoreItemResponse(
        UUID keywordId,
        String keyword,
        int articleCount,
        int trendScore
) {
}
