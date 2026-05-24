package com.trendscope.app.domain.trendanalysis.repository;

import com.trendscope.app.domain.trendanalysis.entity.TrendAnalysis;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrendAnalysisRepository extends JpaRepository<TrendAnalysis, UUID> {
}
