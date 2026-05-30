package com.trendscope.app.domain.news.dto;

import java.util.UUID;

public record NewsSentimentItemResponse(
        UUID keywordId,
        String keyword,
        String sentiment,
        String riskLevel,
        String reason
) {
}
