package com.trendscope.app.domain.comment.entity;

import com.trendscope.app.domain.post.entity.Post;
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
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "comments")
public class Comment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 1000)
    private String content;

    private LocalDateTime deletedAt;

    protected Comment() {
    }

    public Comment(Post post, User user, String content) {
        this.post = post;
        this.user = user;
        this.content = content;
    }

    public UUID getId() {
        return id;
    }

    public Post getPost() {
        return post;
    }

    public User getUser() {
        return user;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public boolean isWrittenBy(UUID userId) {
        return userId != null && user.getId().equals(userId);
    }

    public void update(String content) {
        this.content = content;
    }

    public void delete() {
        this.deletedAt = LocalDateTime.now();
    }
}
