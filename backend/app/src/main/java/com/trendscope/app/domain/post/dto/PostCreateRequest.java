package com.trendscope.app.domain.post.dto;

import com.trendscope.app.domain.post.entity.BoardCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(description = "게시글 작성 요청")
public record PostCreateRequest(
        @Schema(description = "게시판 카테고리", example = "IT_SCIENCE")
        @NotNull BoardCategory category,
        @Schema(description = "게시글 제목", example = "AI 반도체 뉴스가 급증하고 있습니다")
        @NotBlank @Size(max = 150) String title,
        @Schema(description = "게시글 본문", example = "대시보드에서 AI 반도체 키워드 트렌드가 상승하는 것이 보여 공유합니다.")
        @NotBlank String content
) {
}
