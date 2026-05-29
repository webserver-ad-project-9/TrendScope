package com.trendscope.app.domain.news.service;

import com.trendscope.app.domain.keyword.entity.Keyword;
import com.trendscope.app.domain.keyword.repository.KeywordRepository;
import com.trendscope.app.domain.news.dto.KeywordFrequencyItemResponse;
import com.trendscope.app.domain.news.dto.KeywordFrequencyResponse;
import com.trendscope.app.domain.news.entity.NewsArticle;
import com.trendscope.app.domain.news.repository.NewsArticleRepository;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class KeywordFrequencyService {

    private static final int DEFAULT_LIMIT = 20;
    private static final int MAX_LIMIT = 50;
    private static final int ARTICLE_SCAN_LIMIT = 100;
    private static final Pattern TOKEN_SPLITTER = Pattern.compile("[^가-힣a-zA-Z0-9]+");
    private static final Set<String> STOPWORDS = Set.of(
            "관련", "기자", "뉴스", "오늘", "이번", "지난", "위해", "대해", "통해", "등",
            "있는", "없는", "있다", "한다", "했다", "에서", "으로", "까지", "부터", "보다", "다시",
            "시장", "전망", "기록", "최고", "기대", "상승", "하락", "종합", "이슈", "ai"
    );

    private final KeywordRepository keywordRepository;
    private final NewsArticleRepository newsArticleRepository;

    public KeywordFrequencyService(KeywordRepository keywordRepository,
                                   NewsArticleRepository newsArticleRepository) {
        this.keywordRepository = keywordRepository;
        this.newsArticleRepository = newsArticleRepository;
    }

    public KeywordFrequencyResponse analyze(UUID userId, Integer limit) {
        List<Keyword> keywords = keywordRepository.findByUserIdAndActiveTrueOrderByCreatedAtDesc(userId);
        if (keywords.isEmpty()) {
            return new KeywordFrequencyResponse(0, List.of());
        }

        List<NewsArticle> articles = newsArticleRepository.findByKeywordInOrderByPublishedAtDesc(
                keywords,
                PageRequest.of(0, ARTICLE_SCAN_LIMIT)
        );

        Map<String, Integer> counts = new HashMap<>();
        Set<String> userKeywordTerms = userKeywordTerms(keywords);
        for (NewsArticle article : articles) {
            countTokens(article.getTitle(), counts, userKeywordTerms);
            countTokens(article.getDescription(), counts, userKeywordTerms);
        }

        int maxCount = counts.values().stream()
                .max(Integer::compareTo)
                .orElse(0);
        List<KeywordFrequencyItemResponse> frequencyItems = counts.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue(Comparator.reverseOrder())
                        .thenComparing(Map.Entry.comparingByKey()))
                .limit(normalizeLimit(limit))
                .map(entry -> new KeywordFrequencyItemResponse(
                        entry.getKey(),
                        entry.getValue(),
                        maxCount == 0 ? 0 : Math.round((entry.getValue() * 1000.0 / maxCount)) / 10.0
                ))
                .toList();

        return new KeywordFrequencyResponse(articles.size(), frequencyItems);
    }

    private Set<String> userKeywordTerms(List<Keyword> keywords) {
        Set<String> terms = new HashSet<>();
        for (Keyword keyword : keywords) {
            Arrays.stream(TOKEN_SPLITTER.split(keyword.getName()))
                    .filter(token -> !token.isBlank())
                    .map(token -> token.toLowerCase(Locale.ROOT))
                    .forEach(terms::add);
        }
        return terms;
    }

    private void countTokens(String text, Map<String, Integer> counts, Set<String> userKeywordTerms) {
        if (text == null || text.isBlank()) {
            return;
        }

        for (String rawToken : TOKEN_SPLITTER.split(text)) {
            String token = rawToken.trim().toLowerCase(Locale.ROOT);
            if (shouldSkip(token, userKeywordTerms)) {
                continue;
            }
            counts.merge(token, 1, Integer::sum);
        }
    }

    private boolean shouldSkip(String token, Set<String> userKeywordTerms) {
        return token.length() < 2
                || STOPWORDS.contains(token)
                || userKeywordTerms.contains(token)
                || token.chars().allMatch(Character::isDigit);
    }

    private int normalizeLimit(Integer limit) {
        if (limit == null || limit < 1) {
            return DEFAULT_LIMIT;
        }
        return Math.min(limit, MAX_LIMIT);
    }
}
