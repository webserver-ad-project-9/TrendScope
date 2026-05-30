package com.trendscope.app.domain.news.dto;

import java.util.List;

public record KeywordFrequencyResponse(
        int articleCount,
        List<KeywordFrequencyItemResponse> keywords
) {
}
