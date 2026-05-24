package com.trendscope.app.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String BEARER_AUTH = "bearerAuth";

    @Bean
    public OpenAPI trendPulseOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("TrendPulse API")
                        .description("""
                                AI 기반 뉴스 키워드 트렌드 분석 플랫폼 API 문서입니다.
                                인증은 Google OAuth 로그인 후 발급되는 JWT Bearer Token을 사용합니다.
                                일반 이메일/비밀번호 회원가입과 로그인은 지원하지 않습니다.
                                Swagger Authorize 버튼에는 Bearer 없이 JWT 값만 입력합니다.
                                """)
                        .version("v1.0.0")
                        .license(new License().name("Capstone Project")))
                .components(new Components()
                        .addSecuritySchemes(BEARER_AUTH, new SecurityScheme()
                                .name(BEARER_AUTH)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Google OAuth 로그인 후 발급받은 JWT Access Token을 입력합니다. Bearer prefix는 입력하지 않습니다.")))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_AUTH));
    }

    @Bean
    public OpenApiCustomizer googleOAuthLoginEndpointCustomizer() {
        return openApi -> openApi.path("/oauth2/authorization/google", new PathItem().get(new Operation()
                .tags(java.util.List.of("Auth"))
                .summary("Google OAuth 로그인 시작")
                .description("Spring Security가 제공하는 Google OAuth 로그인 시작 엔드포인트입니다. Bearer Token이 필요하지 않습니다.")
                .responses(new ApiResponses()
                        .addApiResponse("302", new ApiResponse().description("Google OAuth 로그인 페이지로 redirect"))
                        .addApiResponse("500", new ApiResponse()
                                .description("OAuth 설정 오류")
                                .content(new Content().addMediaType("application/json", new MediaType()
                                        .schema(new Schema<>().example("""
                                                {"success":false,"errorCode":"OAUTH_CONFIG_ERROR","message":"OAuth 설정이 올바르지 않습니다."}
                                                """))))))));
    }

    @Bean
    public GroupedOpenApi authApi() {
        return GroupedOpenApi.builder()
                .group("1. Auth & User")
                .pathsToMatch("/oauth2/**", "/api/users/**", "/api/auth/**")
                .build();
    }

    @Bean
    public GroupedOpenApi onboardingApi() {
        return GroupedOpenApi.builder()
                .group("2. Onboarding Keywords")
                .pathsToMatch("/api/onboarding/keywords/**")
                .build();
    }

    @Bean
    public GroupedOpenApi boardApi() {
        return GroupedOpenApi.builder()
                .group("3. Board")
                .pathsToMatch("/api/posts/**", "/api/comments/**")
                .build();
    }
}
