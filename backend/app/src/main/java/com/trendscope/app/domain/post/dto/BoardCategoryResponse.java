package com.trendscope.app.domain.post.dto;

import com.trendscope.app.domain.post.entity.BoardCategory;

public record BoardCategoryResponse(
        BoardCategory code,
        String label
) {
    public static BoardCategoryResponse from(BoardCategory category) {
        return new BoardCategoryResponse(category, category.getLabel());
    }
}
