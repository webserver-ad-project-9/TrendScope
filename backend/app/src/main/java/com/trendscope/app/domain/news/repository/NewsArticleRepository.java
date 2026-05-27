package com.trendscope.app.domain.news.repository;

import com.trendscope.app.domain.news.entity.NewsArticle;
import com.trendscope.app.domain.keyword.entity.Keyword;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsArticleRepository extends JpaRepository<NewsArticle, UUID> {

    boolean existsByOriginUrl(String originUrl);

    List<NewsArticle> findTop50ByOrderByPublishedAtDesc();

    List<NewsArticle> findByKeywordInOrderByPublishedAtDesc(List<Keyword> keywords, Pageable pageable);
}
