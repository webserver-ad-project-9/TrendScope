package com.trendscope.app.domain.auth.service;

import com.trendscope.app.domain.auth.dto.TokenResponse;
import com.trendscope.app.domain.user.entity.User;
import com.trendscope.app.global.security.jwt.JwtProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TokenService {

    private final JwtProvider jwtProvider;

    public TokenService(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    public TokenResponse issue(User user) {
        String accessToken = jwtProvider.createAccessToken(user.getId(), user.getEmail());
        return TokenResponse.bearer(accessToken);
    }
}
