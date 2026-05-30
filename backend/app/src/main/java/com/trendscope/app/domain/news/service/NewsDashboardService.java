package com.trendscope.app.domain.news.service;

import com.trendscope.app.domain.keyword.entity.Keyword;
import com.trendscope.app.domain.keyword.repository.KeywordRepository;
import com.trendscope.app.domain.news.dto.DailyNewsCountItemResponse;
import com.trendscope.app.domain.news.dto.DailyNewsCountResponse;
import com.trendscope.app.domain.news.dto.KeywordBriefingArticleResponse;
import com.trendscope.app.domain.news.dto.KeywordFrequencyItemResponse;
import com.trendscope.app.domain.news.dto.NewsClusterItemResponse;
import com.trendscope.app.domain.news.dto.NewsClusterResponse;
import com.trendscope.app.domain.news.dto.NewsSentimentItemResponse;
import com.trendscope.app.domain.news.dto.NewsSentimentResponse;
import com.trendscope.app.domain.news.dto.NewsTrendScoreResponse;
import com.trendscope.app.domain.news.dto.SuggestedKeywordResponse;
import com.trendscope.app.domain.news.dto.TodayIssueResponse;
import com.trendscope.app.domain.news.dto.TrendScoreItemResponse;
import com.trendscope.app.domain.news.entity.NewsArticle;
import com.trendscope.app.domain.news.repository.NewsArticleRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
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
public class NewsDashboardService {

    private static final ZoneId SERVICE_ZONE = ZoneId.of("Asia/Seoul");
    private static final int DEFAULT_SCAN_LIMIT = 100;
    private static final Pattern TOKEN_SPLITTER = Pattern.compile("[^가-힣a-zA-Z0-9]+");
    private static final Set<String> STOPWORDS = Set.of(
            "관련", "기자", "뉴스", "오늘", "이번", "지난", "위해", "대해", "통해", "등",
            "있는", "없는", "있다", "한다", "했다", "에서", "으로", "까지", "부터", "보다", "다시",
            "시장", "전망", "기록", "최고", "기대", "상승", "하락", "종합", "이슈", "ai"
    );

    private final KeywordRepository keywordRepository;
    private final NewsArticleRepository newsArticleRepository;

    public NewsDashboardService(KeywordRepository keywordRepository,
                                NewsArticleRepository newsArticleRepository) {
        this.keywordRepository = keywordRepository;
        this.newsArticleRepository = newsArticleRepository;
    }

    public NewsTrendScoreResponse trendScores(UUID userId) {
        List<Keyword> keywords = keywordRepository.findByUserIdAndActiveTrueOrderByCreatedAtDesc(userId);
        LocalDateTime todayStart = LocalDate.now(SERVICE_ZONE).atStartOfDay();
        List<TrendScoreItemResponse> scores = keywords.stream()
                .map(keyword -> {
                    int count = newsArticleRepository
                            .findByKeywordAndPublishedAtGreaterThanEqualAndPublishedAtLessThanOrderByPublishedAtDesc(
                                    keyword,
                                    todayStart,
                                    todayStart.plusDays(1),
                                    PageRequest.of(0, DEFAULT_SCAN_LIMIT)
                            )
                            .size();
                    return new TrendScoreItemResponse(keyword.getId(), keyword.getName(), count, Math.min(100, count * 2));
                })
                .toList();
        return new NewsTrendScoreResponse(scores);
    }

    public TodayIssueResponse todayIssues(UUID userId, Integer limit) {
        int issueLimit = normalizeLimit(limit, 3, 5);
        List<NewsArticle> articles = latestArticles(userId, LocalDate.now(SERVICE_ZONE).atStartOfDay(), 30);
        if (articles.isEmpty()) {
            return new TodayIssueResponse(List.of());
        }
        return new TodayIssueResponse(topTitles(articles, issueLimit));
    }

    public SuggestedKeywordResponse suggestedKeywords(UUID userId, Integer limit) {
        List<NewsArticle> articles = latestArticles(userId, LocalDate.now(SERVICE_ZONE).minusDays(7).atStartOfDay(), DEFAULT_SCAN_LIMIT);
        return new SuggestedKeywordResponse(frequencyItems(articles, normalizeLimit(limit, 10, 30)));
    }

    public DailyNewsCountResponse dailyCounts(UUID userId, Integer days) {
        int normalizedDays = normalizeLimit(days, 7, 30);
        LocalDate startDate = LocalDate.now(SERVICE_ZONE).minusDays(normalizedDays - 1L);
        List<NewsArticle> articles = latestArticles(userId, startDate.atStartOfDay(), DEFAULT_SCAN_LIMIT);
        Map<LocalDate, Long> counts = new LinkedHashMap<>();
        for (int i = 0; i < normalizedDays; i++) {
            counts.put(startDate.plusDays(i), 0L);
        }
        for (NewsArticle article : articles) {
            if (article.getPublishedAt() == null) {
                continue;
            }
            LocalDate date = article.getPublishedAt().toLocalDate();
            if (counts.containsKey(date)) {
                counts.put(date, counts.get(date) + 1);
            }
        }
        List<DailyNewsCountItemResponse> items = counts.entrySet().stream()
                .map(entry -> new DailyNewsCountItemResponse(entry.getKey(), entry.getValue()))
                .toList();
        return new DailyNewsCountResponse(items);
    }

