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
      { id: "economy", label: "경제", description: "증시, 기업, 산업 흐름" },
      { id: "society", label: "사회", description: "생활, 정책, 사건 이슈" },
      { id: "it", label: "IT", description: "AI, 플랫폼, 반도체 기술" },
      { id: "politics", label: "정치", description: "국회, 정당, 선거 이슈" },
      { id: "culture", label: "문화", description: "콘텐츠, 엔터, 라이프스타일" },
      { id: "global", label: "세계", description: "해외 시장과 국제 이슈" },
    ],
    boardPosts: [
      {
        id: "post-ai-chip-entry",
        boardSectionId: "it",
        category: "토론",
        title: "AI 반도체 지금 들어가도 될까?",
        author: "민재",
        commentCount: 12,
        body: "요즘 AI 반도체 뉴스가 너무 많이 올라오는데, 실제로 시장이 더 갈 수 있을지 궁금합니다. 뉴스 언급량은 확실히 늘었지만 이미 가격에 반영된 건 아닌지도 고민됩니다.",
        comments: [
          {
            id: "comment-ai-chip-1",
            author: "trendguy",
            body: "단기 이슈보다는 HBM 공급 쪽을 봐야 할 듯합니다.",
          },
          {
            id: "comment-ai-chip-2",
            author: "익명",
            body: "뉴스량만 보고 들어가면 위험할 수도 있습니다.",
          },
        ],
      },
      {
        id: "post-samsung-earning",
        boardSectionId: "economy",
        category: "질문",
        title: "삼성전자 실적 호재 맞음?",
        author: "익명",
        commentCount: 8,
        body: "실적 기대감과 HBM 공급 전망이 같이 나오는데, 실제 지표와 뉴스 분위기를 분리해서 보고 싶습니다.",
        comments: [
          {
            id: "comment-samsung-1",
            author: "pulse",
            body: "실적 발표일 전후로 언급량 변화가 커지는지 같이 보면 좋겠습니다.",
          },
        ],
      },
      {
        id: "post-briefing-quality",
        boardSectionId: "it",
        category: "후기",
        title: "오늘 뉴스 요약 퀄리티 괜찮네",
        author: "pulse",
        commentCount: 3,
        body: "관련 키워드 묶음이 기사 리스트와 같이 보여서 흐름 파악이 빨랐습니다.",
        comments: [
          {
            id: "comment-quality-1",
            author: "민재",
            body: "뉴스 링크까지 같이 열 수 있으면 더 편할 것 같습니다.",
          },
        ],
      },
      {
        id: "post-rate-market",
        boardSectionId: "economy",
        category: "토론",
        title: "금리 인하 기대감이 코스피에 바로 반영될까?",
        author: "marketwatch",
        commentCount: 6,
        body: "최근 금리 관련 뉴스가 증시 기사와 같이 묶이는데, 실제 업종별 영향은 다르게 봐야 할 것 같습니다.",
        comments: [
          {
            id: "comment-rate-1",
            author: "현우",
            body: "성장주와 금융주는 반응 방향이 달라서 나눠 보는 게 좋겠습니다.",
          },
        ],
      },
      {
        id: "post-society-policy",
        boardSectionId: "society",
        category: "질문",
        title: "대중교통 정책 뉴스 언급량이 왜 갑자기 늘었지?",
        author: "익명",
        commentCount: 4,
        body: "출퇴근 시간대 이슈와 정책 발표가 같이 나온 것 같은데 관련 기사 묶음을 더 보고 싶습니다.",
        comments: [
          {
            id: "comment-policy-1",
            author: "pulse",
            body: "지역 키워드를 같이 넣으면 흐름이 더 잘 보일 것 같습니다.",
          },
        ],
      },
      {
        id: "post-politics-election",
        boardSectionId: "politics",
        category: "토론",
        title: "정치권 키워드는 발언 하나에도 너무 크게 움직이네",
        author: "civic",
        commentCount: 10,
        body: "정당명보다 인물명으로 추적할 때 언급량이 더 빠르게 튀는 것 같습니다.",
        comments: [
          {
            id: "comment-politics-1",
            author: "민재",
            body: "뉴스 제목 기준이면 인물 키워드가 훨씬 민감하게 잡히는 듯합니다.",
          },
        ],
      },
      {
        id: "post-culture-streaming",
        boardSectionId: "culture",
        category: "후기",
        title: "OTT 신작 공개일에 관련 키워드가 확 올라오네",
        author: "contentlab",
        commentCount: 5,
        body: "엔터 뉴스는 공개일, 출연자, 플랫폼 키워드가 같이 움직이는 패턴이 뚜렷합니다.",
        comments: [
          {
            id: "comment-culture-1",
            author: "익명",
            body: "팬덤 이슈까지 섞이면 워드 클라우드가 재미있게 나올 것 같습니다.",
          },
        ],
      },
      {
        id: "post-global-ai-regulation",
        boardSectionId: "global",
        category: "토론",
        title: "EU AI 규제 뉴스가 국내 IT주에도 영향 줄까?",
        author: "globalreader",
        commentCount: 7,
        body: "해외 규제 뉴스와 국내 플랫폼 기업 기사가 같은 흐름으로 묶이는지 궁금합니다.",
        comments: [
          {
            id: "comment-global-1",
            author: "trendguy",
            body: "규제 키워드와 기업명을 같이 추적하면 연결이 보일 것 같습니다.",
          },
        ],
      },
    ],
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
