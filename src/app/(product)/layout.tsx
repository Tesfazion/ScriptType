import { ProductShell } from "@/components/product-shell";
import { BrandLoading } from "@/components/brand-loading";
import { Suspense } from "react";

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={
        <div className="page-shell grid min-h-dvh place-items-center">
          <BrandLoading size="md" className="min-h-0" />
        </div>
      }
    >
      <ProductShell>{children}</ProductShell>
    </Suspense>
  );
}
