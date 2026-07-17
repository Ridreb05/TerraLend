import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmptyState({
  title = "No projects yet",
  description = "Be the first to launch a climate project on TerraLend.",
  actionLabel,
  actionHref,
}) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <Image src="/empty-state.svg" alt="" width={200} height={164} className="mb-6 opacity-90" />
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="mt-6">
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
