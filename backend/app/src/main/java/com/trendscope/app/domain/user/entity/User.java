package com.trendscope.app.domain.user.entity;

import com.trendscope.app.domain.user.type.ProviderType;
import com.trendscope.app.domain.user.type.Role;
import com.trendscope.app.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.UUID;

@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_users_email", columnNames = "email"),
                @UniqueConstraint(name = "uk_users_provider_provider_id", columnNames = {"provider", "provider_id"})
        }
)
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider", nullable = false, length = 30)
    private ProviderType providerType;

    @Column(name = "provider_id", nullable = false, length = 120)
    private String providerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Role role;

    @Column(nullable = false)
    private boolean active = true;

    protected User() {
    }

    private User(String email, String name, String profileImageUrl, ProviderType providerType, String providerId) {
        this.email = email;
        this.name = name;
        this.profileImageUrl = profileImageUrl;
        this.providerType = providerType;
        this.providerId = providerId;
        this.role = Role.USER;
    }

    public static User googleUser(String email, String name, String profileImageUrl, String providerId) {
        return new User(email, name, profileImageUrl, ProviderType.GOOGLE, providerId);
    }

    public void updateOAuthProfile(String name, String profileImageUrl) {
        this.name = name;
        this.profileImageUrl = profileImageUrl;
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public Role getRole() {
        return role;
    }

    public boolean isActive() {
        return active;
    }
}
