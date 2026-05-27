package com.trendscope.app.domain.comment.controller;

import com.trendscope.app.domain.comment.dto.CommentCreateRequest;
import com.trendscope.app.domain.comment.dto.CommentResponse;
import com.trendscope.app.domain.comment.dto.CommentUpdateRequest;
import com.trendscope.app.domain.comment.service.CommentService;
import com.trendscope.app.global.response.ApiResponse;
import com.trendscope.app.global.security.principal.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Comment", description = "게시글 댓글 API")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/api/posts/{postId}/comments")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "댓글 작성", description = "로그인한 사용자가 게시글에 댓글을 작성합니다.")
    public ApiResponse<CommentResponse> create(
            @PathVariable UUID postId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody CommentCreateRequest request
    ) {
        return ApiResponse.ok(commentService.create(postId, principal.userId(), request));
    }

    @GetMapping("/api/posts/{postId}/comments")
    @Operation(summary = "댓글 목록 조회", description = "게시글의 댓글 목록을 오래된 순으로 조회합니다.")
    public ApiResponse<List<CommentResponse>> findByPost(
            @PathVariable UUID postId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails principal
    ) {
        UUID currentUserId = principal == null ? null : principal.userId();
        return ApiResponse.ok(commentService.findByPost(postId, currentUserId));
    }

    @PatchMapping("/api/comments/{commentId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "댓글 수정", description = "작성자만 댓글을 수정할 수 있습니다.")
    public ApiResponse<CommentResponse> update(
            @PathVariable UUID commentId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody CommentUpdateRequest request
    ) {
        return ApiResponse.ok(commentService.update(commentId, principal.userId(), request));
    }

    @DeleteMapping("/api/comments/{commentId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "댓글 삭제", description = "작성자만 댓글을 삭제할 수 있습니다.")
    public ApiResponse<Void> delete(
            @PathVariable UUID commentId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails principal
    ) {
        commentService.delete(commentId, principal.userId());
        return ApiResponse.ok();
    }
}
