package com.trendscope.app.domain.keyword.service;

import com.trendscope.app.domain.keyword.dto.KeywordBulkCreateRequest;
import com.trendscope.app.domain.keyword.dto.KeywordCreateRequest;
import com.trendscope.app.domain.keyword.dto.KeywordResponse;
import com.trendscope.app.domain.keyword.entity.Keyword;
import com.trendscope.app.domain.keyword.repository.KeywordRepository;
import com.trendscope.app.domain.user.repository.UserRepository;
import com.trendscope.app.global.exception.BusinessException;
import com.trendscope.app.global.exception.ErrorCode;
import com.trendscope.app.global.util.KeywordNormalizer;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
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

    public List<KeywordResponse> createBulk(UUID userId, KeywordBulkCreateRequest request) {
        Set<String> normalizedNames = new LinkedHashSet<>();
        for (String name : request.names()) {
            String normalized = KeywordNormalizer.normalize(name);
            if (!normalized.isBlank()) {
                normalizedNames.add(normalized);
            }
        }

        if (normalizedNames.isEmpty()) {
            return List.of();
        }

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        List<String> candidates = List.copyOf(normalizedNames);
        Set<String> existingNames = keywordRepository.findByUserIdAndKeywordIn(userId, candidates).stream()
                .map(Keyword::getName)
                .collect(java.util.stream.Collectors.toSet());
        List<Keyword> keywords = candidates.stream()
                .filter(name -> !existingNames.contains(name))
                .map(name -> new Keyword(user, name))
                .toList();

        return keywordRepository.saveAll(keywords).stream()
                .map(KeywordResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<KeywordResponse> findMine(UUID userId) {
        return keywordRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(KeywordResponse::from)
                .toList();
    }
}
