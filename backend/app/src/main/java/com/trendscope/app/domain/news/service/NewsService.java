package com.trendscope.app.domain.news.service;

import com.trendscope.app.domain.news.dto.NewsArticleResponse;
import com.trendscope.app.domain.news.repository.NewsArticleRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class NewsService {

    private final NewsArticleRepository newsArticleRepository;

    public NewsService(NewsArticleRepository newsArticleRepository) {
        this.newsArticleRepository = newsArticleRepository;
    }

    public List<NewsArticleResponse> findLatest() {
        return newsArticleRepository.findTop50ByOrderByPublishedAtDesc().stream()
                .map(NewsArticleResponse::from)
                .toList();
    }
}
