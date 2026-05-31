package com.trendscope.app.domain.keyword.repository;

import com.trendscope.app.domain.keyword.entity.Keyword;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KeywordRepository extends JpaRepository<Keyword, UUID> {

    long countByUserIdAndActiveTrue(UUID userId);

    Optional<Keyword> findByIdAndUserId(UUID id, UUID userId);

    Optional<Keyword> findByUserIdAndKeyword(UUID userId, String keyword);

    List<Keyword> findByUserIdAndActiveTrueOrderByCreatedAtDesc(UUID userId);

    List<Keyword> findByUserIdAndKeywordIn(UUID userId, List<String> keywords);

    List<Keyword> findByActiveTrue();
}
