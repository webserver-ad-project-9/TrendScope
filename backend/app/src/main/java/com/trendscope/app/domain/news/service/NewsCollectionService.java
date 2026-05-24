package com.trendscope.app.domain.news.service;

import com.trendscope.app.domain.keyword.entity.Keyword;
import com.trendscope.app.domain.news.repository.NewsArticleRepository;
import com.trendscope.app.external.naver.NaverNewsClient;
import com.trendscope.app.external.naver.NaverNewsMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NewsCollectionService {

    private final NaverNewsClient naverNewsClient;
    private final NaverNewsMapper naverNewsMapper;
    private final NewsDeduplicationService deduplicationService;
    private final NewsArticleRepository newsArticleRepository;

    public NewsCollectionService(NaverNewsClient naverNewsClient, NaverNewsMapper naverNewsMapper,
                                 NewsDeduplicationService deduplicationService, NewsArticleRepository newsArticleRepository) {
        this.naverNewsClient = naverNewsClient;
        this.naverNewsMapper = naverNewsMapper;
        this.deduplicationService = deduplicationService;
        this.newsArticleRepository = newsArticleRepository;
    }

    public int collect(Keyword keyword) {
        var response = naverNewsClient.search(keyword.getName());
        var articles = response.items().stream()
                .filter(item -> deduplicationService.isNewArticle(item.originallink()))
                .map(item -> naverNewsMapper.toEntity(keyword, item))
                .toList();
        newsArticleRepository.saveAll(articles);
        return articles.size();
    }
}
