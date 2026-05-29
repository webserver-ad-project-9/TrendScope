package com.trendscope.app.domain.news.dto;

import java.time.LocalDate;
import java.util.List;

public record KeywordBriefingResponse(
        LocalDate date,
        String summaryType,
        int totalCollectedCount,
        List<KeywordBriefingGroupResponse> summaries
) {
    public static final String KEYWORD_GROUP_SUMMARY = "KEYWORD_GROUP_SUMMARY";
}
