package com.trendscope.app.domain.news.dto;

import java.util.List;
import java.util.UUID;

public record NewsSummaryResponse(
        List<UUID> newsIds,
        String summary,
        List<NewsSummarySourceResponse> sources
) {
}
