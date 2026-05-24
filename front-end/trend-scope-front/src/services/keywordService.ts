import type { CreateKeywordRequestDto, KeywordResponseDto } from "@/src/types/api";
import type { KeywordViewModel } from "@/src/types/trend";
import { requestBackendApi } from "./apiClient";

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

function mapKeywordDtoToViewModel(keywordDto: KeywordResponseDto): KeywordViewModel {
  return {
    id: keywordDto.id,
    label: keywordDto.name,
    isHot: false,
    isActive: true,
  };
}
