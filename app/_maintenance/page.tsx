import type { Metadata, Viewport } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "House of Kumaran — Crafting What's Next",
  description:
    "House of Kumaran is currently paused as we thoughtfully rework our designs and direction, guided by customer feedback. We'll return with something more refined, exciting, and lovable.",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0d1f14",
  width: "device-width",
  initialScale: 1,
};

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1] flex items-center justify-center relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-96 h-96 border border-[#b8860b] rounded-full opacity-10" />
        <div className="absolute bottom-20 right-10 w-64 h-64 border border-[#b8860b] rounded-full opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#b8860b] rounded-full opacity-[0.08]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Logo with glow effect */}
        <div className="relative w-32 h-32 mx-auto mb-10 flex items-center justify-center">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(184,134,11,0.15)_0%,transparent_70%)] blur-xl" />
          {/* Logo with float animation */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#b8860b]/30 animate-float">
            <Image
              src="/images/houseofkumaranlogo.png"
              alt="House of Kumaran"
              width={96}
              height={96}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-8">
          We heard you.
        </h1>

        {/* Body message */}
        <div className="space-y-6 mb-10">
          <p className="text-lg md:text-xl leading-relaxed">
            Every review, every note, every feeling mattered.
          </p>
          <p className="text-lg md:text-xl leading-relaxed">
            We&apos;ve stepped back to thoughtfully create something more
            exciting, more refined, and more lovable.
          </p>
        </div>

        {/* Closing */}
        <div className="space-y-2 text-[#f5f0e1]/70">
          <p className="text-base md:text-lg italic">
            This is a pause — not a goodbye.
          </p>
          <p className="text-base md:text-lg font-medium">
            We&apos;ll return with intention.
          </p>
        </div>
      </div>

      {/* Grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />
    </main>
  );
}
