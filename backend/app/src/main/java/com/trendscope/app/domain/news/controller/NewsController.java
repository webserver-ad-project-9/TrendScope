package com.trendscope.app.domain.news.controller;

import com.trendscope.app.domain.news.dto.NewsArticleResponse;
import com.trendscope.app.domain.news.service.NewsService;
import com.trendscope.app.global.response.ApiResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping("/latest")
    public ApiResponse<List<NewsArticleResponse>> latest() {
        return ApiResponse.ok(newsService.findLatest());
    }
}
