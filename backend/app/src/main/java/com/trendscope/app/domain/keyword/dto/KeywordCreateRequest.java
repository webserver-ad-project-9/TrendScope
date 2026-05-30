package com.trendscope.app.domain.keyword.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "온보딩 키워드 생성 요청")
public record KeywordCreateRequest(
        @Schema(description = "사용자가 관심 있게 볼 뉴스 키워드", example = "AI 반도체")
        @NotBlank @Size(max = 80) String name
) {
}
