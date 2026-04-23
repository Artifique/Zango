import type { Metadata } from "next";
import { Syne, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const syne = Syne({ 
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CryptoAgent | Dashboard Premium",
  description: "Tableau de bord financier pour revente de crypto-monnaies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${syne.variable} ${ibmPlexMono.variable} font-sans antialiased bg-background text-foreground selection:bg-teal selection:text-background`}
      >
        <div className="grid-background" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
