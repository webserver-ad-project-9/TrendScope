import type {
  BriefingViewModel,
  KeywordSearchBriefingViewModel,
  TrendDashboardSnapshot,
} from "@/src/types/trend";

/**
 * API 계약이 확정되기 전까지 샘플 디자인을 렌더링하기 위한 초기 뷰 모델을 제공한다.
 * 외부 뉴스/AI API를 호출하지 않으며, 실제 upstream 연동은 별도 service/client 계약 확정 후 추가한다.
 */
export function getTrendDashboardSnapshot(): TrendDashboardSnapshot {
  return {
    heroMetrics: [
      { label: "언급량 증가", value: "128%" },
      { label: "수집 기사", value: "300" },
      { label: "핵심 뉴스", value: "24" },
      { label: "핫 키워드", value: "5" },
    ],
    featureChips: ["AI 요약", "뉴스 링크", "키워드 추적", "커뮤니티 토론"],
    onboardingKeywordOptions: [
      { id: "onboarding-ai-chip", label: "AI 반도체", description: "HBM, 데이터센터, GPU" },
      { id: "onboarding-economy", label: "경제", description: "증시, 금리, 기업 실적" },
      { id: "onboarding-politics", label: "정치", description: "국회, 정당, 선거 이슈" },
      { id: "onboarding-it", label: "IT", description: "AI, 플랫폼, 반도체 기술" },
      { id: "onboarding-bitcoin", label: "비트코인", description: "가상자산, ETF, 시세 흐름" },
      { id: "onboarding-samsung", label: "삼성전자", description: "실적, HBM, 공급망" },
      { id: "onboarding-culture", label: "문화", description: "콘텐츠, 엔터, 라이프스타일" },
      { id: "onboarding-global", label: "세계", description: "해외 시장과 국제 이슈" },
    ],
    keywords: [
      { id: "keyword-samsung", label: "삼성전자", isHot: true, isActive: true },
      { id: "keyword-ai", label: "AI", isHot: false, isActive: true },
      { id: "keyword-chip", label: "반도체", isHot: false, isActive: true },
      { id: "keyword-politics", label: "이준석", isHot: false, isActive: true },
      { id: "keyword-bitcoin", label: "비트코인", isHot: false, isActive: true },
    ],
    summaryHighlights: [
      "엔비디아 주가 최고가 경신과 AI 인프라 투자 확대가 함께 언급되고 있습니다.",
      "삼성전자는 HBM 공급 기대와 실적 전망이 같은 기사 묶음에서 반복 등장합니다.",
      "정치권에서는 이준석 관련 발언과 신당 이슈의 언급량이 빠르게 늘었습니다.",
    ],
    newsArticles: [
      {
        id: "news-nvidia-market",
        time: "14:32",
        title: "엔비디아 시총 또 사상 최고, AI 수요 폭발",
        source: "TrendScope Brief",
        href: "#",
      },
      {
        id: "news-samsung-hbm",
        time: "14:21",
        title: "삼성전자, HBM 기대감에 주가 상승",
        source: "TrendScope Brief",
        href: "#",
      },
      {
        id: "news-politics-party",
        time: "14:12",
        title: "이준석 신당 창당 선언, 정치권 파장",
        source: "TrendScope Brief",
        href: "#",
      },
      {
        id: "news-chip-competition",
        time: "13:58",
        title: "AI 반도체 경쟁 심화, 국내 기업 수혜 기대",
        source: "TrendScope Brief",
        href: "#",
      },
    ],
    communityBoardSections: [
      { id: "politics", label: "정치", description: "국회, 정당, 선거 이슈" },
      { id: "economy", label: "경제", description: "증시, 기업, 산업 흐름" },
      { id: "society", label: "사회", description: "생활, 정책, 사건 이슈" },
      { id: "it", label: "IT/과학", description: "AI, 플랫폼, 반도체 기술" },
      { id: "global", label: "세계", description: "해외 시장과 국제 이슈" },
      { id: "sports", label: "스포츠", description: "스포츠 이슈와 경기 흐름" },
      { id: "entertainment", label: "연예", description: "방송, 콘텐츠, 연예 이슈" },
    ],
    boardPosts: [],
    trendPoints: [
      { label: "09시", count: 42 },
      { label: "10시", count: 68 },
      { label: "11시", count: 77 },
      { label: "12시", count: 95 },
      { label: "13시", count: 121 },
      { label: "14시", count: 146 },
      { label: "15시", count: 132 },
    ],
    wordFrequencies: [
      { label: "AI", weight: 5 },
      { label: "HBM", weight: 4 },
      { label: "삼성전자", weight: 5 },
      { label: "엔비디아", weight: 4 },
      { label: "반도체", weight: 5 },
      { label: "투자", weight: 3 },
      { label: "실적", weight: 3 },
      { label: "공급", weight: 3 },
      { label: "신당", weight: 2 },
      { label: "비트코인", weight: 2 },
    ],
    relatedKeywords: [
      { label: "HBM", description: "AI 반도체 공급망과 함께 언급" },
      { label: "실적 발표", description: "삼성전자 키워드의 주요 문맥" },
      { label: "엔비디아", description: "글로벌 AI 투자 이슈와 연결" },
      { label: "신당", description: "정치 뉴스 묶음에서 동반 상승" },
      { label: "데이터센터", description: "AI 인프라 투자 기사와 연결" },
      { label: "기관 매수", description: "증시 기사에서 반복 등장" },
    ],
  };
}

