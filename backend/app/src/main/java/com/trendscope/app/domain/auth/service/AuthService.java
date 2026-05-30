package com.trendscope.app.domain.auth.service;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    public void logout() {
        // Access Token only 구조에서는 서버에서 폐기할 토큰 상태를 저장하지 않는다.
    }
}
