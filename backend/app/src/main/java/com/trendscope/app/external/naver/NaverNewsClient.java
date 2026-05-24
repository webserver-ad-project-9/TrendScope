package com.trendscope.app.external.naver;

import com.trendscope.app.global.exception.BusinessException;
import com.trendscope.app.global.exception.ErrorCode;
import java.net.URI;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class NaverNewsClient {

    private final WebClient webClient;
    private final NaverNewsProperties properties;

    public NaverNewsClient(WebClient.Builder webClientBuilder, NaverNewsProperties properties) {
        this.webClient = webClientBuilder.build();
        this.properties = properties;
    }

    public NaverNewsResponse search(String keyword) {
        URI uri = UriComponentsBuilder.fromUriString(properties.baseUrl())
                .queryParam("query", keyword)
                .queryParam("display", 20)
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
}
