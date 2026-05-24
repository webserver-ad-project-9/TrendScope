import type {
  RelatedKeywordViewModel,
  TrendPointViewModel,
  WordFrequencyViewModel,
} from "@/src/types/trend";

interface TrendBarChartProps {
  readonly points: readonly TrendPointViewModel[];
}

interface WordCloudProps {
  readonly words: readonly WordFrequencyViewModel[];
}

interface RelatedKeywordMapProps {
  readonly keywords: readonly RelatedKeywordViewModel[];
}

export function TrendBarChart({ points }: TrendBarChartProps) {
  const maxCount = Math.max(...points.map((point) => point.count));

  return (
    <div className="trend-panel" aria-label="시간대별 기사 수 변화">
      <div className="trend-chart">
        {points.map((point) => (
          <div
            className="trend-bar"
            key={point.label}
            style={{ height: `${Math.max(18, (point.count / maxCount) * 100)}%` }}
            title={`${point.label} ${point.count}건`}
          >
            <span>{point.count}</span>
          </div>
        ))}
      </div>
      <div className="trend-axis">
        {points.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}

export function WordCloud({ words }: WordCloudProps) {
  return (
    <div className="trend-panel word-cloud" aria-label="주요 단어 빈도">
      {words.map((word) => (
        <span
          key={word.label}
          style={{
            color: word.weight >= 5 ? "var(--accent)" : word.weight >= 4 ? "var(--teal)" : "#dce5f2",
            fontSize: `${14 + word.weight * 6}px`,
          }}
        >
          {word.label}
        </span>
      ))}
    </div>
  );
}

export function RelatedKeywordMap({ keywords }: RelatedKeywordMapProps) {
  return (
    <div className="trend-panel relation-map" aria-label="관련 키워드 그래프">
      {keywords.map((keyword) => (
        <div className="relation-node" key={keyword.label}>
          <strong>{keyword.label}</strong>
          <span>{keyword.description}</span>
        </div>
      ))}
    </div>
  );
}

export function SignalMapVisual() {
  return (
    <div className="mini-visual" aria-label="트렌드 신호 시각화">
      <svg aria-hidden="true" viewBox="0 0 760 220" preserveAspectRatio="none">
        <path
          d="M22 170 C110 120 155 186 242 132 C322 82 365 104 440 72 C535 30 606 55 734 34"
          fill="none"
          stroke="rgba(53, 214, 194, 0.9)"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <path
          d="M22 190 C118 176 155 128 238 152 C336 180 395 128 460 118 C560 104 625 132 736 84"
          fill="none"
          stroke="rgba(255, 108, 63, 0.72)"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
      <div className="pulse-card pulse-card-a">
        AI
        <small>+128%</small>
      </div>
      <div className="pulse-card pulse-card-b">
        HBM
        <small>연관 상승</small>
      </div>
      <div className="pulse-card pulse-card-c">
        반도체
        <small>핵심 이슈</small>
      </div>
    </div>
  );
}
