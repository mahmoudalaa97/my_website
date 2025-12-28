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

// Dynamic metadata generation
export async function generateMetadata(): Promise<Metadata> {
  const branding = await api.getBranding();
  
  return {
    title: {
      default: branding?.seoTitle?.replace("%s", branding?.siteName || "Home") || "Website",
      template: branding?.seoTitle || "%s",
    },
    description: branding?.seoDescription || "Professional services and solutions for your business.",
    keywords: branding?.seoKeywords?.split(",").map(k => k.trim()) || [],
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
  const branding = await api.getBranding();

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
