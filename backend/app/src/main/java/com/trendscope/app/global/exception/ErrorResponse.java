package com.trendscope.app.global.exception;

public record ErrorResponse(
        boolean success,
        String errorCode,
        String message
) {
    public static ErrorResponse from(ErrorCode errorCode) {
        return new ErrorResponse(false, errorCode.name(), errorCode.getMessage());
    }
}
