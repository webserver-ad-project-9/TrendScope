package com.trendscope.app.domain.user.repository;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.trendscope.app.domain.user.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void savesGoogleUserAsActiveByDefault() {
        User user = userRepository.saveAndFlush(
                User.googleUser("active-user@example.com", "Active User", null, "google-active-user")
        );

        Boolean active = jdbcTemplate.queryForObject(
                "select active from users where id = ?",
                Boolean.class,
                user.getId()
        );

        assertTrue(user.isActive());
        assertNotNull(active);
        assertTrue(active);
    }
}
