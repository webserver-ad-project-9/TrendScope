package com.trendscope.app.domain.news.dto;

import java.util.List;

public record DailyNewsCountResponse(
        List<DailyNewsCountItemResponse> counts
) {
}
