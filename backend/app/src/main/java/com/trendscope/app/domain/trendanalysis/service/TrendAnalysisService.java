package com.trendscope.app.domain.trendanalysis.service;

import com.trendscope.app.domain.trendanalysis.dto.TrendAnalysisResponse;
import com.trendscope.app.domain.trendanalysis.repository.TrendAnalysisRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TrendAnalysisService {

    private final TrendAnalysisRepository trendAnalysisRepository;

    public TrendAnalysisService(TrendAnalysisRepository trendAnalysisRepository) {
        this.trendAnalysisRepository = trendAnalysisRepository;
    }

    @Transactional(readOnly = true)
    public TrendAnalysisResponse latestSummary() {
        double average = trendAnalysisRepository.findAll().stream()
                .mapToDouble(analysis -> analysis.getTrendScore())
                .average()
                .orElse(0);
        return new TrendAnalysisResponse(average);
    }
}
