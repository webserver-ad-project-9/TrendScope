package com.trendscope.app.global.config;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import org.junit.jupiter.api.Test;

class CorsPropertiesTest {

    @Test
    void usesDefaultAllowedOriginWhenOriginsAreBlank() {
        CorsProperties properties = new CorsProperties(List.of("", " "));

        assertEquals(List.of("http://localhost:3000"), properties.allowedOriginsOrDefault());
    }

    @Test
    void removesBlankOriginsAndTrimsConfiguredOrigins() {
        CorsProperties properties = new CorsProperties(List.of(
                " http://localhost:3000 ",
                "",
                "https://trend-scope-seven.vercel.app"
        ));

        assertEquals(
                List.of("http://localhost:3000", "https://trend-scope-seven.vercel.app"),
                properties.allowedOriginsOrDefault()
        );
    }
}
