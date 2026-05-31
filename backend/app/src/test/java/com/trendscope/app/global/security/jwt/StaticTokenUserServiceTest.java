package com.trendscope.app.global.security.jwt;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.trendscope.app.domain.user.entity.User;
import com.trendscope.app.domain.user.repository.UserRepository;
import com.trendscope.app.global.security.principal.CustomUserDetails;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

@ExtendWith(MockitoExtension.class)
class StaticTokenUserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Test
    void reloadsStaticUserWhenConcurrentCreateAlreadyInsertedIt() {
        String email = "dev@trendpulse.local";
        JwtProperties jwtProperties = new JwtProperties("secret", 3600000L, "static-token", email);
        StaticTokenUserService service = new StaticTokenUserService(jwtProperties, userRepository);
        User existingUser = User.googleUser(email, "TrendPulse Dev User", null, "static-token-user");

        when(userRepository.findByEmail(email))
                .thenReturn(Optional.empty(), Optional.of(existingUser));
        when(userRepository.saveAndFlush(any(User.class)))
                .thenThrow(new DataIntegrityViolationException("duplicate email"));

        CustomUserDetails userDetails = service.loadOrCreateStaticUser();

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).saveAndFlush(userCaptor.capture());
        assertTrue(userCaptor.getValue().isActive());
        assertEquals(email, userDetails.getUsername());
    }
}
