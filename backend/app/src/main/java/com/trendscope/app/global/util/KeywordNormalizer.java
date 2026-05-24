package com.trendscope.app.global.util;

import java.util.Locale;

public final class KeywordNormalizer {

    private KeywordNormalizer() {
    }

    public static String normalize(String keyword) {
        if (keyword == null) {
            return "";
        }
        return keyword.trim().replaceAll("\\s+", " ").toLowerCase(Locale.ROOT);
    }
}
