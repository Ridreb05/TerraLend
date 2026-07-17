import { cn } from "@/lib/utils";

const VARIANTS = {
  grant: "bg-solar-100 text-solar-600 dark:bg-solar-500/15 dark:text-solar-300 ring-1 ring-solar-500/20",
  loan: "bg-leaf-100 text-leaf-700 dark:bg-leaf-500/15 dark:text-leaf-300 ring-1 ring-leaf-500/20",
  neutral: "bg-secondary text-secondary-foreground ring-1 ring-border",
  success: "bg-leaf-500/15 text-leaf-600 dark:text-leaf-300 ring-1 ring-leaf-500/25",
};

export default function Badge({ variant = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
