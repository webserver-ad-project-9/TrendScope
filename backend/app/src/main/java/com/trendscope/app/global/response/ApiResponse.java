package com.trendscope.app.global.response;

public record ApiResponse<T>(
        boolean success,
        T data,
        String message
) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, "요청 성공");
    }

    public static ApiResponse<Void> ok() {
        return new ApiResponse<>(true, null, "요청 성공");
    }
}
