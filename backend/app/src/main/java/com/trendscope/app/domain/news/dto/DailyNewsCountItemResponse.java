package com.trendscope.app.domain.news.dto;

import java.time.LocalDate;

public record DailyNewsCountItemResponse(
        LocalDate date,
        long count
) {
}
