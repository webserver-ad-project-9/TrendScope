package com.trendscope.app.domain.bookmark.repository;

import com.trendscope.app.domain.bookmark.entity.NewsBookmark;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsBookmarkRepository extends JpaRepository<NewsBookmark, UUID> {

    boolean existsByUserIdAndNewsArticleId(UUID userId, UUID newsArticleId);

    Optional<NewsBookmark> findByUserIdAndNewsArticleId(UUID userId, UUID newsArticleId);

    List<NewsBookmark> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
