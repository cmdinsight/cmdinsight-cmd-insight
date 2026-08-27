// Isotipo + wordmark oficial de CMD Insight.
// Se recorta por CSS desde el JPEG de marca (public/cmd-insight-logo.jpeg),
// que tiene mucho margen blanco alrededor del logo.
// TODO: reemplazar por SVG oficial cuando esté disponible.

type Props = { height?: number; className?: string };

// Región del logo dentro del JPEG 1536×1024 (x, y, w, h en px del original).
const CROP = { x: 145, y: 350, w: 1140, h: 265 };
const IMG_W = 1536;
const IMG_H = 1024;

export default function Logo({ height = 34, className = "" }: Props) {
  const s = height / CROP.h;
  return (
    <span
      className={className}
      role="img"
      aria-label="CMD Insight"
      style={{
        display: "inline-block",
        height,
        width: Math.round(CROP.w * s),
        backgroundImage: "url(/cmd-insight-logo.jpeg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: `${Math.round(IMG_W * s)}px ${Math.round(IMG_H * s)}px`,
        backgroundPosition: `-${Math.round(CROP.x * s)}px -${Math.round(CROP.y * s)}px`,
      }}
    />
  );
}

// Wordmark en texto para fondos oscuros (footer).
export function LogoWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-extrabold tracking-tight ${className}`}>
      <span className="text-white/70">CMD</span>{" "}
      <span className="text-white">Insight</span>
    </span>
  );
}
