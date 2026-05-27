package com.trendscope.app.domain.news.dto;

import com.trendscope.app.domain.keyword.entity.Keyword;
import java.util.UUID;

public record NewsRecommendationKeywordResponse(
        UUID id,
        String name
) {
    public static NewsRecommendationKeywordResponse from(Keyword keyword) {
        return new NewsRecommendationKeywordResponse(keyword.getId(), keyword.getName());
    }
}
