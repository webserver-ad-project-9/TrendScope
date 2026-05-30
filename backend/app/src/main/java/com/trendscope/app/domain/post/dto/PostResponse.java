package com.trendscope.app.domain.post.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(description = "게시글 응답")
public record PostResponse(
        @Schema(description = "게시글 ID", example = "e68a755c-7b2c-4e32-a691-c22faf9944ea")
        UUID id
) {
}
