package com.trendscope.app.domain.post.service;

import com.trendscope.app.domain.post.dto.PostCreateRequest;
import com.trendscope.app.domain.post.dto.PostResponse;
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
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public PostResponse create(UUID userId, PostCreateRequest request) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        var post = postRepository.save(new Post(user, request.category(), request.title(), request.content()));
        return new PostResponse(post.getId());
    }
}
