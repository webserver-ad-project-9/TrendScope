package com.trendscope.app.domain.like.controller;

import com.trendscope.app.domain.like.dto.LikeResponse;
import com.trendscope.app.domain.like.service.PostLikeService;
import com.trendscope.app.global.response.ApiResponse;
import com.trendscope.app.global.security.principal.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Post Like", description = "게시글 좋아요 API")
public class PostLikeController {

    private final PostLikeService postLikeService;

    public PostLikeController(PostLikeService postLikeService) {
        this.postLikeService = postLikeService;
    }

    @PostMapping("/api/posts/{postId}/likes")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "게시글 좋아요", description = "로그인한 사용자가 게시글에 좋아요를 누릅니다.")
    public ApiResponse<LikeResponse> like(
            @PathVariable UUID postId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails principal
    ) {
        return ApiResponse.ok(postLikeService.like(postId, principal.userId()));
    }

    @DeleteMapping("/api/posts/{postId}/likes")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "게시글 좋아요 취소", description = "로그인한 사용자가 게시글 좋아요를 취소합니다.")
    public ApiResponse<LikeResponse> unlike(
            @PathVariable UUID postId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails principal
    ) {
        return ApiResponse.ok(postLikeService.unlike(postId, principal.userId()));
    }
}
