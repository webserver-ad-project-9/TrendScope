package com.trendscope.app.global.security.jwt;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenResolver {

    private static final String AUTHORIZATION = "Authorization";
    private static final String BEARER = "Bearer ";

    public String resolve(HttpServletRequest request) {
        String header = request.getHeader(AUTHORIZATION);
        if (header == null || !header.startsWith(BEARER)) {
            return null;
        }
        return header.substring(BEARER.length());
    }
}
