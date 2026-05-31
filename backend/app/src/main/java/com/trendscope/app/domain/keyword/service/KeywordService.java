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
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class KeywordService {

    private static final int MAX_ACTIVE_KEYWORD_COUNT = 6;

    private final KeywordRepository keywordRepository;
    private final UserRepository userRepository;

    public KeywordService(KeywordRepository keywordRepository, UserRepository userRepository) {
        this.keywordRepository = keywordRepository;
        this.userRepository = userRepository;
    }

    public KeywordResponse create(UUID userId, KeywordCreateRequest request) {
        String normalized = KeywordNormalizer.normalize(request.name());
        var existingKeyword = keywordRepository.findByUserIdAndKeyword(userId, normalized);
        if (existingKeyword.isPresent()) {
            Keyword keyword = existingKeyword.get();
            if (keyword.isActive()) {
                throw new BusinessException(ErrorCode.KEYWORD_DUPLICATED);
            }
            validateKeywordLimit(userId, 1);
            keyword.activate();
            return KeywordResponse.from(keyword);
        }

        validateKeywordLimit(userId, 1);
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
        Map<String, Keyword> existingByName = keywordRepository.findByUserIdAndKeywordIn(userId, candidates).stream()
                .collect(java.util.stream.Collectors.toMap(
                        Keyword::getName,
                        keyword -> keyword,
                        (left, right) -> left,
                        LinkedHashMap::new
        ));
        List<Keyword> changedKeywords = new ArrayList<>();
        List<Keyword> reactivatedKeywords = new ArrayList<>();
        List<Keyword> newKeywords = new ArrayList<>();

        for (String name : candidates) {
            Keyword existing = existingByName.get(name);
            if (existing == null) {
                Keyword keyword = new Keyword(user, name);
                changedKeywords.add(keyword);
                newKeywords.add(keyword);
                continue;
            }
            if (!existing.isActive()) {
                changedKeywords.add(existing);
                reactivatedKeywords.add(existing);
            }
        }

        validateKeywordLimit(userId, changedKeywords.size());
        reactivatedKeywords.forEach(Keyword::activate);
        keywordRepository.saveAll(newKeywords);
        return changedKeywords.stream()
                .map(KeywordResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<KeywordResponse> findMine(UUID userId) {
        return keywordRepository.findByUserIdAndActiveTrueOrderByCreatedAtDesc(userId).stream()
                .map(KeywordResponse::from)
                .toList();
    }

    public void delete(UUID userId, UUID keywordId) {
        Keyword keyword = keywordRepository.findByIdAndUserId(keywordId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.KEYWORD_NOT_FOUND));
        if (!keyword.isActive()) {
            throw new BusinessException(ErrorCode.KEYWORD_NOT_FOUND);
        }
        keyword.deactivate();
    }

    private void validateKeywordLimit(UUID userId, int activationCount) {
        if (activationCount < 1) {
            return;
        }
        long activeKeywordCount = keywordRepository.countByUserIdAndActiveTrue(userId);
        if (activeKeywordCount + activationCount > MAX_ACTIVE_KEYWORD_COUNT) {
            throw new BusinessException(ErrorCode.KEYWORD_LIMIT_EXCEEDED);
        }
    }
}
