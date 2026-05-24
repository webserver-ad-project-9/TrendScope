package com.trendscope.app.domain.user.dto;

import com.trendscope.app.domain.user.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(description = "현재 사용자 프로필 응답")
public record UserProfileResponse(
        @Schema(description = "사용자 ID", example = "4f4f9a2d-22e3-4b4e-8d01-83f9959dfc71")
        UUID id,
        @Schema(description = "Google OAuth 이메일", example = "user@example.com")
        String email,
        @Schema(description = "Google OAuth name", example = "홍길동")
        String name,
        @Schema(description = "사용자 권한", example = "USER")
        String role
) {
    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(user.getId(), user.getEmail(), user.getName(), user.getRole().name());
    }
}
