package com.trendscope.app.external.naver;

import com.trendscope.app.global.exception.BusinessException;
import com.trendscope.app.global.exception.ErrorCode;
import java.net.URI;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class NaverNewsClient {

    private static final int DEFAULT_DISPLAY_COUNT = 20;
    private static final int MAX_DISPLAY_COUNT = 100;

    private final WebClient webClient;
    private final NaverNewsProperties properties;

    public NaverNewsClient(WebClient.Builder webClientBuilder, NaverNewsProperties properties) {
        this.webClient = webClientBuilder.build();
        this.properties = properties;
    }

    public NaverNewsResponse search(String keyword) {
        return search(keyword, DEFAULT_DISPLAY_COUNT);
    }

    public NaverNewsResponse search(String keyword, int displayCount) {
        URI uri = UriComponentsBuilder.fromUriString(properties.baseUrl())
                .queryParam("query", keyword)
                .queryParam("display", normalizeDisplayCount(displayCount))
                .queryParam("sort", "date")
                .build()
                .encode()
                .toUri();
        try {
            return webClient.get()
                    .uri(uri)
                    .header("X-Naver-Client-Id", properties.clientId())
                    .header("X-Naver-Client-Secret", properties.clientSecret())
                    .retrieve()
                    .bodyToMono(NaverNewsResponse.class)
                    .block();
        } catch (Exception exception) {
            throw new BusinessException(ErrorCode.NAVER_API_REQUEST_FAILED);
        }
    }

    private int normalizeDisplayCount(int displayCount) {
        if (displayCount < 1) {
            return DEFAULT_DISPLAY_COUNT;
        }
        return Math.min(displayCount, MAX_DISPLAY_COUNT);
    }
}
