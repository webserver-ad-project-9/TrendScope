package com.trendscope.app.domain.news.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.trendscope.app.domain.keyword.entity.Keyword;
import com.trendscope.app.domain.keyword.repository.KeywordRepository;
import com.trendscope.app.domain.news.dto.KeywordBriefingResponse;
import com.trendscope.app.domain.news.entity.NewsArticle;
import com.trendscope.app.domain.news.repository.NewsArticleRepository;
import com.trendscope.app.domain.user.entity.User;
import com.trendscope.app.external.llm.LocalLlmClient;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

@ExtendWith(MockitoExtension.class)
class KeywordBriefingServiceTest {

    @Mock
    private KeywordRepository keywordRepository;

    @Mock
    private NewsArticleRepository newsArticleRepository;

    @Mock
    private NewsCollectionService newsCollectionService;

    @Mock
    private LocalLlmClient localLlmClient;

    @Test
    void createBriefingCollectsFourRecentArticlesPerKeyword() {
        UUID userId = UUID.randomUUID();
        User user = User.googleUser("briefing@example.com", "Briefing", null, "google-briefing");
        Keyword korea = new Keyword(user, "한국");
        Keyword president = new Keyword(user, "대통령");
        Keyword samsung = new Keyword(user, "삼성");
        PageRequest expectedPage = PageRequest.of(0, 4);

        when(keywordRepository.findByUserIdAndActiveTrueOrderByCreatedAtDesc(userId))
                .thenReturn(List.of(korea, president, samsung));
        when(newsArticleRepository.findByKeywordOrderByPublishedAtDesc(eq(korea), eq(expectedPage)))
                .thenReturn(articles(korea, "한국"));
        when(newsArticleRepository.findByKeywordOrderByPublishedAtDesc(eq(president), eq(expectedPage)))
                .thenReturn(articles(president, "대통령"));
        when(newsArticleRepository.findByKeywordOrderByPublishedAtDesc(eq(samsung), eq(expectedPage)))
                .thenReturn(articles(samsung, "삼성"));
        when(localLlmClient.summarize(anyString())).thenReturn("요약");

        KeywordBriefingService service = new KeywordBriefingService(
                keywordRepository,
                newsArticleRepository,
                newsCollectionService,
                new NewsSummaryPromptBuilder(),
                localLlmClient
        );

        KeywordBriefingResponse response = service.createBriefing(userId);

        verify(newsCollectionService).collect(korea, 4);
        verify(newsCollectionService).collect(president, 4);
        verify(newsCollectionService).collect(samsung, 4);
        assertEquals(12, response.totalCollectedCount());
        assertEquals(3, response.summaries().size());
        response.summaries().forEach(summary -> assertEquals(4, summary.collectedCount()));
    }

    private List<NewsArticle> articles(Keyword keyword, String titlePrefix) {
        return List.of(
                article(keyword, titlePrefix, 1),
                article(keyword, titlePrefix, 2),
                article(keyword, titlePrefix, 3),
                article(keyword, titlePrefix, 4)
        );
    }

    private NewsArticle article(Keyword keyword, String titlePrefix, int index) {
        return new NewsArticle(
                keyword,
                titlePrefix + " 뉴스 " + index,
                "https://example.com/" + titlePrefix + "/" + index,
                titlePrefix + " 설명 " + index,
                LocalDateTime.now().minusHours(index)
        );
    }
}
