package com.trendscope.app.external.llm;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "trendpulse.llm")
public record LocalLlmProperties(
        String host,
        String apiKey,
        String model,
        long timeoutMs
) {
    private static final String DEFAULT_BASE_URL = "http://localhost:8000";
    private static final String DEFAULT_MODEL = "gemma-3-4b-it-gguf";

    public String normalizedBaseUrl() {
        if (host == null || host.isBlank()) {
            return DEFAULT_BASE_URL;
        }

        String normalizedHost = host.trim();
        if (!normalizedHost.startsWith("http://") && !normalizedHost.startsWith("https://")) {
            normalizedHost = "http://" + normalizedHost;
        }

        return normalizedHost.endsWith("/")
                ? normalizedHost.substring(0, normalizedHost.length() - 1)
                : normalizedHost;
    }

    public String modelOrDefault() {
        return model == null || model.isBlank() ? DEFAULT_MODEL : model;
    }

    public long timeoutMsOrDefault() {
        return timeoutMs > 0 ? timeoutMs : 30000;
    }
}
