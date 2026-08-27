// Logo de CMD Insight — SVG inline, nítido en cualquier tamaño y fondo.
// `variant="dark"` para fondos oscuros (footer). Escala con `height`.
// TODO: reemplazar el isotipo por el SVG oficial cuando esté disponible.

type Variant = "light" | "dark";
type Props = { height?: number; className?: string; variant?: Variant; withWordmark?: boolean };

const RATIO = 330 / 60; // viewBox del lockup completo
const MARK_RATIO = 60 / 60;

function palette(v: Variant) {
  return v === "dark"
    ? { cmd: "rgba(255,255,255,0.65)", insight: "#ffffff", tag: "#5cc2c6", rule: "rgba(255,255,255,0.22)" }
    : { cmd: "#5b6b7f", insight: "#173a63", tag: "#0e9aa1", rule: "rgba(15,27,45,0.14)" };
}

function Isotype({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1c3f8f" />
          <stop offset="0.55" stopColor="#128a9c" />
          <stop offset="1" stopColor="#2fa958" />
        </linearGradient>
        <clipPath id={`${id}-c`}>
          <path d="M2,30 Q30,8 58,30 Q30,52 2,30 Z" />
        </clipPath>
      </defs>
      <path d="M2,30 Q30,8 58,30 Q30,52 2,30 Z" fill={`url(#${id}-g)`} />
      <g
        clipPath={`url(#${id}-c)`}
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="10,36 20,29 26,32 36,21 46,25" strokeWidth="2.3" />
        <circle cx="10" cy="36" r="2" fill="#fff" stroke="none" />
        <circle cx="26" cy="32" r="2" fill="#fff" stroke="none" />
        <circle cx="46" cy="25" r="2" fill="#fff" stroke="none" />
        <path d="M14,19 v6 M11,22 h6" strokeWidth="2.3" />
        <circle cx="39" cy="20" r="2.2" fill="#fff" stroke="none" />
        <path
          d="M39,22.5 L35,30 M35,30 L40,37 M35,30 L30,34 M37,25 L43,23 M37,25 L32,28"
          strokeWidth="2.4"
        />
      </g>
    </>
  );
}

export default function Logo({
  height = 32,
  className = "",
  variant = "light",
  withWordmark = true,
}: Props) {
  const c = palette(variant);
  const id = `cmdi-${variant}${withWordmark ? "" : "-m"}`;

  if (!withWordmark) {
    return (
      <svg
        height={height}
        width={Math.round(height * MARK_RATIO)}
        viewBox="0 0 60 60"
        className={className}
        role="img"
        aria-label="CMD Insight"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(0,0)">
          <Isotype id={id} />
        </g>
      </svg>
    );
  }

  return (
    <svg
      height={height}
      width={Math.round(height * RATIO)}
      viewBox="0 0 330 60"
      className={className}
      role="img"
      aria-label="CMD Insight"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Isotype id={id} />
      <g fontFamily="Sora, system-ui, sans-serif">
        <text x="74" y="34" fontSize="30" fontWeight="800" letterSpacing="0.5" fill={c.cmd}>
          CMD
        </text>
        <text x="160" y="34" fontSize="30" fontWeight="800" letterSpacing="0.5" fill={c.insight}>
          INSIGHT
        </text>
        <line x1="75" y1="42" x2="316" y2="42" stroke={c.rule} strokeWidth="1" />
        <text x="75" y="55" fontSize="10.5" fontWeight="600" letterSpacing="2.7" fill={c.tag}>
          SPORTS HEALTH INTELLIGENCE
        </text>
      </g>
    </svg>
  );
}

// Compatibilidad: algunos lugares importaban LogoWordmark.
export function LogoWordmark({ className = "" }: { className?: string }) {
  return <Logo height={26} variant="dark" className={className} />;
}