    public NewsClusterResponse clusters(UUID userId, Integer limit) {
        int clusterLimit = normalizeLimit(limit, 5, 20);
        List<NewsArticle> articles = latestArticles(userId, LocalDate.now(SERVICE_ZONE).minusDays(7).atStartOfDay(), DEFAULT_SCAN_LIMIT);
        Map<String, List<NewsArticle>> grouped = new HashMap<>();
        for (NewsArticle article : articles) {
            String topic = firstMeaningfulToken(article.getTitle());
            grouped.computeIfAbsent(topic, ignored -> new ArrayList<>()).add(article);
        }

        List<NewsClusterItemResponse> items = grouped.entrySet().stream()
                .sorted((left, right) -> Integer.compare(right.getValue().size(), left.getValue().size()))
                .limit(clusterLimit)
                .map(entry -> new NewsClusterItemResponse(
                        entry.getKey(),
                        entry.getValue().size(),
                        entry.getValue().stream()
                                .limit(5)
                                .map(KeywordBriefingArticleResponse::from)
                                .toList()
                ))
                .toList();
        return new NewsClusterResponse(items);
    }

    public NewsSentimentResponse sentiments(UUID userId) {
        List<Keyword> keywords = keywordRepository.findByUserIdAndActiveTrueOrderByCreatedAtDesc(userId);
        LocalDateTime since = LocalDate.now(SERVICE_ZONE).minusDays(1).atStartOfDay();
        List<NewsSentimentItemResponse> items = keywords.stream()
                .map(keyword -> sentiment(keyword, since))
                .toList();
        return new NewsSentimentResponse(items);
    }

    private NewsSentimentItemResponse sentiment(Keyword keyword, LocalDateTime since) {
        List<NewsArticle> articles = newsArticleRepository
                .findByKeywordAndPublishedAtGreaterThanEqualAndPublishedAtLessThanOrderByPublishedAtDesc(
                        keyword,
                        since,
                        LocalDate.now(SERVICE_ZONE).plusDays(1).atStartOfDay(),
                        PageRequest.of(0, 20)
                );
        String joinedTitles = String.join(" ", articles.stream().map(NewsArticle::getTitle).toList());
        String sentiment = containsAny(joinedTitles, "급등", "호황", "최고", "성장", "강세", "기대") ? "POSITIVE" : "NEUTRAL";
        String riskLevel = containsAny(joinedTitles, "위기", "하락", "손실", "논란", "위반", "급락") ? "MEDIUM" : "LOW";
        return new NewsSentimentItemResponse(keyword.getId(), keyword.getName(), sentiment, riskLevel, "뉴스 제목 기반 MVP 분류입니다.");
    }

    private List<NewsArticle> latestArticles(UUID userId, LocalDateTime since, int limit) {
        List<Keyword> keywords = keywordRepository.findByUserIdAndActiveTrueOrderByCreatedAtDesc(userId);
        if (keywords.isEmpty()) {
            return List.of();
        }
        return newsArticleRepository.findByKeywordInAndPublishedAtGreaterThanEqualOrderByPublishedAtDesc(
                keywords,
                since,
                PageRequest.of(0, limit)
        );
    }

    private List<KeywordFrequencyItemResponse> frequencyItems(List<NewsArticle> articles, int limit) {
        Map<String, Integer> counts = new HashMap<>();
        for (NewsArticle article : articles) {
            countTokens(article.getTitle(), counts);
            countTokens(article.getDescription(), counts);
        }
        int max = counts.values().stream().max(Integer::compareTo).orElse(0);
        return counts.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue((left, right) -> Integer.compare(right, left))
                        .thenComparing(Map.Entry.comparingByKey()))
                .limit(limit)
                .map(entry -> new KeywordFrequencyItemResponse(
                        entry.getKey(),
                        entry.getValue(),
                        max == 0 ? 0 : Math.round(entry.getValue() * 1000.0 / max) / 10.0
                ))
                .toList();
    }

    private void countTokens(String text, Map<String, Integer> counts) {
        if (text == null || text.isBlank()) {
            return;
        }
        for (String raw : TOKEN_SPLITTER.split(text)) {
            String token = raw.trim().toLowerCase(Locale.ROOT);
            if (token.length() < 2 || STOPWORDS.contains(token) || token.chars().allMatch(Character::isDigit)) {
                continue;
            }
            counts.merge(token, 1, Integer::sum);
        }
    }

    private String firstMeaningfulToken(String title) {
        if (title == null) {
            return "기타";
        }
        for (String raw : TOKEN_SPLITTER.split(title)) {
            String token = raw.trim();
            if (token.length() >= 2 && !STOPWORDS.contains(token.toLowerCase(Locale.ROOT))) {
                return token;
            }
        }
        return "기타";
    }

    private List<String> topTitles(List<NewsArticle> articles, int limit) {
        return articles.stream()
                .map(NewsArticle::getTitle)
                .limit(limit)
                .toList();
    }

    private boolean containsAny(String text, String... words) {
        for (String word : words) {
            if (text.contains(word)) {
                return true;
            }
        }
        return false;
    }

    private int normalizeLimit(Integer value, int defaultValue, int max) {
        if (value == null || value < 1) {
            return defaultValue;
        }
        return Math.min(value, max);
    }
}
