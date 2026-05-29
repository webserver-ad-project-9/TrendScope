package com.trendscope.app.domain.news.dto;

import java.util.List;

public record SuggestedKeywordResponse(
        List<KeywordFrequencyItemResponse> keywords
) {
}
