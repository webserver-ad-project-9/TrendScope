package com.trendscope.app.domain.post.repository;

import com.trendscope.app.domain.post.entity.Post;
import com.trendscope.app.domain.post.entity.BoardCategory;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, UUID> {

    Page<Post> findByDeletedAtIsNull(Pageable pageable);

    Page<Post> findByCategoryAndDeletedAtIsNull(BoardCategory category, Pageable pageable);
}
