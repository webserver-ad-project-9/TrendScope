package com.trendscope.app.domain.post.dto;

import com.trendscope.app.domain.post.entity.BoardCategory;
import com.trendscope.app.domain.post.entity.Post;
import java.time.LocalDateTime;
import java.util.UUID;

public record PostListResponse(
        UUID id,
        BoardCategory category,
        String title,
        String writerName,
        long likeCount,
        long commentCount,
        long viewCount,
        LocalDateTime createdAt,
        boolean isMine
) {
    public static PostListResponse of(Post post, long likeCount, long commentCount, UUID currentUserId) {
        return new PostListResponse(
                post.getId(),
                post.getCategory(),
                post.getTitle(),
                post.getUser().getName(),
                likeCount,
                commentCount,
                post.getViewCount(),
                post.getCreatedAt(),
                post.isWrittenBy(currentUserId)
        );
    }
}
