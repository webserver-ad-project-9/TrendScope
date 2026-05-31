package com.trendscope.app.domain.keyword.controller;

import com.trendscope.app.domain.keyword.dto.KeywordBulkCreateRequest;
import com.trendscope.app.domain.keyword.dto.KeywordCreateRequest;
import com.trendscope.app.domain.keyword.dto.KeywordReplaceRequest;
import com.trendscope.app.domain.keyword.dto.KeywordResponse;
import com.trendscope.app.domain.keyword.service.KeywordService;
import com.trendscope.app.global.response.ApiResponse;
import com.trendscope.app.global.security.principal.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/onboarding/keywords")
@Tag(name = "Onboarding Keyword", description = "사용자 온보딩 관심 키워드 API")
public class KeywordController {

    private final KeywordService keywordService;

    public KeywordController(KeywordService keywordService) {
        this.keywordService = keywordService;
    }

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "온보딩 키워드 생성", description = "현재 로그인한 사용자의 관심 키워드를 생성합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "키워드 생성 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "키워드 최대 등록 개수 초과",
                    content = @Content(examples = @ExampleObject(value = "{\"success\":false,\"errorCode\":\"KEYWORD_LIMIT_EXCEEDED\",\"message\":\"Keyword registration limit exceeded\"}"))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "사용자별 키워드 중복",
                    content = @Content(examples = @ExampleObject(value = "{\"success\":false,\"errorCode\":\"KEYWORD_DUPLICATED\",\"message\":\"이미 등록된 키워드입니다.\"}")))
    })
    public ApiResponse<KeywordResponse> create(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails principal,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "생성할 온보딩 키워드",
                    required = true,
                    content = @Content(schema = @Schema(implementation = KeywordCreateRequest.class))
            )
            @Valid @RequestBody KeywordCreateRequest request) {
        return ApiResponse.ok(keywordService.create(principal.userId(), request));
    }

    @PostMapping("/bulk")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "온보딩 키워드 일괄 생성", description = "프론트 토글 UI에서 선택한 여러 관심 키워드를 한 번에 저장합니다. 이미 저장된 키워드는 건너뜁니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "키워드 일괄 생성 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "요청값 검증 실패 또는 키워드 최대 등록 개수 초과",
                    content = @Content(examples = @ExampleObject(value = "{\"success\":false,\"errorCode\":\"KEYWORD_LIMIT_EXCEEDED\",\"message\":\"Keyword registration limit exceeded\"}")))
    })
    public ApiResponse<List<KeywordResponse>> createBulk(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails principal,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "일괄 생성할 온보딩 키워드 목록",
                    required = true,
                    content = @Content(schema = @Schema(implementation = KeywordBulkCreateRequest.class))
            )
            @Valid @RequestBody KeywordBulkCreateRequest request) {
        return ApiResponse.ok(keywordService.createBulk(principal.userId(), request));
    }

    @PutMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "마이페이지 온보딩 키워드 목록 교체", description = "마이페이지에서 저장한 전체 키워드 목록으로 현재 활성 키워드를 교체합니다.")
    public ApiResponse<List<KeywordResponse>> replaceAll(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody KeywordReplaceRequest request) {
        return ApiResponse.ok(keywordService.replaceAll(principal.userId(), request));
    }

    @PatchMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "마이페이지 온보딩 키워드 목록 교체", description = "PUT과 동일하게 전체 키워드 목록을 저장합니다.")
    public ApiResponse<List<KeywordResponse>> patchAll(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody KeywordReplaceRequest request) {
        return ApiResponse.ok(keywordService.replaceAll(principal.userId(), request));
    }

    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "내 온보딩 키워드 목록 조회", description = "현재 로그인한 사용자가 등록한 온보딩 키워드 목록을 조회합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "키워드 목록 조회 성공")
    })
    public ApiResponse<List<KeywordResponse>> findMine(@Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails principal) {
        return ApiResponse.ok(keywordService.findMine(principal.userId()));
    }

    @DeleteMapping("/{keywordId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "온보딩 키워드 삭제", description = "현재 로그인한 사용자가 등록한 관심 키워드를 비활성화하여 뉴스 수집 및 추천 대상에서 제외합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "키워드 삭제 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "키워드 없음 또는 현재 사용자의 키워드가 아님",
                    content = @Content(examples = @ExampleObject(value = "{\"success\":false,\"errorCode\":\"KEYWORD_NOT_FOUND\",\"message\":\"Keyword not found\"}")))
    })
    public ApiResponse<Void> delete(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails principal,
            @Parameter(description = "삭제할 온보딩 키워드 ID", required = true)
            @PathVariable UUID keywordId) {
        keywordService.delete(principal.userId(), keywordId);
        return ApiResponse.ok();
    }
}
