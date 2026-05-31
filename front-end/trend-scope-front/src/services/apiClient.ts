import type {
  ApiErrorResponseDto,
  ApiResponseDto,
  ApiSuccessResponseDto,
} from "@/src/types/api";
import { getFrontendEnvironment } from "@/src/config/environment";

type BackendApiAuthenticationMode = "required" | "optional" | "none";

interface BackendApiRequestOptions {
  readonly method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  readonly body?: unknown;
  readonly authentication?: BackendApiAuthenticationMode;
  readonly isAuthenticated?: boolean;
}

interface ApiClientErrorOptions {
  readonly status: number;
  readonly errorCode: string;
  readonly message: string;
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly errorCode: string;

  constructor({ errorCode, message, status }: ApiClientErrorOptions) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.errorCode = errorCode;
  }
}

/**
 * 백엔드 Base URL을 단일 경계에서 결정한다.
 */
export function getBackendApiBaseUrl(): string {
  return getFrontendEnvironment().backendApiBaseUrl;
}

/**
 * OAuth callback에서 전달받은 token을 브라우저 저장소와 쿠키에 반영한다.
 */
export function storeAccessToken(accessToken: string): void {
  if (!isBrowserRuntime()) {
    return;
  }

  const { accessTokenStorageKey } = getFrontendEnvironment();

  window.localStorage.setItem(accessTokenStorageKey, accessToken);
  writeAccessTokenCookie(accessToken);
}

/**
 * 브라우저에 저장된 토큰과 쿠키를 제거한다.
 */
export function clearAccessToken(): void {
  if (!isBrowserRuntime()) {
    return;
  }

  const { accessTokenCookieKey, accessTokenStorageKey } = getFrontendEnvironment();

  window.localStorage.removeItem(accessTokenStorageKey);
  document.cookie = `${accessTokenCookieKey}=; path=/; max-age=0`;
}

/**
 * API 호출에 필요한 Bearer token과 브라우저 쿠키를 함께 준비한다.
 */
export async function requestBackendApi<TData>(
  path: string,
  options: BackendApiRequestOptions = {},
): Promise<TData> {
  const headers = new Headers();
  const authenticationMode = resolveAuthenticationMode(options);
  let accessToken: string | null = null;

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (authenticationMode !== "none") {
    accessToken = readAvailableAccessToken();

    if (accessToken === null && authenticationMode === "required") {
      throw new ApiClientError({
        status: 401,
        errorCode: "MISSING_ACCESS_TOKEN",
        message: "로그인이 필요합니다.",
      });
    }

    if (accessToken !== null) {
      headers.set("Authorization", `Bearer ${accessToken}`);
      writeAccessTokenCookie(accessToken);
    }
  }

  const response = await fetch(`${getBackendApiBaseUrl()}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    credentials: accessToken === null ? "include" : "omit",
  });

  const payload = await readApiResponsePayload<TData>(response);

  if (!response.ok) {
    throw createApiClientError(response.status, payload);
  }

  if (isApiErrorResponseDto(payload)) {
    throw new ApiClientError({
      status: response.status,
      errorCode: payload.errorCode,
      message: payload.message,
    });
  }

  if (!isApiSuccessResponseDto<TData>(payload)) {
    throw new ApiClientError({
      status: response.status,
      errorCode: "INVALID_API_RESPONSE",
      message: "서비스 응답을 확인하지 못했습니다.",
    });
  }

  return payload.data;
}

function resolveAuthenticationMode(
  options: BackendApiRequestOptions,
): BackendApiAuthenticationMode {
  if (options.authentication !== undefined) {
    return options.authentication;
  }

  return options.isAuthenticated === false ? "none" : "required";
}

function readAvailableAccessToken(): string | null {
  if (!isBrowserRuntime()) {
    return null;
  }

  const { accessTokenStorageKey, developmentAccessToken } = getFrontendEnvironment();

  if (developmentAccessToken !== null) {
    storeAccessToken(developmentAccessToken);

    return developmentAccessToken;
  }

  const storedToken = window.localStorage.getItem(accessTokenStorageKey);

  if (storedToken !== null && storedToken.trim().length > 0) {
    return storedToken;
  }

  const cookieToken = readAccessTokenCookie();

  if (cookieToken !== null) {
    window.localStorage.setItem(accessTokenStorageKey, cookieToken);

    return cookieToken;
  }

  return null;
}

function writeAccessTokenCookie(accessToken: string): void {
  if (!isBrowserRuntime()) {
    return;
  }

  const { accessTokenCookieKey, accessTokenCookieMaxAgeSeconds } = getFrontendEnvironment();

  document.cookie = `${accessTokenCookieKey}=${encodeURIComponent(
    accessToken,
  )}; path=/; max-age=${accessTokenCookieMaxAgeSeconds}`;
}

function readAccessTokenCookie(): string | null {
  if (!isBrowserRuntime()) {
    return null;
  }

  const { accessTokenCookieKey } = getFrontendEnvironment();
  const cookieEntry = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${accessTokenCookieKey}=`));

  if (cookieEntry === undefined) {
    return null;
  }

  const rawCookieValue = cookieEntry.slice(accessTokenCookieKey.length + 1);

  let cookieToken: string;

  try {
    cookieToken = decodeURIComponent(rawCookieValue);
  } catch {
    return null;
  }

  return cookieToken.trim().length === 0 ? null : cookieToken;
}

async function readApiResponsePayload<TData>(
  response: Response,
): Promise<ApiResponseDto<TData> | null> {
  const responseText = await response.text();

  if (responseText.trim().length === 0) {
    return null;
  }

  try {
    return JSON.parse(responseText) as ApiResponseDto<TData>;
  } catch {
    return null;
  }
}

function createApiClientError<TData>(
  status: number,
  payload: ApiResponseDto<TData> | null,
): ApiClientError {
  if (isApiErrorResponseDto(payload)) {
    return new ApiClientError({
      status,
      errorCode: payload.errorCode,
      message: payload.message,
    });
  }

  return new ApiClientError({
    status,
    errorCode: "HTTP_REQUEST_FAILED",
    message: "요청 처리에 실패했습니다.",
  });
}

function isApiErrorResponseDto(value: unknown): value is ApiErrorResponseDto {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    value.success === false &&
    "errorCode" in value &&
    typeof value.errorCode === "string" &&
    "message" in value &&
    typeof value.message === "string"
  );
}

function isApiSuccessResponseDto<TData>(value: unknown): value is ApiSuccessResponseDto<TData> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    value.success === true &&
    "data" in value
  );
}

function isBrowserRuntime(): boolean {
  return typeof window !== "undefined";
}
