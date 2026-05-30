package com.trendscope.app.global.security.oauth;

import com.trendscope.app.domain.user.entity.User;
import com.trendscope.app.domain.user.repository.UserRepository;
import java.util.Map;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oauth2User.getAttributes();
        String email = String.valueOf(attributes.get("email"));
        String name = String.valueOf(attributes.get("name"));
        String picture = String.valueOf(attributes.get("picture"));
        String providerId = String.valueOf(attributes.get("sub"));
        User user = userRepository.findByEmail(email)
                .map(existing -> {
                    existing.updateOAuthProfile(name, picture);
                    return existing;
                })
                .orElseGet(() -> userRepository.save(User.googleUser(email, name, picture, providerId)));
        return new OAuth2UserPrincipal(user, attributes);
    }
}
