package com.trendscope.app.external.openai;

import com.trendscope.app.global.exception.BusinessException;
import com.trendscope.app.global.exception.ErrorCode;
import org.springframework.stereotype.Component;

@Component
public class OpenAiClient {

    private final OpenAiProperties properties;

    public OpenAiClient(OpenAiProperties properties) {
        this.properties = properties;
    }

    public String summarize(String prompt) {
        if (properties.apiKey() == null || properties.apiKey().isBlank()) {
            throw new BusinessException(ErrorCode.AI_SUMMARY_FAILED);
        }
        return "AI summary integration placeholder";
    }
}
