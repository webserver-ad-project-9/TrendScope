package com.trendscope.app.domain.keyword.service;

import com.trendscope.app.domain.keyword.dto.KeywordBulkCreateRequest;
import com.trendscope.app.domain.keyword.dto.KeywordCreateRequest;
import com.trendscope.app.domain.keyword.dto.KeywordReplaceRequest;
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
import org.springframework.dao.DataIntegrityViolationException;
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
        try {
            return KeywordResponse.from(keywordRepository.saveAndFlush(new Keyword(user, normalized)));
        } catch (DataIntegrityViolationException exception) {
            Keyword keyword = keywordRepository.findByUserIdAndKeyword(userId, normalized)
                    .orElseThrow(() -> exception);
            if (!keyword.isActive()) {
                validateKeywordLimit(userId, 1);
                keyword.activate();
            }
            return KeywordResponse.from(keyword);
        }
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
        try {
            keywordRepository.saveAllAndFlush(newKeywords);
        } catch (DataIntegrityViolationException exception) {
            return keywordRepository.findByUserIdAndKeywordIn(userId, candidates).stream()
                    .filter(Keyword::isActive)
                    .map(KeywordResponse::from)
                    .toList();
        }
        return changedKeywords.stream()
                .map(KeywordResponse::from)
                .toList();
    }

    public List<KeywordResponse> replaceAll(UUID userId, KeywordReplaceRequest request) {
        List<String> candidates = normalizedCandidates(request.names());
        if (candidates.isEmpty()) {
            return List.of();
        }
        if (candidates.size() > MAX_ACTIVE_KEYWORD_COUNT) {
            throw new BusinessException(ErrorCode.KEYWORD_LIMIT_EXCEEDED);
        }

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        Map<String, Keyword> existingByName = keywordRepository.findByUserId(userId).stream()
                .collect(java.util.stream.Collectors.toMap(
                        Keyword::getName,
                        keyword -> keyword,
                        (left, right) -> left,
                        LinkedHashMap::new
                ));

        List<Keyword> currentKeywords = keywordRepository.findByUserId(userId);
        for (Keyword keyword : currentKeywords) {
            if (keyword.isActive() && !candidates.contains(keyword.getName())) {
                keyword.deactivate();
            }
        }

        List<Keyword> activeKeywords = new ArrayList<>();
        List<Keyword> newKeywords = new ArrayList<>();
        for (String name : candidates) {
            Keyword existing = existingByName.get(name);
            if (existing == null) {
                Keyword keyword = new Keyword(user, name);
                newKeywords.add(keyword);
                activeKeywords.add(keyword);
                continue;
            }
            if (!existing.isActive()) {
                existing.activate();
            }
            activeKeywords.add(existing);
        }

        try {
            keywordRepository.saveAllAndFlush(newKeywords);
        } catch (DataIntegrityViolationException exception) {
            return keywordRepository.findByUserIdAndKeywordIn(userId, candidates).stream()
                    .filter(Keyword::isActive)
                    .map(KeywordResponse::from)
                    .toList();
        }
        return activeKeywords.stream()
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

    private List<String> normalizedCandidates(List<String> names) {
        Set<String> normalizedNames = new LinkedHashSet<>();
        for (String name : names) {
            String normalized = KeywordNormalizer.normalize(name);
            if (!normalized.isBlank()) {
                normalizedNames.add(normalized);
            }
        }
        return List.copyOf(normalizedNames);
    }
}
