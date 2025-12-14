import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learn Kana",
  description: "Master Japanese Hiragana and Katakana through flashcards and quizzes",
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
