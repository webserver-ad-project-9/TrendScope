package com.trendscope.app.external.llm;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class LocalLlmPropertiesTest {

    @Test
    void usesDefaultLocalProxyWhenHostIsBlank() {
        LocalLlmProperties properties = new LocalLlmProperties(null, null, null, 0);

        assertEquals("http://localhost:8000", properties.normalizedBaseUrl());
        assertEquals("gemma-3-4b-it-gguf", properties.modelOrDefault());
        assertEquals(30000, properties.timeoutMsOrDefault());
    }

    @Test
    void addsHttpSchemeAndRemovesTrailingSlash() {
        LocalLlmProperties properties = new LocalLlmProperties(
                "localhost:9000/",
                null,
                "gemma-3-1b-it-gguf",
                60000
        );

        assertEquals("http://localhost:9000", properties.normalizedBaseUrl());
        assertEquals("gemma-3-1b-it-gguf", properties.modelOrDefault());
        assertEquals(60000, properties.timeoutMsOrDefault());
    }

    @Test
    void preservesExplicitHttpsScheme() {
        LocalLlmProperties properties = new LocalLlmProperties("https://llm.local/", null, null, 0);

        assertEquals("https://llm.local", properties.normalizedBaseUrl());
    }
}
