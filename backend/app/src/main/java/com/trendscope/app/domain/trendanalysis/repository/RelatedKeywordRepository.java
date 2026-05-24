package com.trendscope.app.domain.trendanalysis.repository;

import com.trendscope.app.domain.trendanalysis.entity.RelatedKeyword;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RelatedKeywordRepository extends JpaRepository<RelatedKeyword, UUID> {
}
