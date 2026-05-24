package com.trendscope.app.domain.post.controller;

import com.trendscope.app.domain.post.dto.PostCreateRequest;
import com.trendscope.app.domain.post.dto.PostResponse;
import com.trendscope.app.domain.post.service.PostService;
import com.trendscope.app.global.response.ApiResponse;
import com.trendscope.app.global.security.principal.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
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
}
