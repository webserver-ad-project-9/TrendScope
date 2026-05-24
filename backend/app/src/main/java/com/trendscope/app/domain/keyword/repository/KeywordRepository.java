package com.trendscope.app.domain.keyword.repository;

import com.trendscope.app.domain.keyword.entity.Keyword;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KeywordRepository extends JpaRepository<Keyword, UUID> {

    boolean existsByUserIdAndKeyword(UUID userId, String keyword);

    List<Keyword> findByUserIdOrderByCreatedAtDesc(UUID userId);

    List<Keyword> findByUserIdAndKeywordIn(UUID userId, List<String> keywords);

    List<Keyword> findByActiveTrue();
}
