package com.trendscope.app.domain.news.entity;

import com.trendscope.app.domain.keyword.entity.Keyword;
import com.trendscope.app.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "news_articles")
public class NewsArticle extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "keyword_id", nullable = false)
    private Keyword keyword;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(nullable = false, length = 1000)
    private String originUrl;

    @Column(length = 1000)
    private String description;

    private LocalDateTime publishedAt;

    protected NewsArticle() {
    }

    public NewsArticle(Keyword keyword, String title, String originUrl, String description, LocalDateTime publishedAt) {
        this.keyword = keyword;
        this.title = title;
        this.originUrl = originUrl;
        this.description = description;
        this.publishedAt = publishedAt;
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }
}
