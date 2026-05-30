package com.trendscope.app.domain.like.repository;

import com.trendscope.app.domain.like.entity.PostLike;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostLikeRepository extends JpaRepository<PostLike, UUID> {

    long countByPostId(UUID postId);

    boolean existsByPostIdAndUserId(UUID postId, UUID userId);

    Optional<PostLike> findByPostIdAndUserId(UUID postId, UUID userId);
}
