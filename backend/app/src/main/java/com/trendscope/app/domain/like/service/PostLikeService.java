package com.trendscope.app.domain.like.service;

import com.trendscope.app.domain.like.dto.LikeResponse;
import com.trendscope.app.domain.like.entity.PostLike;
import com.trendscope.app.domain.like.repository.PostLikeRepository;
import com.trendscope.app.domain.post.entity.Post;
import com.trendscope.app.domain.post.repository.PostRepository;
import com.trendscope.app.domain.user.repository.UserRepository;
import com.trendscope.app.global.exception.BusinessException;
import com.trendscope.app.global.exception.ErrorCode;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostLikeService(PostLikeRepository postLikeRepository, PostRepository postRepository, UserRepository userRepository) {
        this.postLikeRepository = postLikeRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public LikeResponse like(UUID postId, UUID userId) {
        Post post = findActivePost(postId);
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        if (postLikeRepository.existsByPostIdAndUserId(postId, userId)) {
            throw new BusinessException(ErrorCode.LIKE_ALREADY_EXISTS);
        }
        postLikeRepository.save(new PostLike(post, user));
        return new LikeResponse(postId, true, postLikeRepository.countByPostId(postId));
    }

    public LikeResponse unlike(UUID postId, UUID userId) {
        findActivePost(postId);
        PostLike postLike = postLikeRepository.findByPostIdAndUserId(postId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.LIKE_NOT_FOUND));
        postLikeRepository.delete(postLike);
        return new LikeResponse(postId, false, postLikeRepository.countByPostId(postId));
    }

    private Post findActivePost(UUID postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
        if (post.isDeleted()) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND);
        }
        return post;
    }
}
