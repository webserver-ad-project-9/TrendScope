package com.trendscope.app.domain.trendanalysis.controller;

import com.trendscope.app.domain.trendanalysis.dto.TrendAnalysisResponse;
import com.trendscope.app.domain.trendanalysis.service.TrendAnalysisService;
import com.trendscope.app.global.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trend-analysis")
public class TrendAnalysisController {

    private final TrendAnalysisService trendAnalysisService;

    public TrendAnalysisController(TrendAnalysisService trendAnalysisService) {
        this.trendAnalysisService = trendAnalysisService;
    }

    @GetMapping("/summary")
    public ApiResponse<TrendAnalysisResponse> summary() {
        return ApiResponse.ok(trendAnalysisService.latestSummary());
    }
}
