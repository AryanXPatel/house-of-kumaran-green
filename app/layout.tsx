import type React from "react";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ShopifyCartProvider } from "@/lib/shopify-cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { RecentlyViewedProvider } from "@/lib/recently-viewed-context";
import { AuthProvider } from "@/lib/auth-context";
import { CustomerSyncProvider } from "@/lib/customer-sync";
import { GoogleAuthProvider } from "@/lib/google-auth-provider";
import { AnalyticsProviderWrapper } from "@/lib/analytics-provider-wrapper";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

import {
  Playfair_Display,
  Inter,
  IBM_Plex_Mono,
  Libre_Baskerville as V0_Font_Libre_Baskerville,
  IBM_Plex_Mono as V0_Font_IBM_Plex_Mono,
  Lora as V0_Font_Lora,
} from "next/font/google";

// Initialize fonts (unused but kept for potential future use)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _libreBaskerville = V0_Font_Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _ibmPlexMono = V0_Font_IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _lora = V0_Font_Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "House of Kumaran | Authentic South Indian Foods | Made in Madras",
    template: "%s | House of Kumaran",
  },
  description:
    "Experience the authentic taste of South India with House of Kumaran. Handcrafted podis, pickles, sweets, savouries & more. 100% natural, zero preservatives. Pan-India delivery.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  keywords: [
    "South Indian food",
    "authentic podis",
    "Indian pickles",
    "traditional sweets",
    "Madras food",
    "Tamil Nadu snacks",
    "homemade Indian food",
    "zero preservatives",
    "House of Kumaran",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://houseofkumaran.com"
  ),
  openGraph: {
    title: "House of Kumaran | Authentic South Indian Foods",
    description:
      "From the kitchens of Madras to your table. Handcrafted podis, pickles, sweets & savouries.",
    type: "website",
    locale: "en_US",
    siteName: "House of Kumaran",
  },
  twitter: {
    card: "summary_large_image",
    title: "House of Kumaran | Authentic South Indian Foods",
    description:
      "From the kitchens of Madras to your table. Handcrafted podis, pickles, sweets & savouries.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d1f14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} ${ibmPlexMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <GoogleAuthProvider>
          <AuthProvider>
            <ShopifyCartProvider>
              <WishlistProvider>
                <RecentlyViewedProvider>
                  <CustomerSyncProvider>
                    <AnalyticsProviderWrapper>
                      {children}
                    </AnalyticsProviderWrapper>
                  </CustomerSyncProvider>
                </RecentlyViewedProvider>
              </WishlistProvider>
            </ShopifyCartProvider>
          </AuthProvider>
        </GoogleAuthProvider>
        {/* Subtle grain texture overlay */}
        <div className="grain-overlay" aria-hidden="true" />
        <Analytics />
      </body>
    </html>
  );
}
