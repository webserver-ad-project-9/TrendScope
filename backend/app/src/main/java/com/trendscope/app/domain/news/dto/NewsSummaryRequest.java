package com.trendscope.app.domain.news.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import java.util.UUID;

public record NewsSummaryRequest(
        @NotEmpty(message = "newsIds is required")
        List<UUID> newsIds,
        Integer maxSentenceCount
) {
    public int sentenceCount() {
        if (maxSentenceCount == null || maxSentenceCount < 1) {
            return 3;
        }
        return Math.min(maxSentenceCount, 5);
    }
}
