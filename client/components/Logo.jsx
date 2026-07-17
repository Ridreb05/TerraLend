"use client";
import Link from "next/link";

/** TerraLend inline logo — scales crisply and inherits currentColor for the wordmark. */
export default function Logo({ href = "/", showWord = true, className = "" }) {
  const mark = (
    <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-[11px] bg-leaf-gradient shadow-sm">
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden>
        <path d="M20 9c-5.8 2.7-9.2 6.7-9.2 12.2C10.8 26.6 14.7 31 20 31c-2.5-3.5-2.7-7.8-.7-11.8C21 15.3 20.7 11.6 20 9Z" fill="#ECFDF5" />
        <path d="M20 9c5.8 2.7 9.2 6.7 9.2 12.2C29.2 26.6 25.3 31 20 31c2.5-3.5 2.7-7.8.7-11.8C19 15.3 19.3 11.6 20 9Z" fill="#A7F3D0" fillOpacity="0.9" />
        <circle cx="20" cy="21.5" r="2" fill="#F59E0B" />
      </svg>
    </span>
  );

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {mark}
      {showWord && (
        <span className="font-display text-lg font-bold tracking-tight text-foreground">
          Terra<span className="text-primary">Lend</span>
        </span>
      )}
    </span>
  );

  return href ? (
    <Link href={href} aria-label="TerraLend home" className="transition-opacity hover:opacity-90">
      {content}
    </Link>
  ) : (
    content
  );
}
