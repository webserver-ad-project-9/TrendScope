package com.trendscope.app.domain.bookmark.entity;

import com.trendscope.app.domain.news.entity.NewsArticle;
import com.trendscope.app.domain.user.entity.User;
import com.trendscope.app.global.common.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.UUID;

@Entity
@Table(
        name = "news_bookmarks",
        uniqueConstraints = @UniqueConstraint(name = "uk_news_bookmarks_user_article", columnNames = {"user_id", "news_article_id"})
)
public class NewsBookmark extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "news_article_id", nullable = false)
    private NewsArticle newsArticle;

    protected NewsBookmark() {
    }

    public NewsBookmark(User user, NewsArticle newsArticle) {
        this.user = user;
        this.newsArticle = newsArticle;
    }

    public UUID getId() {
        return id;
    }

    public NewsArticle getNewsArticle() {
        return newsArticle;
    }
}
