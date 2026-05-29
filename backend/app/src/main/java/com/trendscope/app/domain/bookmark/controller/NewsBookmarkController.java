package com.trendscope.app.domain.bookmark.controller;

import com.trendscope.app.domain.bookmark.dto.NewsBookmarkResponse;
import com.trendscope.app.domain.bookmark.service.NewsBookmarkService;
import com.trendscope.app.global.response.ApiResponse;
import com.trendscope.app.global.security.principal.CustomUserDetails;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/news")
public class NewsBookmarkController {

    private final NewsBookmarkService newsBookmarkService;

    public NewsBookmarkController(NewsBookmarkService newsBookmarkService) {
        this.newsBookmarkService = newsBookmarkService;
    }

    @PostMapping("/{newsId}/bookmarks")
    public ApiResponse<NewsBookmarkResponse> create(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PathVariable UUID newsId) {
        return ApiResponse.ok(newsBookmarkService.create(principal.userId(), newsId));
    }

    @GetMapping("/bookmarks")
    public ApiResponse<List<NewsBookmarkResponse>> findMine(@AuthenticationPrincipal CustomUserDetails principal) {
        return ApiResponse.ok(newsBookmarkService.findMine(principal.userId()));
    }

    @DeleteMapping("/{newsId}/bookmarks")
    public ApiResponse<Void> delete(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PathVariable UUID newsId) {
        newsBookmarkService.delete(principal.userId(), newsId);
        return ApiResponse.ok();
    }
}
