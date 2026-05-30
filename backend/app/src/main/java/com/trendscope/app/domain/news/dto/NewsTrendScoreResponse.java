package com.trendscope.app.domain.news.dto;

import java.util.List;

public record NewsTrendScoreResponse(
        List<TrendScoreItemResponse> trends
) {
}
