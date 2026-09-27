import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { api } from "@/lib/api";
import { ThemeProvider, Analytics, FontLoader } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const health = await api.getHealth();
  if (!health.ok) {
    return {
      title: "We'll be back shortly",
      robots: { index: false, follow: false },
    };
  }

  const branding = await api.getBranding();
  
  return {
    title: {
      default: branding?.seoTitle?.replace("%s", branding?.siteName || "Home") || "Website",
      template: branding?.seoTitle || "%s",
    },
    description: branding?.seoDescription || "Affordable websites, mobile apps, and Google Maps setup for startups and small business owners. Get found online and grow.",
    keywords: branding?.seoKeywords?.split(",").map(k => k.trim()) || [
      "small business website",
      "startup software",
      "mobile app developer",
      "google business profile setup",
      "google maps for business",
      "local seo",
      "affordable website design",
    ],
    openGraph: {
      title: branding?.siteName || "Website",
      description: branding?.seoDescription || "",
      images: branding?.ogImageUrl ? [branding.ogImageUrl] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: branding?.siteName || "Website",
      description: branding?.seoDescription || "",
      images: branding?.ogImageUrl ? [branding.ogImageUrl] : [],
    },
    icons: branding?.faviconUrl ? { icon: branding.faviconUrl } : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const health = await api.getHealth();
  const branding = health.ok ? await api.getBranding() : null;

  return (
    <html lang="en" className="scroll-smooth dark">
      <head>
        <FontLoader branding={branding} />
        <Analytics branding={branding} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider branding={branding}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
