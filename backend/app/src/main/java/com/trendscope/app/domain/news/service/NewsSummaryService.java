package com.trendscope.app.domain.news.service;

import com.trendscope.app.domain.news.dto.NewsSummaryResponse;
import com.trendscope.app.domain.news.dto.NewsSummarySourceResponse;
import com.trendscope.app.domain.news.entity.NewsArticle;
import com.trendscope.app.domain.news.repository.NewsArticleRepository;
import com.trendscope.app.external.llm.LocalLlmClient;
import com.trendscope.app.global.exception.BusinessException;
import com.trendscope.app.global.exception.ErrorCode;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class NewsSummaryService {

    private static final int SINGLE_SUMMARY_SENTENCE_COUNT = 3;

    private final NewsArticleRepository newsArticleRepository;
    private final NewsSummaryPromptBuilder promptBuilder;
    private final LocalLlmClient localLlmClient;

    public NewsSummaryService(NewsArticleRepository newsArticleRepository,
                              NewsSummaryPromptBuilder promptBuilder,
                              LocalLlmClient localLlmClient) {
        this.newsArticleRepository = newsArticleRepository;
        this.promptBuilder = promptBuilder;
        this.localLlmClient = localLlmClient;
    }

    public NewsSummaryResponse summarizeOne(UUID newsId) {
        return summarize(List.of(newsId), SINGLE_SUMMARY_SENTENCE_COUNT);
    }

    public NewsSummaryResponse summarize(List<UUID> newsIds, int sentenceCount) {
        List<NewsArticle> articles = newsArticleRepository.findAllById(newsIds);
        if (articles.size() != newsIds.size()) {
            throw new BusinessException(ErrorCode.NEWS_ARTICLE_NOT_FOUND);
        }

        List<NewsArticle> orderedArticles = articles.stream()
                .sorted(Comparator.comparing(article -> newsIds.indexOf(article.getId())))
                .toList();

        String prompt = promptBuilder.build(orderedArticles, sentenceCount);
        String summary = localLlmClient.summarize(prompt);
        List<NewsSummarySourceResponse> sources = orderedArticles.stream()
                .map(NewsSummarySourceResponse::from)
                .toList();

        return new NewsSummaryResponse(newsIds, summary, sources);
    }
}
