import { ProductShell } from "@/components/product-shell";
import { Suspense } from "react";

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-background" />}>
      <ProductShell>{children}</ProductShell>
    </Suspense>
  );
}
