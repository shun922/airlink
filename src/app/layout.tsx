import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ご予約 | Salon",
  description: "オンライン予約",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
