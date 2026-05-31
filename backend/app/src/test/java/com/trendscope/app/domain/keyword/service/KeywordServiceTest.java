package com.trendscope.app.domain.keyword.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.trendscope.app.domain.keyword.dto.KeywordBulkCreateRequest;
import com.trendscope.app.domain.keyword.dto.KeywordCreateRequest;
import com.trendscope.app.domain.keyword.dto.KeywordResponse;
import com.trendscope.app.domain.keyword.entity.Keyword;
import com.trendscope.app.domain.keyword.repository.KeywordRepository;
import com.trendscope.app.domain.user.entity.User;
import com.trendscope.app.domain.user.repository.UserRepository;
import com.trendscope.app.global.exception.BusinessException;
import com.trendscope.app.global.exception.ErrorCode;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class KeywordServiceTest {

    @Autowired
    private KeywordService keywordService;

    @Autowired
    private KeywordRepository keywordRepository;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        keywordRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void deleteDeactivatesKeywordAndExcludesItFromMine() {
        User user = userRepository.save(User.googleUser("user@example.com", "User", null, "google-user"));
        KeywordResponse created = keywordService.create(user.getId(), new KeywordCreateRequest("AI 반도체"));

        keywordService.delete(user.getId(), created.id());

        Keyword keyword = keywordRepository.findById(created.id()).orElseThrow();
        assertFalse(keyword.isActive());
        assertTrue(keywordService.findMine(user.getId()).isEmpty());
    }

    @Test
    void deleteRejectsKeywordOwnedByAnotherUser() {
        User owner = userRepository.save(User.googleUser("owner@example.com", "Owner", null, "google-owner"));
        User other = userRepository.save(User.googleUser("other@example.com", "Other", null, "google-other"));
        KeywordResponse created = keywordService.create(owner.getId(), new KeywordCreateRequest("경제"));

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> keywordService.delete(other.getId(), created.id())
        );

        assertEquals(ErrorCode.KEYWORD_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void createReactivatesDeletedKeyword() {
        User user = userRepository.save(User.googleUser("restore@example.com", "Restore", null, "google-restore"));
        KeywordResponse created = keywordService.create(user.getId(), new KeywordCreateRequest("스포츠"));
        keywordService.delete(user.getId(), created.id());

        KeywordResponse restored = keywordService.create(user.getId(), new KeywordCreateRequest("스포츠"));

        assertEquals(created.id(), restored.id());
        assertEquals(1, keywordRepository.count());
        assertEquals(1, keywordService.findMine(user.getId()).size());
        assertTrue(keywordRepository.findById(created.id()).orElseThrow().isActive());
    }

    @Test
    void createRejectsMoreThanSixActiveKeywords() {
        User user = userRepository.save(User.googleUser("limit@example.com", "Limit", null, "google-limit"));
        for (int index = 1; index <= 6; index++) {
            keywordService.create(user.getId(), new KeywordCreateRequest("키워드" + index));
        }

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> keywordService.create(user.getId(), new KeywordCreateRequest("키워드7"))
        );

        assertEquals(ErrorCode.KEYWORD_LIMIT_EXCEEDED, exception.getErrorCode());
        assertEquals(6, keywordService.findMine(user.getId()).size());
    }

    @Test
    void createBulkRejectsWhenActiveKeywordLimitWouldBeExceeded() {
        User user = userRepository.save(User.googleUser("bulk-limit@example.com", "Bulk Limit", null, "google-bulk-limit"));
        for (int index = 1; index <= 5; index++) {
            keywordService.create(user.getId(), new KeywordCreateRequest("기존" + index));
        }

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> keywordService.createBulk(
                        user.getId(),
                        new KeywordBulkCreateRequest(List.of("신규1", "신규2"))
                )
        );

        assertEquals(ErrorCode.KEYWORD_LIMIT_EXCEEDED, exception.getErrorCode());
        assertEquals(5, keywordService.findMine(user.getId()).size());
    }
}
