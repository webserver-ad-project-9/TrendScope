package com.trendscope.app.domain.news.dto;

import java.util.List;

public record NewsClusterResponse(
        List<NewsClusterItemResponse> clusters
) {
}
