package com.trendscope.app.domain.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "JWT Access Token 응답")
public record TokenResponse(
        @Schema(description = "JWT Access Token", example = "eyJhbGciOiJIUzI1NiJ9...")
        String accessToken,
        @Schema(description = "토큰 타입", example = "Bearer")
        String tokenType
) {
    public static TokenResponse bearer(String accessToken) {
        return new TokenResponse(accessToken, "Bearer");
    }
}
