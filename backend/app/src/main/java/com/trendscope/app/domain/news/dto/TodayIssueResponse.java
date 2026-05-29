package com.trendscope.app.domain.news.dto;

import java.util.List;

public record TodayIssueResponse(
        List<String> issues
) {
}
