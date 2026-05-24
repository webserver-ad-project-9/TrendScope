import type { CurrentUserResponseDto } from "@/src/types/api";
import type { CurrentUserViewModel } from "@/src/types/auth";
import {
  clearAccessToken,
  getBackendApiBaseUrl,
  requestBackendApi,
  storeAccessToken,
} from "./apiClient";

/**
 * 백엔드 Google OAuth 시작 endpoint로 브라우저를 이동시킨다.
 */
export function startGoogleOAuthLogin(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.location.href = `${getBackendApiBaseUrl()}/api/auth`;
}

/**
 * 백엔드 OAuth callback redirect에서 전달받은 token을 저장한다.
 */
export function completeOAuthLogin(accessToken: string): void {
  storeAccessToken(accessToken);
}

/**
 * 현재 로그인 사용자를 백엔드에서 조회한다.
 */
export async function fetchCurrentUser(): Promise<CurrentUserViewModel> {
  const currentUserDto = await requestBackendApi<CurrentUserResponseDto>("/api/users/me");

  return mapCurrentUserDtoToViewModel(currentUserDto);
}

/**
 * 백엔드 로그아웃 호출 후 브라우저 토큰과 쿠키를 정리한다.
 */
export async function logoutCurrentUser(): Promise<void> {
  try {
    await requestBackendApi<null>("/api/auth/logout", { method: "POST" });
  } finally {
    clearAccessToken();
  }
}

function mapCurrentUserDtoToViewModel(
  currentUserDto: CurrentUserResponseDto,
): CurrentUserViewModel {
  return {
    id: currentUserDto.id,
    email: currentUserDto.email,
    name: currentUserDto.name,
    role: currentUserDto.role,
  };
}
