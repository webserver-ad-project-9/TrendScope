package com.trendscope.app.domain.news.controller;

import com.trendscope.app.domain.news.dto.NewsArticleResponse;
import com.trendscope.app.domain.news.dto.KeywordBriefingResponse;
import com.trendscope.app.domain.news.dto.NewsRecommendationResponse;
import com.trendscope.app.domain.news.dto.NewsSummaryRequest;
import com.trendscope.app.domain.news.dto.NewsSummaryResponse;
import com.trendscope.app.domain.news.service.KeywordBriefingService;
import com.trendscope.app.domain.news.service.NewsRecommendationService;
import com.trendscope.app.domain.news.service.NewsService;
import com.trendscope.app.domain.news.service.NewsSummaryService;
import com.trendscope.app.global.response.ApiResponse;
import com.trendscope.app.global.security.principal.CustomUserDetails;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService newsService;
    private final NewsSummaryService newsSummaryService;
    private final NewsRecommendationService newsRecommendationService;
    private final KeywordBriefingService keywordBriefingService;

    public NewsController(NewsService newsService, NewsSummaryService newsSummaryService,
                          NewsRecommendationService newsRecommendationService,
                          KeywordBriefingService keywordBriefingService) {
        this.newsService = newsService;
        this.newsSummaryService = newsSummaryService;
        this.newsRecommendationService = newsRecommendationService;
        this.keywordBriefingService = keywordBriefingService;
    }

    @GetMapping("/latest")
    public ApiResponse<List<NewsArticleResponse>> latest() {
        return ApiResponse.ok(newsService.findLatest());
    }

    @PostMapping("/{newsId}/summary")
    public ApiResponse<NewsSummaryResponse> summarizeOne(@PathVariable UUID newsId) {
        return ApiResponse.ok(newsSummaryService.summarizeOne(newsId));
    }

    @PostMapping("/summary")
    public ApiResponse<NewsSummaryResponse> summarize(@Valid @RequestBody NewsSummaryRequest request) {
        return ApiResponse.ok(newsSummaryService.summarize(request.newsIds(), request.sentenceCount()));
    }

    @GetMapping("/recommendations")
    public ApiResponse<NewsRecommendationResponse> recommendations(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestParam(defaultValue = "false") boolean refresh,
            @RequestParam(required = false) Integer limit) {
        return ApiResponse.ok(newsRecommendationService.recommend(principal.userId(), refresh, limit));
    }

    @GetMapping("/keyword-briefings")
    public ApiResponse<KeywordBriefingResponse> keywordBriefings(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ApiResponse.ok(keywordBriefingService.createBriefing(principal.userId()));
    }
}
