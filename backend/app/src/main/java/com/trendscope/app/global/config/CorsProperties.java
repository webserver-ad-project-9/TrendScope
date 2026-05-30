package com.trendscope.app.global.config;

import java.util.List;
import java.util.Objects;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "trendpulse.cors")
public record CorsProperties(
        List<String> allowedOrigins
) {
    private static final List<String> DEFAULT_ALLOWED_ORIGINS = List.of("http://localhost:3000");

    public List<String> allowedOriginsOrDefault() {
        if (allowedOrigins == null) {
            return DEFAULT_ALLOWED_ORIGINS;
        }

        List<String> normalizedOrigins = allowedOrigins.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toList();

        return normalizedOrigins.isEmpty() ? DEFAULT_ALLOWED_ORIGINS : normalizedOrigins;
    }
}
