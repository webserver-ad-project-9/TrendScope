package com.trendscope.app.domain.news.controller;

import com.trendscope.app.domain.news.dto.NewsArticleResponse;
import com.trendscope.app.domain.news.dto.DailyNewsCountResponse;
import com.trendscope.app.domain.news.dto.KeywordBriefingResponse;
import com.trendscope.app.domain.news.dto.KeywordFrequencyResponse;
import com.trendscope.app.domain.news.dto.NewsClusterResponse;
import com.trendscope.app.domain.news.dto.NewsRecommendationResponse;
import com.trendscope.app.domain.news.dto.NewsSentimentResponse;
import com.trendscope.app.domain.news.dto.NewsSummaryRequest;
import com.trendscope.app.domain.news.dto.NewsSummaryResponse;
import com.trendscope.app.domain.news.dto.NewsTrendScoreResponse;
import com.trendscope.app.domain.news.dto.SuggestedKeywordResponse;
import com.trendscope.app.domain.news.dto.TodayIssueResponse;
import com.trendscope.app.domain.news.service.KeywordBriefingService;
import com.trendscope.app.domain.news.service.KeywordFrequencyService;
import com.trendscope.app.domain.news.service.NewsDashboardService;
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
    private final KeywordFrequencyService keywordFrequencyService;
    private final NewsDashboardService newsDashboardService;

    public NewsController(NewsService newsService, NewsSummaryService newsSummaryService,
                          NewsRecommendationService newsRecommendationService,
                          KeywordBriefingService keywordBriefingService,
                          KeywordFrequencyService keywordFrequencyService,
                          NewsDashboardService newsDashboardService) {
        this.newsService = newsService;
        this.newsSummaryService = newsSummaryService;
        this.newsRecommendationService = newsRecommendationService;
        this.keywordBriefingService = keywordBriefingService;
        this.keywordFrequencyService = keywordFrequencyService;
        this.newsDashboardService = newsDashboardService;
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

    @GetMapping("/keyword-frequency")
    public ApiResponse<KeywordFrequencyResponse> keywordFrequency(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestParam(required = false) Integer limit) {
        return ApiResponse.ok(keywordFrequencyService.analyze(principal.userId(), limit));
    }

    @GetMapping("/trend-scores")
    public ApiResponse<NewsTrendScoreResponse> trendScores(@AuthenticationPrincipal CustomUserDetails principal) {
        return ApiResponse.ok(newsDashboardService.trendScores(principal.userId()));
    }

    @GetMapping("/today-issues")
    public ApiResponse<TodayIssueResponse> todayIssues(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestParam(required = false) Integer limit) {
        return ApiResponse.ok(newsDashboardService.todayIssues(principal.userId(), limit));
    }

    @GetMapping("/suggested-keywords")
    public ApiResponse<SuggestedKeywordResponse> suggestedKeywords(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestParam(required = false) Integer limit) {
        return ApiResponse.ok(newsDashboardService.suggestedKeywords(principal.userId(), limit));
    }

    @GetMapping("/statistics/daily-counts")
    public ApiResponse<DailyNewsCountResponse> dailyCounts(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestParam(required = false) Integer days) {
        return ApiResponse.ok(newsDashboardService.dailyCounts(principal.userId(), days));
    }

    @GetMapping("/clusters")
    public ApiResponse<NewsClusterResponse> clusters(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestParam(required = false) Integer limit) {
        return ApiResponse.ok(newsDashboardService.clusters(principal.userId(), limit));
    }

    @GetMapping("/sentiments")
    public ApiResponse<NewsSentimentResponse> sentiments(@AuthenticationPrincipal CustomUserDetails principal) {
        return ApiResponse.ok(newsDashboardService.sentiments(principal.userId()));
    }
}
