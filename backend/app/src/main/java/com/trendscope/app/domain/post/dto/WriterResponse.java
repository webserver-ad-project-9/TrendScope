package com.trendscope.app.domain.post.dto;

import com.trendscope.app.domain.user.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(description = "작성자 응답")
public record WriterResponse(
        @Schema(description = "작성자 ID", example = "4f4f9a2d-22e3-4b4e-8d01-83f9959dfc71")
        UUID id,
        @Schema(description = "작성자 이름", example = "홍길동")
        String name
) {
    public static WriterResponse from(User user) {
        return new WriterResponse(user.getId(), user.getName());
    }
}
