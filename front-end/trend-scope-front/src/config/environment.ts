const DEFAULT_ACCESS_TOKEN_STORAGE_KEY = "accessToken";
const DEFAULT_ACCESS_TOKEN_COOKIE_KEY = "accessToken";
const DEFAULT_ACCESS_TOKEN_COOKIE_MAX_AGE_SECONDS = 3600;

export class EnvironmentConfigurationError extends Error {
  readonly variableName: string;

  constructor(variableName: string) {
    super(`${variableName} 환경변수가 설정되지 않았습니다.`);
    this.name = "EnvironmentConfigurationError";
    this.variableName = variableName;
  }
}

export interface FrontendEnvironment {
  readonly backendApiBaseUrl: string;
  readonly accessTokenStorageKey: string;
  readonly accessTokenCookieKey: string;
  readonly accessTokenCookieMaxAgeSeconds: number;
}

/**
 * Next.js가 build time에 주입하는 공개 환경변수를 읽는다.
 */
export function getFrontendEnvironment(): FrontendEnvironment {
  return {
    backendApiBaseUrl: getRequiredBackendApiBaseUrl(),
    accessTokenStorageKey:
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_STORAGE_KEY ?? DEFAULT_ACCESS_TOKEN_STORAGE_KEY,
    accessTokenCookieKey:
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_COOKIE_KEY ?? DEFAULT_ACCESS_TOKEN_COOKIE_KEY,
    accessTokenCookieMaxAgeSeconds: readPositiveIntegerEnvironmentValue(
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_COOKIE_MAX_AGE_SECONDS,
      DEFAULT_ACCESS_TOKEN_COOKIE_MAX_AGE_SECONDS,
    ),
  };
}

function getRequiredBackendApiBaseUrl(): string {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

  if (configuredBaseUrl === undefined || configuredBaseUrl.trim().length === 0) {
    throw new EnvironmentConfigurationError("NEXT_PUBLIC_BACKEND_API_BASE_URL");
  }

  return configuredBaseUrl.replace(/\/$/, "");
}

function readPositiveIntegerEnvironmentValue(
  value: string | undefined,
  fallbackValue: number,
): number {
  if (value === undefined || value.trim().length === 0) {
    return fallbackValue;
  }

  const parsedValue = Number.parseInt(value, 10);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallbackValue;
}
