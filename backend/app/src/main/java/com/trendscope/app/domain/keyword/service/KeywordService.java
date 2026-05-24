package com.trendscope.app.domain.keyword.service;

import com.trendscope.app.domain.keyword.dto.KeywordCreateRequest;
import com.trendscope.app.domain.keyword.dto.KeywordResponse;
import com.trendscope.app.domain.keyword.entity.Keyword;
import com.trendscope.app.domain.keyword.repository.KeywordRepository;
import com.trendscope.app.domain.user.repository.UserRepository;
import com.trendscope.app.global.exception.BusinessException;
import com.trendscope.app.global.exception.ErrorCode;
import com.trendscope.app.global.util.KeywordNormalizer;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class KeywordService {

    private final KeywordRepository keywordRepository;
    private final UserRepository userRepository;

    public KeywordService(KeywordRepository keywordRepository, UserRepository userRepository) {
        this.keywordRepository = keywordRepository;
        this.userRepository = userRepository;
    }

    public KeywordResponse create(UUID userId, KeywordCreateRequest request) {
        String normalized = KeywordNormalizer.normalize(request.name());
        if (keywordRepository.existsByUserIdAndKeyword(userId, normalized)) {
            throw new BusinessException(ErrorCode.KEYWORD_DUPLICATED);
        }
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return KeywordResponse.from(keywordRepository.save(new Keyword(user, normalized)));
    }

    @Transactional(readOnly = true)
    public List<KeywordResponse> findMine(UUID userId) {
        return keywordRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(KeywordResponse::from)
                .toList();
    }
}
