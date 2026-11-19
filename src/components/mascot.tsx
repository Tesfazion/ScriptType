"use client";

import { cn } from "@/lib/utils";

/**
 * The ScriptType mascot, used on the landing hero, onboarding steps,
 * and the first-win celebration. It is the same ribbon "S" identity as
 * the favicon and PWA icons, but larger and with a gentle idle bounce so
 * it becomes a recognizable character rather than a static glyph.
 *
 * The bounce is a CSS keyframe (mascot-bounce) so the browser compositor
 * handles it without per-frame JavaScript style writes.
 */
export function Mascot({
  size = "lg",
  animate = true,
  className,
}: {
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  animate?: boolean;
  className?: string;
}) {
  const sizes: Record<"sm" | "md" | "lg" | "xl" | "hero", string> = {
    sm: "size-16",
    md: "size-24",
    lg: "size-32",
    xl: "size-40",
    hero: "size-48",
  };

  return (
    <span
      className={cn(
        "mascot",
        sizes[size],
        animate && "mascot-bounce",
        className,
      )}
      aria-hidden="true"
    >
      <img
        src="/scripttype-icon-192.png"
        alt=""
        width={192}
        height={192}
        decoding="async"
        loading="eager"
        className="size-full object-cover drop-shadow-[0_18px_30px_rgba(79,70,229,0.45)]"
      />
    </span>
  );
}