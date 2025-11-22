import type { Metadata } from "next";
import { Great_Vibes, Inter } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://party.ingriduzeda.com";

export const metadata: Metadata = {
  title: "Ingrid 20 Anos",
  description: "Venha comemorar os 20 anos da Ingrid!",
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "Ingrid 20 Anos",
    description: "Venha comemorar os 20 anos da Ingrid!",
    images: [
      {
        url: `${baseUrl}/seo/og-image-card.png`,
        width: 1200,
        height: 630,
        alt: "Convite para festa de 20 anos da Ingrid",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ingrid 20 Anos",
    description: "Venha comemorar os 20 anos da Ingrid!",
    images: [`${baseUrl}/seo/og-image-card.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${greatVibes.variable} ${inter.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
