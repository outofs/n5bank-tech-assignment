import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "./_components/site-header";

export const metadata: Metadata = {
  title: "N5Deal Marketplace Prototype",
  description: "Demo marketplace identity selector and foundations.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
