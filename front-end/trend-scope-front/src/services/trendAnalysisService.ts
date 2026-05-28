import type { TrendAnalysisSummaryResponseDto } from "@/src/types/api";
import type { TrendAnalysisSummaryViewModel } from "@/src/types/trend";
import { requestBackendApi } from "./apiClient";

/**
 * 백엔드가 집계한 최신 트렌드 점수 요약을 조회한다.
 */
export async function fetchTrendAnalysisSummary(): Promise<TrendAnalysisSummaryViewModel> {
  const summaryDto = await requestBackendApi<TrendAnalysisSummaryResponseDto>(
    "/api/trend-analysis/summary",
  );

  return mapTrendAnalysisSummaryDtoToViewModel(summaryDto);
}

function mapTrendAnalysisSummaryDtoToViewModel(
  summaryDto: TrendAnalysisSummaryResponseDto,
): TrendAnalysisSummaryViewModel {
  return {
    trendScore: summaryDto.trendScore,
    trendScoreLabel: summaryDto.trendScore.toFixed(2),
  };
}
