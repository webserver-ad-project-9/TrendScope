package com.trendscope.app.domain.like.dto;

import java.util.UUID;

public record LikeResponse(
        UUID postId,
        boolean liked,
        long likeCount
) {
}
