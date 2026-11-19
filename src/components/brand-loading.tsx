"use client";

import { useEffect, useState } from "react";
import { Mascot } from "@/components/mascot";
import { BrandMark } from "@/components/brand-mark";
import { cn } from "@/lib/utils";

type BrandLoadingProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function BrandLoading({
  size = "md",
  className,
}: BrandLoadingProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(id);
  }, []);

  if (!ready) return null;

  return (
    <div className={cn(
      "flex min-h-24 items-center justify-center rounded-control bg-muted text-muted-foreground gap-3",
      className,
    )}>
      <Mascot size={size} animate className="mascot-pop" />
      <span className="sr-only">ScriptType</span>
      <BrandMark size={size} />
    </div>
  );
}