package com.trendscope.app.external.naver;

import java.util.List;

public record NaverNewsResponse(
        List<Item> items
) {
    public record Item(
            String title,
            String originallink,
            String description,
            String pubDate
    ) {
    }
}
