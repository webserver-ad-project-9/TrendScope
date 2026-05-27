package com.trendscope.app.domain.news.service;

import com.trendscope.app.domain.news.entity.NewsArticle;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class NewsSummaryPromptBuilder {

    public String build(List<NewsArticle> articles, int sentenceCount) {
        StringBuilder builder = new StringBuilder();
        builder.append("아래 뉴스들을 한국어로 ")
                .append(sentenceCount)
                .append("문장 이내로 요약해줘.\n")
                .append("중복 내용은 합치고, 핵심 이슈와 흐름을 먼저 말해줘.\n")
                .append("추측하지 말고 제공된 제목과 설명만 근거로 사용해줘.\n\n");

        for (int i = 0; i < articles.size(); i++) {
            NewsArticle article = articles.get(i);
            builder.append("[뉴스 ")
                    .append(i + 1)
                    .append("]\n")
                    .append("제목: ")
                    .append(article.getTitle())
                    .append("\n")
                    .append("설명: ")
                    .append(article.getDescription() == null ? "" : article.getDescription())
                    .append("\n")
                    .append("URL: ")
                    .append(article.getOriginUrl())
                    .append("\n\n");
        }
        return builder.toString();
    }
}
