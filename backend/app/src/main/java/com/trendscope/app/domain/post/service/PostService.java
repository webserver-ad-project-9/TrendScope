package com.trendscope.app.domain.post.service;

import com.trendscope.app.domain.comment.repository.CommentRepository;
import com.trendscope.app.domain.like.repository.PostLikeRepository;
import com.trendscope.app.domain.post.dto.PostCreateRequest;
import com.trendscope.app.domain.post.dto.PostDetailResponse;
import com.trendscope.app.domain.post.dto.PostListResponse;
import com.trendscope.app.domain.post.dto.PostResponse;
import com.trendscope.app.domain.post.dto.PostUpdateRequest;
import com.trendscope.app.domain.post.entity.BoardCategory;
import com.trendscope.app.domain.post.entity.Post;
import com.trendscope.app.domain.post.repository.PostRepository;
import com.trendscope.app.domain.user.repository.UserRepository;
import com.trendscope.app.global.exception.BusinessException;
import com.trendscope.app.global.exception.ErrorCode;
import com.trendscope.app.global.response.PageResponse;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final PostLikeRepository postLikeRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository,
                       CommentRepository commentRepository, PostLikeRepository postLikeRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.postLikeRepository = postLikeRepository;
    }

    public PostResponse create(UUID userId, PostCreateRequest request) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        var post = postRepository.save(new Post(user, request.category(), request.title(), request.content()));
        return new PostResponse(post.getId());
    }

    @Transactional(readOnly = true)
    public PageResponse<PostListResponse> findPosts(BoardCategory category, Pageable pageable, UUID currentUserId) {
        var posts = category == null
                ? postRepository.findByDeletedAtIsNull(pageable)
                : postRepository.findByCategoryAndDeletedAtIsNull(category, pageable);
        return PageResponse.from(posts.map(post -> PostListResponse.of(
                post,
                postLikeRepository.countByPostId(post.getId()),
                commentRepository.countByPostIdAndDeletedAtIsNull(post.getId()),
                currentUserId
        )));
    }

    public PostDetailResponse findDetail(UUID postId, UUID currentUserId) {
        Post post = findActivePost(postId);
        post.increaseViewCount();
        return toDetailResponse(post, currentUserId);
    }

    public PostDetailResponse update(UUID postId, UUID userId, PostUpdateRequest request) {
        Post post = findActivePost(postId);
        validateOwner(post, userId);
        post.update(request.category(), request.title(), request.content());
        return toDetailResponse(post, userId);
    }

    public void delete(UUID postId, UUID userId) {
        Post post = findActivePost(postId);
        validateOwner(post, userId);
        post.delete();
    }

    private PostDetailResponse toDetailResponse(Post post, UUID currentUserId) {
        return PostDetailResponse.of(
                post,
                postLikeRepository.countByPostId(post.getId()),
                commentRepository.countByPostIdAndDeletedAtIsNull(post.getId()),
                currentUserId != null && postLikeRepository.existsByPostIdAndUserId(post.getId(), currentUserId),
                currentUserId
        );
    }

    private Post findActivePost(UUID postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
        if (post.isDeleted()) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND);
        }
        return post;
    }

    private void validateOwner(Post post, UUID userId) {
        if (!post.isWrittenBy(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
    }
}
