package com.trendscope.app.domain.keyword.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

@Schema(description = "온보딩 키워드 일괄 생성 요청")
public record KeywordBulkCreateRequest(
        @Schema(description = "사용자가 선택한 관심 키워드 목록", example = "[\"AI 반도체\", \"경제\", \"스포츠\"]")
        @NotEmpty
        @Size(max = 20)
        List<@NotBlank @Size(max = 80) String> names
) {
}
