package com.trendscope.app.global.security.jwt;

import com.trendscope.app.domain.user.entity.User;
import com.trendscope.app.domain.user.repository.UserRepository;
import com.trendscope.app.global.security.principal.CustomUserDetails;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StaticTokenUserService {

    private final JwtProperties jwtProperties;
    private final UserRepository userRepository;

    public StaticTokenUserService(JwtProperties jwtProperties, UserRepository userRepository) {
        this.jwtProperties = jwtProperties;
        this.userRepository = userRepository;
    }

    public boolean supports(String token) {
        return jwtProperties.staticToken() != null && jwtProperties.staticToken().equals(token);
    }

    @Transactional
    public CustomUserDetails loadOrCreateStaticUser() {
        User user = userRepository.findByEmail(jwtProperties.staticUserEmail())
                .orElseGet(this::createOrLoadStaticUser);
        return CustomUserDetails.from(user);
    }

    private User createOrLoadStaticUser() {
        try {
            return userRepository.saveAndFlush(User.googleUser(
                    jwtProperties.staticUserEmail(),
                    "TrendPulse Dev User",
                    null,
                    "static-token-user"
            ));
        } catch (DataIntegrityViolationException exception) {
            return userRepository.findByEmail(jwtProperties.staticUserEmail())
                    .orElseThrow(() -> exception);
        }
    }
}
