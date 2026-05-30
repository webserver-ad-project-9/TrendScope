package com.trendscope.app.domain.like.entity;

import com.trendscope.app.domain.post.entity.Post;
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
        name = "post_likes",
        uniqueConstraints = @UniqueConstraint(name = "uk_post_likes_post_user", columnNames = {"post_id", "user_id"})
)
public class PostLike extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    protected PostLike() {
    }

    public PostLike(Post post, User user) {
        this.post = post;
        this.user = user;
    }
}
