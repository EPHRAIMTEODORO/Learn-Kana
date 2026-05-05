import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learn Kana",
  description: "Adaptive Japanese kana and kanji practice with spaced repetition and learner analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
