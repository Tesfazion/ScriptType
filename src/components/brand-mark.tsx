"use client";

import { cn } from "@/lib/utils";

export type BrandMarkSize = "xs" | "sm" | "md" | "lg" | "xl" | "hero";

const sizeClasses: Record<BrandMarkSize, string> = {
  xs: "size-5",
  sm: "size-7",
  md: "size-9",
  lg: "size-11",
  xl: "size-14",
  hero: "size-24",
};

/**
 * The ScriptType brand mark renders the actual ScriptType mascot logo
 * (the ribbon "S" with eyes) instead of a generic Lucide icon.
 *
 * The source asset is `public/scripttype-icon-192.png`, which is also used
 * for the favicon, PWA icons, and splash screens.
 */
export function BrandMark({
  size = "md",
  className,
  priority = false,
}: {
  size?: BrandMarkSize;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={cn(
        "brand-mark grid shrink-0 place-items-center overflow-hidden rounded-control",
        sizeClasses[size],
        className,
      )}
      aria-hidden="true"
    >
      <img
        src="/scripttype-icon-192.png"
        alt=""
        width={192}
        height={192}
        decoding={priority ? "sync" : "async"}
        loading={priority ? "eager" : "lazy"}
        className="size-full object-cover"
      />
    </span>
  );
}