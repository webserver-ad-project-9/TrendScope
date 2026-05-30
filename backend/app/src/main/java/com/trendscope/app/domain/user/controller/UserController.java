package com.trendscope.app.domain.user.controller;

import com.trendscope.app.domain.user.dto.UserProfileResponse;
import com.trendscope.app.domain.user.service.UserService;
import com.trendscope.app.global.response.ApiResponse;
import com.trendscope.app.global.security.principal.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User", description = "현재 로그인한 사용자 API")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "현재 사용자 조회", description = "JWT 인증에 성공한 현재 사용자의 프로필 정보를 조회합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "현재 사용자 조회 성공",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class),
                            examples = @ExampleObject(value = "{\"success\":true,\"data\":{\"id\":\"4f4f9a2d-22e3-4b4e-8d01-83f9959dfc71\",\"email\":\"user@example.com\",\"name\":\"홍길동\",\"role\":\"USER\"},\"message\":\"요청 성공\"}"))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "JWT 인증 실패",
                    content = @Content(examples = @ExampleObject(value = "{\"success\":false,\"errorCode\":\"INVALID_JWT_TOKEN\",\"message\":\"유효하지 않은 토큰입니다.\"}"))
            )
    })
    public ApiResponse<UserProfileResponse> me(@AuthenticationPrincipal CustomUserDetails principal) {
        return ApiResponse.ok(userService.getProfile(principal.userId()));
    }
}
