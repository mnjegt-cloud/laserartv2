import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "LaserCraft LB | Precision Laser Engraving & Custom Gifts",
    template: "%s | LaserCraft LB"
  },
  description: "Lebanon's premier laser engraving studio. Custom stainless steel keychains, corporate branding, home decor, and precision laser cutting services with nationwide delivery.",
  keywords: ["laser engraving lebanon", "custom keychains lebanon", "laser cutting beirut", "personalized gifts lebanon", "corporate branding beirut"],
  authors: [{ name: "LaserCraft LB Team" }],
  openGraph: {
    title: "LaserCraft LB | Precision Laser Engraving",
    description: "Premium laser engraved products and professional marking services in Lebanon.",
    url: "https://lasercraftlb.com",
    siteName: "LaserCraft LB",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "LaserCraft LB",
    "url": "https://lasercraftlb.com",
    "logo": "https://lasercraftlb.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+961-81-388115",
      "contactType": "customer service",
      "areaServed": "LB",
      "availableLanguage": ["en", "ar"]
    },
    "sameAs": [
      "https://instagram.com/lasercraft.lb",
      "https://facebook.com/lasercraft.lb"
    ]
  };

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} dark antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-black text-white font-body selection:bg-white/20">
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1rem',
            fontSize: '0.875rem',
            fontWeight: 'bold',
          }
        }} />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <MobileNav />
        <footer className="border-t border-white/5 py-24 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-2">
                <h2 className="text-2xl font-black tracking-tighter mb-6">LASER<span className="text-zinc-500">CRAFT</span></h2>
                <p className="text-zinc-500 max-w-sm leading-relaxed">
                  Redefining precision in Lebanon. We transform raw materials into timeless pieces of art using advanced fiber laser technology.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-zinc-400">Navigation</h4>
                <ul className="space-y-4 text-sm text-zinc-500">
                  <li><a href="/shop" className="hover:text-white transition-colors">The Catalog</a></li>
                  <li><a href="/services" className="hover:text-white transition-colors">Services</a></li>
                  <li><a href="/track" className="hover:text-white transition-colors">Track Order</a></li>
                  <li><a href="/about" className="hover:text-white transition-colors">Our Story</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-zinc-400">Connect</h4>
                <ul className="space-y-4 text-sm text-zinc-500">
                  <li><a href="https://wa.me/96181388115" className="hover:text-white transition-colors">WhatsApp</a></li>
                  <li><a href="https://instagram.com/lasercraft.lb" className="hover:text-white transition-colors">Instagram</a></li>
                  <li><a href="mailto:info@lasercraftlb.com" className="hover:text-white transition-colors">Email Us</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600 font-bold uppercase tracking-widest">
              <p>© 2026 LASERCRAFT LB. ALL RIGHTS RESERVED.</p>
              <div className="flex gap-8">
                <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
                <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}


