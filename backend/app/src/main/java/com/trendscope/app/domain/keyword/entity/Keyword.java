package com.trendscope.app.domain.keyword.entity;

import com.trendscope.app.domain.user.entity.User;
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
import jakarta.persistence.UniqueConstraint;
import java.util.UUID;

@Entity
@Table(
        name = "onboarding_keywords",
        uniqueConstraints = @UniqueConstraint(name = "uk_onboarding_keywords_user_keyword", columnNames = {"user_id", "keyword"})
)
public class Keyword extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 80)
    private String keyword;

    @Column(length = 40)
    private String category;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    protected Keyword() {
    }

    public Keyword(User user, String keyword) {
        this.user = user;
        this.keyword = keyword;
    }

    public UUID getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getName() {
        return keyword;
    }

    public boolean isActive() {
        return active;
    }

    public void activate() {
        this.active = true;
    }

    public void deactivate() {
        this.active = false;
    }
}
