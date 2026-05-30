package com.trendscope.app.domain.comment.service;

import com.trendscope.app.domain.comment.dto.CommentCreateRequest;
import com.trendscope.app.domain.comment.dto.CommentResponse;
import com.trendscope.app.domain.comment.dto.CommentUpdateRequest;
import com.trendscope.app.domain.comment.entity.Comment;
import com.trendscope.app.domain.comment.repository.CommentRepository;
import com.trendscope.app.domain.post.entity.Post;
import com.trendscope.app.domain.post.repository.PostRepository;
import com.trendscope.app.domain.user.repository.UserRepository;
import com.trendscope.app.global.exception.BusinessException;
import com.trendscope.app.global.exception.ErrorCode;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public CommentResponse create(UUID postId, UUID userId, CommentCreateRequest request) {
        Post post = findActivePost(postId);
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return CommentResponse.of(commentRepository.save(new Comment(post, user, request.content())), userId);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> findByPost(UUID postId, UUID currentUserId) {
        findActivePost(postId);
        return commentRepository.findByPostIdAndDeletedAtIsNullOrderByCreatedAtAsc(postId).stream()
                .map(comment -> CommentResponse.of(comment, currentUserId))
                .toList();
    }

    public CommentResponse update(UUID commentId, UUID userId, CommentUpdateRequest request) {
        Comment comment = findActiveComment(commentId);
        validateOwner(comment, userId);
        comment.update(request.content());
        return CommentResponse.of(comment, userId);
    }

    public void delete(UUID commentId, UUID userId) {
        Comment comment = findActiveComment(commentId);
        validateOwner(comment, userId);
        comment.delete();
    }

    private Post findActivePost(UUID postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
        if (post.isDeleted()) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND);
        }
        return post;
    }

    private Comment findActiveComment(UUID commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));
        if (comment.getDeletedAt() != null) {
            throw new BusinessException(ErrorCode.COMMENT_NOT_FOUND);
        }
        return comment;
    }

    private void validateOwner(Comment comment, UUID userId) {
        if (!comment.isWrittenBy(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
    }
}
