import { TrendScopeApp } from "@/src/components/trend-scope/TrendScopeApp";
import { getTrendDashboardSnapshot } from "@/src/services/trendDashboardService";

export default function Home() {
  const snapshot = getTrendDashboardSnapshot();

  return <TrendScopeApp initialSnapshot={snapshot} />;
}
