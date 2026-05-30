package com.trendscope.app.domain.comment.dto;

import com.trendscope.app.domain.comment.entity.Comment;
import java.time.LocalDateTime;
import java.util.UUID;

public record CommentResponse(
        UUID id,
        String content,
        String writerName,
        boolean isMine,
        LocalDateTime createdAt
) {
    public static CommentResponse of(Comment comment, UUID currentUserId) {
        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getUser().getName(),
                comment.isWrittenBy(currentUserId),
                comment.getCreatedAt()
        );
    }
}
