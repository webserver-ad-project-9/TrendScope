package com.trendscope.app.global.util;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public final class DateTimeUtils {

    private static final DateTimeFormatter NAVER_NEWS_FORMAT =
            DateTimeFormatter.ofPattern("EEE, dd MMM yyyy HH:mm:ss Z", Locale.ENGLISH);

    private DateTimeUtils() {
    }

    public static LocalDateTime parseNaverPubDate(String pubDate) {
        return ZonedDateTime.parse(pubDate, NAVER_NEWS_FORMAT)
                .withZoneSameInstant(ZoneId.of("Asia/Seoul"))
                .toLocalDateTime();
    }
}
