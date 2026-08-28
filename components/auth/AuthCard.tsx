import Link from "next/link";
import Logo from "@/components/Logo";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-mist px-5 py-12">
      <Link href="/" className="mb-8" aria-label="CMD Insight">
        <Logo height={34} />
      </Link>
      <div className={`card w-full ${wide ? "max-w-md" : "max-w-sm"} p-6 sm:p-8`}>
        <h1 className="font-display text-xl font-extrabold text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slatey">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
      {footer && <div className="mt-6 text-sm text-slatey">{footer}</div>}
    </div>
  );
}
