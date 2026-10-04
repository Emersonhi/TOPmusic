import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from '@/context/LanguageContext';
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar';
import InstallPrompt from '@/components/InstallPrompt';

export const metadata: Metadata = {
  title: "TOPmusic — From First Notes to Standing Ovations",
  description: "Piano, Guitar, Bass, Drums, Voice, and Music Production. World-class instruction for all ages and all styles.",
  keywords: "music school, piano lessons, guitar lessons, drums lessons, voice lessons, music production, TOPmusic",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TOPmusic",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#dd7634",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="apple-touch-icon" href="/logo.webp" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TOPmusic" />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>{children}</LanguageProvider>
        <ServiceWorkerRegistrar />
        <InstallPrompt />
      </body>
    </html>
  );
}
