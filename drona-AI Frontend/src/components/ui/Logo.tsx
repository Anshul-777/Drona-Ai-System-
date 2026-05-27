import Link from "next/link";

interface LogoProps {
  className?: string;
  href?: string;
  isSpan?: boolean; // For cases where it shouldn't be a link, like the 'begin' page
}

export default function Logo({ className, href = "/", isSpan = false }: LogoProps) {
  const content = (
    <div className="flex items-center gap-3 group">
      <div className="relative w-10 h-10 flex items-center justify-center">
        <div className="absolute inset-0 bg-on-surface rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-500 shadow-sm" />
        <div className="absolute inset-0 bg-primary rounded-xl -rotate-3 group-hover:-rotate-6 transition-transform duration-500 shadow-md opacity-20 group-hover:opacity-40" />
        <span className="relative z-10 font-display font-black text-xl text-white tracking-tighter">D</span>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display font-black text-2xl tracking-tighter text-on-surface">
          DRONA<span className="text-primary italic">.</span>
        </span>
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-outline opacity-60">Intelligence OS</span>
      </div>
    </div>
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
