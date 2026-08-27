// Gráficos en SVG puro — sin dependencias. Componentes de servidor (deterministas).

type Point = { label?: string; value: number };

export function Sparkline({
  data,
  width = 120,
  height = 34,
  stroke = "#173a63",
}: {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
}) {
  if (data.length < 2) return <svg width={width} height={height} />;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const step = width / (data.length - 1);
  const d = data
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / span) * (height - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <path d={d} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Barras de carga diaria + líneas de promedio 7d / 28d. */
export function LoadBars({
  data,
  acute,
  chronic,
  height = 200,
}: {
  data: Point[];
  acute?: number;
  chronic?: number;
  height?: number;
}) {
  const W = 720;
  const H = height;
  const pad = { top: 16, right: 12, bottom: 22, left: 34 };
  const iw = W - pad.left - pad.right;
  const ih = H - pad.top - pad.bottom;
  const max = Math.max(...data.map((d) => d.value), acute ?? 0, chronic ?? 0, 1) * 1.1;
  const bw = iw / data.length;
  const y = (v: number) => pad.top + ih - (v / max) * ih;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block" role="img" aria-label="Carga diaria">
      {/* grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line
            x1={pad.left}
            x2={W - pad.right}
            y1={pad.top + ih * t}
            y2={pad.top + ih * t}
            stroke="#e4eaf1"
          />
          <text x={4} y={pad.top + ih * t + 4} fontSize={10} fill="#5b6b7f">
            {Math.round(max * (1 - t))}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const h = pad.top + ih - y(d.value);
        return (
          <rect
            key={i}
            x={pad.left + i * bw + bw * 0.16}
            y={y(d.value)}
            width={bw * 0.68}
            height={Math.max(0, h)}
            rx={2}
            fill="#9db4cc"
          />
        );
      })}
      {chronic != null && (
        <line
          x1={pad.left}
          x2={W - pad.right}
          y1={y(chronic)}
          y2={y(chronic)}
          stroke="#173a63"
          strokeWidth={2}
          strokeDasharray="2 3"
        />
      )}
      {acute != null && (
        <line x1={pad.left} x2={W - pad.right} y1={y(acute)} y2={y(acute)} stroke="#0e9aa1" strokeWidth={2} />
      )}
    </svg>
  );
}

/** Barras verticales simples (p. ej. carga semanal del equipo). */
export function SimpleBars({
  data,
  height = 160,
  color = "#173a63",
}: {
  data: Point[];
  height?: number;
  color?: string;
}) {
  const W = 520;
  const H = height;
  const pad = { top: 12, right: 8, bottom: 26, left: 8 };
  const iw = W - pad.left - pad.right;
  const ih = H - pad.top - pad.bottom;
  const max = Math.max(...data.map((d) => d.value), 1) * 1.1;
  const bw = iw / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block" role="img" aria-label="Carga semanal">
      {data.map((d, i) => {
        const bh = (d.value / max) * ih;
        return (
          <g key={i}>
            <rect
              x={pad.left + i * bw + bw * 0.2}
              y={pad.top + ih - bh}
              width={bw * 0.6}
              height={bh}
              rx={3}
              fill={color}
              opacity={i === data.length - 1 ? 1 : 0.55}
            />
            {d.label && (
              <text
                x={pad.left + i * bw + bw / 2}
                y={H - 8}
                fontSize={10}
                fill="#5b6b7f"
                textAnchor="middle"
              >
                {d.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
