package com.trendscope.app.external.llm;

import com.trendscope.app.global.exception.BusinessException;
import com.trendscope.app.global.exception.ErrorCode;
import java.time.Duration;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class LocalLlmClient {

    private final WebClient webClient;
    private final LocalLlmProperties properties;

    public LocalLlmClient(WebClient.Builder webClientBuilder, LocalLlmProperties properties) {
        this.webClient = webClientBuilder.baseUrl(properties.normalizedBaseUrl()).build();
        this.properties = properties;
    }

    public String summarize(String prompt) {
        return complete(prompt);
    }

    public String complete(String prompt) {
        try {
            if (properties.isOllama()) {
                return summarizeWithOllama(prompt);
            }
            return summarizeWithOpenAiCompatibleApi(prompt);
        } catch (Exception exception) {
            throw new BusinessException(ErrorCode.AI_SUMMARY_FAILED);
        }
    }

    private String summarizeWithOllama(String prompt) {
        OllamaChatRequest request = new OllamaChatRequest(
                properties.model(),
                false,
                List.of(
                        new ChatMessage("system", "You summarize Korean news clearly and briefly."),
                        new ChatMessage("user", prompt)
                )
        );

        OllamaChatResponse response = webClient.post()
                .uri("/api/chat")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(OllamaChatResponse.class)
                .block(Duration.ofMillis(properties.timeoutMsOrDefault()));

        if (response == null || response.message() == null || response.message().content() == null) {
            throw new BusinessException(ErrorCode.AI_SUMMARY_FAILED);
        }
        return response.message().content().trim();
    }

    private String summarizeWithOpenAiCompatibleApi(String prompt) {
        OpenAiChatRequest request = new OpenAiChatRequest(
                properties.model(),
                List.of(
                        new ChatMessage("system", "You summarize Korean news clearly and briefly."),
                        new ChatMessage("user", prompt)
                ),
                0.2,
                700
        );

        OpenAiChatResponse response = webClient.post()
                .uri("/v1/chat/completions")
                .headers(headers -> setAuthorizationHeader(headers, properties.apiKey()))
                .bodyValue(request)
                .retrieve()
                .bodyToMono(OpenAiChatResponse.class)
                .block(Duration.ofMillis(properties.timeoutMsOrDefault()));

        if (response == null || response.choices() == null || response.choices().isEmpty()
                || response.choices().get(0).message() == null
                || response.choices().get(0).message().content() == null) {
            throw new BusinessException(ErrorCode.AI_SUMMARY_FAILED);
        }
        return response.choices().get(0).message().content().trim();
    }

    private void setAuthorizationHeader(HttpHeaders headers, String apiKey) {
        if (apiKey != null && !apiKey.isBlank()) {
            headers.setBearerAuth(apiKey);
        }
    }

    private record ChatMessage(String role, String content) {
    }

    private record OllamaChatRequest(String model, boolean stream, List<ChatMessage> messages) {
    }

    private record OllamaChatResponse(ChatMessage message) {
    }

    private record OpenAiChatRequest(
            String model,
            List<ChatMessage> messages,
            double temperature,
            int max_tokens
    ) {
    }

    private record OpenAiChoice(ChatMessage message) {
    }

    private record OpenAiChatResponse(List<OpenAiChoice> choices) {
    }
}
