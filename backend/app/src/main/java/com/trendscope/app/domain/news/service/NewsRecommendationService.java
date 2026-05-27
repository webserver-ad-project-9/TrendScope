package com.trendscope.app.domain.news.service;

import com.trendscope.app.domain.keyword.entity.Keyword;
import com.trendscope.app.domain.keyword.repository.KeywordRepository;
import com.trendscope.app.domain.news.dto.NewsRecommendationKeywordResponse;
import com.trendscope.app.domain.news.dto.NewsRecommendationResponse;
import com.trendscope.app.domain.news.dto.RecommendedNewsResponse;
import com.trendscope.app.domain.news.repository.NewsArticleRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NewsRecommendationService {

    private static final int DEFAULT_LIMIT = 20;
    private static final int MAX_LIMIT = 50;

    private final KeywordRepository keywordRepository;
    private final NewsArticleRepository newsArticleRepository;
    private final NewsCollectionService newsCollectionService;

    public NewsRecommendationService(KeywordRepository keywordRepository,
                                     NewsArticleRepository newsArticleRepository,
                                     NewsCollectionService newsCollectionService) {
        this.keywordRepository = keywordRepository;
        this.newsArticleRepository = newsArticleRepository;
        this.newsCollectionService = newsCollectionService;
    }

    public NewsRecommendationResponse recommend(UUID userId, boolean refresh, Integer limit) {
        List<Keyword> keywords = keywordRepository.findByUserIdAndActiveTrueOrderByCreatedAtDesc(userId);
        if (keywords.isEmpty()) {
            return new NewsRecommendationResponse(List.of(), List.of(), false);
        }

        if (refresh) {
            keywords.forEach(newsCollectionService::collect);
        }

        int size = normalizeLimit(limit);
        List<RecommendedNewsResponse> articles = newsArticleRepository
                .findByKeywordInOrderByPublishedAtDesc(keywords, PageRequest.of(0, size))
                .stream()
                .map(RecommendedNewsResponse::from)
                .toList();

        List<NewsRecommendationKeywordResponse> keywordResponses = keywords.stream()
                .map(NewsRecommendationKeywordResponse::from)
                .toList();

        return new NewsRecommendationResponse(keywordResponses, articles, refresh);
    }

    private int normalizeLimit(Integer limit) {
        if (limit == null || limit < 1) {
            return DEFAULT_LIMIT;
        }
        return Math.min(limit, MAX_LIMIT);
    }
}
