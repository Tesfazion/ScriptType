import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";

export const metadata: Metadata = {
  title: {
    default: "ScriptType — let the Word take root",
    template: "%s · ScriptType",
  },
  description:
    "Learn touch typing step by step, improve your speed, and keep the words that matter close.",
  applicationName: "ScriptType",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/scripttype-icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/scripttype-icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: [{ url: "/scripttype-icon-192.png", type: "image/png", sizes: "192x192" }],
  },
  appleWebApp: {
    capable: true,
    title: "ScriptType",
    statusBarStyle: "default",
  },
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
