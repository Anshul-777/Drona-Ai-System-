import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DRONA AI — Intelligence OS",
  description: "DRONA AI is an advanced, multi-agent educational operating system designed for 10th, 11th, 12th, JEE, NEET, and CET preparation. It features personalized, gamified, and story-driven learning across 6 connected environments.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "DRONA AI — Intelligence OS",
    description: "India's first multi-agent AI education platform.",
    siteName: "DRONA AI",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "Drona AI Logo"
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
