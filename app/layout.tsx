import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TVAsocial - Social Media Content Management",
  description: "Transform company OS documents into strategic social media content calendars",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
