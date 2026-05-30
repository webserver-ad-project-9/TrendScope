import type {
  CreateKeywordRequestDto,
  CreateKeywordsBulkRequestDto,
  KeywordResponseDto,
} from "@/src/types/api";
import type { KeywordViewModel } from "@/src/types/trend";
import { requestBackendApi } from "./apiClient";

const pendingOnboardingKeywordStorageKey = "trendscope.pendingOnboardingKeywords";

/**
 * 현재 사용자의 온보딩 키워드 목록을 백엔드에서 조회한다.
 */
export async function fetchOnboardingKeywords(): Promise<readonly KeywordViewModel[]> {
  const keywordDtos =
    await requestBackendApi<readonly KeywordResponseDto[]>("/api/onboarding/keywords");

  return keywordDtos.map(mapKeywordDtoToViewModel);
}

/**
 * 현재 사용자의 온보딩 키워드를 백엔드에 생성한다.
 */
export async function createOnboardingKeyword(name: string): Promise<KeywordViewModel> {
  const requestBody: CreateKeywordRequestDto = { name };
  const keywordDto = await requestBackendApi<KeywordResponseDto>("/api/onboarding/keywords", {
    method: "POST",
    body: requestBody,
  });

  return mapKeywordDtoToViewModel(keywordDto);
}

/**
 * 로그인 직후 저장할 초기 온보딩 키워드 목록을 백엔드에 일괄 생성한다.
 */
export async function createOnboardingKeywordsBulk(
  names: readonly string[],
): Promise<readonly KeywordViewModel[]> {
  const normalizedNames = normalizeKeywordNames(names);

  if (normalizedNames.length === 0) {
    return [];
  }

  const requestBody: CreateKeywordsBulkRequestDto = { names: normalizedNames };
  const keywordDtos = await requestBackendApi<readonly KeywordResponseDto[]>(
    "/api/onboarding/keywords/bulk",
    {
      method: "POST",
      body: requestBody,
    },
  );

  return keywordDtos.map(mapKeywordDtoToViewModel);
}

/**
 * OAuth 전 온보딩을 사용하던 이전 버전의 임시 저장값을 제거한다.
 */
export function clearPendingOnboardingKeywordNames(): void {
  if (!isBrowserRuntime()) {
    return;
  }

  window.localStorage.removeItem(pendingOnboardingKeywordStorageKey);
}

function mapKeywordDtoToViewModel(keywordDto: KeywordResponseDto): KeywordViewModel {
  return {
    id: keywordDto.id,
    label: keywordDto.name,
    isHot: false,
    isActive: true,
  };
}

function normalizeKeywordNames(names: readonly string[]): readonly string[] {
  const normalizedNames = names
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  return [...new Set(normalizedNames)];
}

function isBrowserRuntime(): boolean {
  return typeof window !== "undefined";
}
