import type { Metadata } from "next";
import "./globals.css";
import "../styles/typography.css";

export const metadata: Metadata = {
  title: "Taher — Data Science & Full-Stack Developer",
  description:
    "Portfolio of Taher — B.Tech CSE (Data Science) student at Acropolis Institute of Technology, Indore & BS Data Science at IIT Madras. Exploring the intersection of data, AI, and modern web development.",
  keywords: [
    "Taher",
    "portfolio",
    "data science",
    "full-stack developer",
    "machine learning",
    "web developer",
    "IIT Madras",
    "Acropolis Indore",
  ],
  authors: [{ name: "Taher" }],
  openGraph: {
    title: "Taher — Data Science & Full-Stack Developer",
    description:
      "Exploring the intersection of data, AI, and modern web development.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="noise-overlay">{children}</body>
    </html>
  );
}
