package com.trendscope.app.domain.post.dto;

import com.trendscope.app.domain.post.entity.BoardCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PostUpdateRequest(
        @NotNull BoardCategory category,
        @NotBlank @Size(max = 150) String title,
        @NotBlank String content
) {
}
