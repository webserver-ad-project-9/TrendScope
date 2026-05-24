package com.trendscope.app.domain.auth.controller;

import com.trendscope.app.domain.auth.service.AuthService;
import com.trendscope.app.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "Google OAuth 로그인과 로그아웃 API")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/login")
    @Operation(
            summary = "Google OAuth 로그인 진입",
            description = "프론트엔드가 호출하면 Spring Security 기본 엔드포인트인 /oauth2/authorization/google 로 redirect합니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "302", description = "Google OAuth 로그인 페이지로 redirect")
    })
    public String googleLogin() {
        return "redirect:/oauth2/authorization/google";
    }

    @PostMapping("/logout")
    @ResponseBody
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "로그아웃", description = "Access Token only MVP 구조에서는 클라이언트가 localStorage의 token을 삭제하면 됩니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "로그아웃 성공",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class),
                            examples = @ExampleObject(value = "{\"success\":true,\"data\":null,\"message\":\"요청 성공\"}"))
            )
    })
    public ApiResponse<Void> logout() {
        authService.logout();
        return ApiResponse.ok();
    }
}
