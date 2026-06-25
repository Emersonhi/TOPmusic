import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: "TOPmusic — New York's Premier Music School",
  description: "Piano, Guitar, Bass, Drums, Voice, and Music Production. World-class instruction for all ages and all styles in New York City.",
  keywords: "music school New York, piano lessons, guitar lessons, drums lessons, voice lessons, music production, TOPmusic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
