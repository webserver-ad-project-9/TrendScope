package com.trendscope.app.domain.news.dto;

public record KeywordFrequencyItemResponse(
        String keyword,
        int count,
        double weight
) {
}
