package com.trendscope.app.domain.news.dto;

import java.util.List;

public record NewsRecommendationResponse(
        List<NewsRecommendationKeywordResponse> keywords,
        List<RecommendedNewsResponse> articles,
        boolean refreshed
) {
}
