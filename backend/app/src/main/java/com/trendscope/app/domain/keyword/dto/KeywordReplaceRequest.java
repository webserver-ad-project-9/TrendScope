package com.trendscope.app.domain.keyword.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

@Schema(description = "마이페이지 키워드 목록 교체 요청")
public record KeywordReplaceRequest(
        @Schema(description = "저장 후 유지할 전체 관심 키워드 목록", example = "[\"AI 반도체\", \"엔비디아\"]")
        @JsonAlias("keywords")
        @NotEmpty
        @Size(max = 6)
        List<@NotBlank @Size(max = 80) String> names
) {
}
