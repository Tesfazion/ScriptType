import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";

export const metadata: Metadata = {
  title: {
    default: "ScriptType — let the Word take root",
    template: "%s · ScriptType",
  },
  description:
    "Build a daily Scripture habit, strengthen your typing, and keep the words that matter close.",
  applicationName: "ScriptType",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
