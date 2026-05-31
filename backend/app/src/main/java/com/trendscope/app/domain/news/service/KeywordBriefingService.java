package com.trendscope.app.domain.news.service;

import com.trendscope.app.domain.keyword.entity.Keyword;
import com.trendscope.app.domain.keyword.repository.KeywordRepository;
import com.trendscope.app.domain.news.dto.KeywordBriefingArticleResponse;
import com.trendscope.app.domain.news.dto.KeywordBriefingGroupResponse;
import com.trendscope.app.domain.news.dto.KeywordBriefingResponse;
import com.trendscope.app.domain.news.entity.NewsArticle;
import com.trendscope.app.domain.news.repository.NewsArticleRepository;
import com.trendscope.app.external.llm.LocalLlmClient;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class KeywordBriefingService {

    private static final int ARTICLE_COUNT_PER_KEYWORD = 4;
    private static final String SUMMARY_FALLBACK = "최근 해당 키워드의 주요 뉴스 흐름을 요약할 수 없습니다.";
    private static final ZoneId SERVICE_ZONE = ZoneId.of("Asia/Seoul");

    private final KeywordRepository keywordRepository;
    private final NewsArticleRepository newsArticleRepository;
    private final NewsCollectionService newsCollectionService;
    private final NewsSummaryPromptBuilder promptBuilder;
    private final LocalLlmClient localLlmClient;

    public KeywordBriefingService(KeywordRepository keywordRepository,
                                  NewsArticleRepository newsArticleRepository,
                                  NewsCollectionService newsCollectionService,
                                  NewsSummaryPromptBuilder promptBuilder,
                                  LocalLlmClient localLlmClient) {
        this.keywordRepository = keywordRepository;
        this.newsArticleRepository = newsArticleRepository;
        this.newsCollectionService = newsCollectionService;
        this.promptBuilder = promptBuilder;
        this.localLlmClient = localLlmClient;
    }

    public KeywordBriefingResponse createBriefing(UUID userId) {
        LocalDate today = LocalDate.now(SERVICE_ZONE);
        List<Keyword> keywords = keywordRepository.findByUserIdAndActiveTrueOrderByCreatedAtDesc(userId);
        if (keywords.isEmpty()) {
            return response(today, List.of());
        }

        List<KeywordBriefingGroupResponse> summaries = new ArrayList<>();

        for (Keyword keyword : keywords) {
            newsCollectionService.collect(keyword, ARTICLE_COUNT_PER_KEYWORD);

            List<NewsArticle> articles = newsArticleRepository
                    .findByKeywordOrderByPublishedAtDesc(
                            keyword,
                            PageRequest.of(0, ARTICLE_COUNT_PER_KEYWORD)
                    );

            String summary = summarizeKeyword(keyword.getName(), articles);
            List<KeywordBriefingArticleResponse> articleResponses = articles.stream()
                    .map(KeywordBriefingArticleResponse::from)
                    .toList();
            summaries.add(new KeywordBriefingGroupResponse(
                    keyword.getName(),
                    articleResponses.size(),
                    summary,
                    articleResponses
            ));
        }

        return response(today, summaries);
    }

    private KeywordBriefingResponse response(LocalDate date, List<KeywordBriefingGroupResponse> summaries) {
        int totalCount = summaries.stream()
                .mapToInt(KeywordBriefingGroupResponse::collectedCount)
                .sum();
        return new KeywordBriefingResponse(
                date,
                KeywordBriefingResponse.KEYWORD_GROUP_SUMMARY,
                totalCount,
                summaries
        );
    }

    private String summarizeKeyword(String keyword, List<NewsArticle> articles) {
        if (articles.isEmpty()) {
            return SUMMARY_FALLBACK;
        }
        List<String> titles = articles.stream()
                .map(NewsArticle::getTitle)
                .toList();
        try {
            return localLlmClient.summarize(promptBuilder.buildKeywordGroupSummary(keyword, titles));
        } catch (Exception exception) {
            return SUMMARY_FALLBACK;
        }
    }
}
