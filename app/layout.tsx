import type React from "react";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { RecentlyViewedProvider } from "@/lib/recently-viewed-context";

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

// Initialize fonts
const _libreBaskerville = V0_Font_Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const _ibmPlexMono = V0_Font_IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});
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
  title: "House of Kumaran | Authentic South Indian Foods | Made in Madras",
  description:
    "Experience the authentic taste of South India with House of Kumaran. Handcrafted podis, pickles, sweets, savouries & more. 100% natural, zero preservatives. Pan-India delivery.",
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
  openGraph: {
    title: "House of Kumaran | Authentic South Indian Foods",
    description:
      "From the kitchens of Madras to your table. Handcrafted podis, pickles, sweets & savouries.",
    type: "website",
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
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>{children}</RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
        {/* Subtle grain texture overlay */}
        <div className="grain-overlay" aria-hidden="true" />
        <Analytics />
      </body>
    </html>
  );
}
