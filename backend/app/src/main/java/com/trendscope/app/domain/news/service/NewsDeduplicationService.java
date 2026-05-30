package com.trendscope.app.domain.news.service;

import com.trendscope.app.domain.news.repository.NewsArticleRepository;
import org.springframework.stereotype.Service;

@Service
public class NewsDeduplicationService {

    private final NewsArticleRepository newsArticleRepository;

    public NewsDeduplicationService(NewsArticleRepository newsArticleRepository) {
        this.newsArticleRepository = newsArticleRepository;
    }

    public boolean isNewArticle(String originUrl) {
        return !newsArticleRepository.existsByOriginUrl(originUrl);
    }
}
