package com.trendscope.app.domain.bookmark.service;

import com.trendscope.app.domain.bookmark.dto.NewsBookmarkResponse;
import com.trendscope.app.domain.bookmark.entity.NewsBookmark;
import com.trendscope.app.domain.bookmark.repository.NewsBookmarkRepository;
import com.trendscope.app.domain.news.repository.NewsArticleRepository;
import com.trendscope.app.domain.user.repository.UserRepository;
import com.trendscope.app.global.exception.BusinessException;
import com.trendscope.app.global.exception.ErrorCode;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NewsBookmarkService {

    private final NewsBookmarkRepository newsBookmarkRepository;
    private final UserRepository userRepository;
    private final NewsArticleRepository newsArticleRepository;

    public NewsBookmarkService(NewsBookmarkRepository newsBookmarkRepository,
                               UserRepository userRepository,
                               NewsArticleRepository newsArticleRepository) {
        this.newsBookmarkRepository = newsBookmarkRepository;
        this.userRepository = userRepository;
        this.newsArticleRepository = newsArticleRepository;
    }

    public NewsBookmarkResponse create(UUID userId, UUID newsId) {
        return newsBookmarkRepository.findByUserIdAndNewsArticleId(userId, newsId)
                .map(NewsBookmarkResponse::from)
                .orElseGet(() -> save(userId, newsId));
    }

    @Transactional(readOnly = true)
    public List<NewsBookmarkResponse> findMine(UUID userId) {
        return newsBookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(NewsBookmarkResponse::from)
                .toList();
    }

    public void delete(UUID userId, UUID newsId) {
        NewsBookmark bookmark = newsBookmarkRepository.findByUserIdAndNewsArticleId(userId, newsId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NEWS_BOOKMARK_NOT_FOUND));
        newsBookmarkRepository.delete(bookmark);
    }

    private NewsBookmarkResponse save(UUID userId, UUID newsId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        var article = newsArticleRepository.findById(newsId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NEWS_ARTICLE_NOT_FOUND));
        return NewsBookmarkResponse.from(newsBookmarkRepository.save(new NewsBookmark(user, article)));
    }
}
