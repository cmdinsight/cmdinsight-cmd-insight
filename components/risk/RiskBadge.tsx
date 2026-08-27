import { semaphore, type Trend } from "@/lib/score/engine";

const COLOR_CLASS: Record<string, string> = {
  low: "low",
  mod: "mod",
  high: "high",
};

export function RiskBadge({
  score,
  showScore = true,
  trend,
}: {
  score: number;
  showScore?: boolean;
  trend?: Trend;
}) {
  const s = semaphore(score);
  return (
    <span className={`risk-badge ${COLOR_CLASS[s.color]}`}>
      <span className="risk-dot" style={{ background: "currentColor" }} />
      {s.label}
      {showScore && <span className="opacity-70">· {score}/7</span>}
      {trend && trend !== "flat" && (
        <span aria-label={trend === "up" ? "empeorando" : "mejorando"}>
          {trend === "up" ? "↑" : "↓"}
        </span>
      )}
    </span>
  );
}

export function TrendArrow({ trend }: { trend: Trend }) {
  if (trend === "flat") return <span className="text-slatey">→</span>;
  return (
    <span className={trend === "up" ? "risk-high" : "risk-low"}>
      {trend === "up" ? "↑" : "↓"}
    </span>
  );
}
