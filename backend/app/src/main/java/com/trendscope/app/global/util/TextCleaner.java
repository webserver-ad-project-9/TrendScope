package com.trendscope.app.global.util;

public final class TextCleaner {

    private TextCleaner() {
    }

    public static String cleanNewsText(String text) {
        if (text == null) {
            return "";
        }
        return text.replaceAll("<[^>]*>", "").replace("&quot;", "\"").replace("&amp;", "&").trim();
    }
}
