package com.trendscope.app.domain.post.controller;

import com.trendscope.app.domain.post.dto.BoardCategoryResponse;
import com.trendscope.app.domain.post.entity.BoardCategory;
import com.trendscope.app.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Arrays;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Board Category", description = "커뮤니티 게시판 카테고리 API")
public class BoardCategoryController {

    @GetMapping("/api/community/categories")
    @Operation(summary = "게시판 카테고리 목록 조회", description = "커뮤니티 게시판에서 사용하는 카테고리 목록을 조회합니다.")
    public ApiResponse<List<BoardCategoryResponse>> findCategories() {
        return ApiResponse.ok(Arrays.stream(BoardCategory.values())
                .map(BoardCategoryResponse::from)
                .toList());
    }
}
