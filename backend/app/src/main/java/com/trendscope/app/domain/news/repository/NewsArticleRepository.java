package com.trendscope.app.domain.news.repository;

import com.trendscope.app.domain.news.entity.NewsArticle;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsArticleRepository extends JpaRepository<NewsArticle, UUID> {

    boolean existsByOriginUrl(String originUrl);

    List<NewsArticle> findTop50ByOrderByPublishedAtDesc();
}
