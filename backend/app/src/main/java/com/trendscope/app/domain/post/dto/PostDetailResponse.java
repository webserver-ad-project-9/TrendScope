package com.trendscope.app.domain.post.dto;

import com.trendscope.app.domain.post.entity.BoardCategory;
import com.trendscope.app.domain.post.entity.Post;
import java.time.LocalDateTime;
import java.util.UUID;

public record PostDetailResponse(
        UUID id,
        BoardCategory category,
        String title,
        String content,
        WriterResponse writer,
        long likeCount,
        long commentCount,
        long viewCount,
        boolean likedByMe,
        boolean isMine,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static PostDetailResponse of(Post post, long likeCount, long commentCount, boolean likedByMe, UUID currentUserId) {
        return new PostDetailResponse(
                post.getId(),
                post.getCategory(),
                post.getTitle(),
                post.getContent(),
                WriterResponse.from(post.getUser()),
                likeCount,
                commentCount,
                post.getViewCount(),
                likedByMe,
                post.isWrittenBy(currentUserId),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}
