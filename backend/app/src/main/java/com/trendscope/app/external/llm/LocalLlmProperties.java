package com.trendscope.app.external.llm;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "trendpulse.llm")
public record LocalLlmProperties(
        String provider,
        String baseUrl,
        String apiKey,
        String model,
        long timeoutMs
) {
    public boolean isOllama() {
        return "ollama".equalsIgnoreCase(provider);
    }

    public String normalizedBaseUrl() {
        if (baseUrl == null || baseUrl.isBlank()) {
            return "http://localhost:11434";
        }
        return baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
    }

    public long timeoutMsOrDefault() {
        return timeoutMs > 0 ? timeoutMs : 30000;
    }
}
