package com.trendscope.app.domain.user.service;

import com.trendscope.app.domain.user.dto.UserProfileResponse;
import com.trendscope.app.domain.user.repository.UserRepository;
import com.trendscope.app.global.exception.BusinessException;
import com.trendscope.app.global.exception.ErrorCode;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserProfileResponse getProfile(UUID userId) {
        return userRepository.findById(userId)
                .map(UserProfileResponse::from)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }
}
