package com.trendscope.app.domain.post.controller;

import com.trendscope.app.domain.post.dto.PostCreateRequest;
import com.trendscope.app.domain.post.dto.PostDetailResponse;
import com.trendscope.app.domain.post.dto.PostListResponse;
import com.trendscope.app.domain.post.dto.PostResponse;
import com.trendscope.app.domain.post.dto.PostUpdateRequest;
import com.trendscope.app.domain.post.entity.BoardCategory;
import com.trendscope.app.domain.post.service.PostService;
import com.trendscope.app.global.response.ApiResponse;
import com.trendscope.app.global.response.PageResponse;
import com.trendscope.app.global.security.principal.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts")
@Tag(name = "Post", description = "카테고리 게시판 게시글 API")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "게시글 작성", description = "카테고리 게시판에 게시글을 작성합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "게시글 작성 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "요청값 검증 실패")
    })
    public ApiResponse<PostResponse> create(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails principal,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "게시글 작성 요청",
                    required = true,
                    content = @Content(schema = @Schema(implementation = PostCreateRequest.class))
            )
            @Valid @RequestBody PostCreateRequest request) {
        return ApiResponse.ok(postService.create(principal.userId(), request));
    }

    @GetMapping
    @Operation(summary = "게시글 목록 조회", description = "카테고리별 게시글 목록을 최신순으로 조회합니다.")
    public ApiResponse<PageResponse<PostListResponse>> findPosts(
            @RequestParam(required = false) BoardCategory category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails principal
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        UUID currentUserId = principal == null ? null : principal.userId();
        return ApiResponse.ok(postService.findPosts(category, pageable, currentUserId));
    }

    @GetMapping("/{postId}")
    @Operation(summary = "게시글 상세 조회", description = "게시글 상세를 조회하고 조회수를 증가시킵니다.")
    public ApiResponse<PostDetailResponse> findDetail(
            @PathVariable UUID postId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails principal
    ) {
        UUID currentUserId = principal == null ? null : principal.userId();
        return ApiResponse.ok(postService.findDetail(postId, currentUserId));
    }

    @PatchMapping("/{postId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "게시글 수정", description = "작성자만 게시글을 수정할 수 있습니다.")
    public ApiResponse<PostDetailResponse> update(
            @PathVariable UUID postId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody PostUpdateRequest request
    ) {
        return ApiResponse.ok(postService.update(postId, principal.userId(), request));
    }

    @DeleteMapping("/{postId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "게시글 삭제", description = "작성자만 게시글을 삭제할 수 있습니다.")
    public ApiResponse<Void> delete(
            @PathVariable UUID postId,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails principal
    ) {
        postService.delete(postId, principal.userId());
        return ApiResponse.ok();
    }
}
