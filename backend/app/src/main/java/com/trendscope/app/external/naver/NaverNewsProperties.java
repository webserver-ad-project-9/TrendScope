package com.trendscope.app.external.naver;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "trendpulse.naver")
public record NaverNewsProperties(
        String baseUrl,
        String clientId,
        String clientSecret
) {
}