export function getDefaultBriefingViewModel(snapshot: TrendDashboardSnapshot): BriefingViewModel {
  return {
    title: "오늘의 AI 브리핑",
    description: "내가 등록한 키워드를 기준으로 오늘의 이슈를 요약합니다.",
    summaryIntro:
      "오늘은 AI 반도체, 삼성전자 실적, 정치권 이슈 관련 뉴스가 가장 많이 언급되었습니다.",
    keywordPanelTitle: "내 키워드",
    keywords: snapshot.keywords,
    summaryHighlights: snapshot.summaryHighlights,
    newsArticles: snapshot.newsArticles,
    trendPoints: snapshot.trendPoints,
    wordFrequencies: snapshot.wordFrequencies,
    relatedKeywords: snapshot.relatedKeywords,
  };
}

export function createKeywordSearchBriefing(
  keyword: string,
  snapshot: TrendDashboardSnapshot,
): KeywordSearchBriefingViewModel {
  const normalizedKeyword = keyword.trim();

  return {
    title: `${normalizedKeyword} AI 브리핑`,
    description: "검색한 키워드 기준으로 뉴스 흐름과 관련 신호를 브리핑 형식으로 제공합니다.",
    summaryIntro: `${normalizedKeyword} 관련 최근 뉴스에서는 언급량 증가, 시장 기대감, 관련 키워드 확산이 함께 관찰됩니다.`,
    keywordPanelTitle: "검색 키워드",
    keyword: normalizedKeyword,
    keywords: [
      {
        id: `search-keyword-${normalizedKeyword}`,
        label: normalizedKeyword,
        isHot: true,
        isActive: true,
      },
      ...snapshot.relatedKeywords.slice(0, 4).map((relatedKeyword, index) => ({
        id: `search-related-${index}`,
        label: relatedKeyword.label,
        isHot: false,
        isActive: true,
      })),
    ],
    summaryHighlights: [
      `${normalizedKeyword} 키워드는 최근 기사 묶음에서 반복적으로 등장하며 관심도가 상승한 상태입니다.`,
      `관련 문맥은 ${snapshot.relatedKeywords
        .slice(0, 3)
        .map((relatedKeyword) => relatedKeyword.label)
        .join(", ")} 키워드와 함께 묶입니다.`,
      "시간대별 언급량은 오후 구간에서 가장 높은 흐름을 보입니다.",
    ],
    newsArticles: snapshot.newsArticles.map((article, index) => ({
      ...article,
      id: `search-${normalizedKeyword}-${article.id}`,
      title:
        index === 0
          ? `${normalizedKeyword} 관련 언급량 증가, 핵심 이슈 부상`
          : `${normalizedKeyword} 흐름과 연결된 뉴스: ${article.title}`,
    })),
    trendPoints: snapshot.trendPoints.map((point, index) => ({
      ...point,
      count: point.count + (index + 1) * 4,
    })),
    wordFrequencies: [
      { label: normalizedKeyword, weight: 5 },
      ...snapshot.wordFrequencies.filter((word) => word.label !== normalizedKeyword).slice(0, 8),
    ],
    relatedKeywords: snapshot.relatedKeywords,
  };
}
