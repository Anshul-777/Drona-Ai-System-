import Link from "next/link";

interface LogoProps {
  className?: string;
  href?: string;
  isSpan?: boolean; // For cases where it shouldn't be a link, like the 'begin' page
}

export default function Logo({ className, href = "/", isSpan = false }: LogoProps) {
  const content = (
    <>
      <span className="brand-mark">D</span>
      <span>DRONA<sup style={{ fontSize: ".5em", color: "var(--accent)" }}>AI</sup></span>
    </>
  );

  if (isSpan) {
    return (
      <span className={`brand ${className || ""}`}>
        {content}
      </span>
    );
  }

  return (
    <Link href={href} className={`brand ${className || ""}`}>
      {content}
    </Link>
  );
}
