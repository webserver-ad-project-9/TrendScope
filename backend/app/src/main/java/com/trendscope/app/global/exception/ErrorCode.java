package com.trendscope.app.global.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User not found"),
    INVALID_JWT_TOKEN(HttpStatus.UNAUTHORIZED, "Invalid JWT token"),
    EXPIRED_JWT_TOKEN(HttpStatus.UNAUTHORIZED, "Expired JWT token"),
    KEYWORD_DUPLICATED(HttpStatus.CONFLICT, "Keyword already exists"),
    KEYWORD_LIMIT_EXCEEDED(HttpStatus.BAD_REQUEST, "Keyword registration limit exceeded"),
    KEYWORD_NOT_FOUND(HttpStatus.NOT_FOUND, "Keyword not found"),
    POST_NOT_FOUND(HttpStatus.NOT_FOUND, "Post not found"),
    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "Comment not found"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "Access denied"),
    LIKE_ALREADY_EXISTS(HttpStatus.CONFLICT, "Post like already exists"),
    LIKE_NOT_FOUND(HttpStatus.NOT_FOUND, "Post like not found"),
    NEWS_ARTICLE_NOT_FOUND(HttpStatus.NOT_FOUND, "News article not found"),
    NEWS_BOOKMARK_NOT_FOUND(HttpStatus.NOT_FOUND, "News bookmark not found"),
    NAVER_API_REQUEST_FAILED(HttpStatus.BAD_GATEWAY, "Naver News API request failed"),
    AI_SUMMARY_FAILED(HttpStatus.BAD_GATEWAY, "AI summary request failed"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");

    private final HttpStatus status;
    private final String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}
