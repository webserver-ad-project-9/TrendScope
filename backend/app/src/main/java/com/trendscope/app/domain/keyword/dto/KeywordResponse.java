package com.trendscope.app.domain.keyword.dto;

import com.trendscope.app.domain.keyword.entity.Keyword;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(description = "온보딩 키워드 응답")
public record KeywordResponse(
        @Schema(description = "키워드 ID", example = "6f84a524-9621-4d58-a454-75c84a8c5bb8")
        UUID id,
        @Schema(description = "키워드명", example = "AI 반도체")
        String name
) {
    public static KeywordResponse from(Keyword keyword) {
        return new KeywordResponse(keyword.getId(), keyword.getName());
    }
}
