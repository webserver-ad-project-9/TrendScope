package com.trendscope.app.domain.comment.repository;

import com.trendscope.app.domain.comment.entity.Comment;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, UUID> {

    long countByPostIdAndDeletedAtIsNull(UUID postId);

    List<Comment> findByPostIdAndDeletedAtIsNullOrderByCreatedAtAsc(UUID postId);
}
