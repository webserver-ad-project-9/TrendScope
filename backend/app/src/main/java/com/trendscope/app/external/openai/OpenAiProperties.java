package com.trendscope.app.external.openai;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "trendpulse.openai")
public record OpenAiProperties(
        String baseUrl,
        String apiKey,
        String model
) {
}
