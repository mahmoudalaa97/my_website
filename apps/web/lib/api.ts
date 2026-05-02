const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const toCamel = (s: string) => s.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
const toSnake = (s: string) => s.replace(/([A-Z])/g, "_$1").toLowerCase();

function deepTransformKeys(value: unknown, transform: (key: string) => string): unknown {
  if (Array.isArray(value)) {
    return value.map((v) => deepTransformKeys(v, transform));
  }
  if (value && typeof value === "object" && (value as object).constructor === Object) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        transform(k),
        deepTransformKeys(v, transform),
      ])
    );
  }
  return value;
}

const keysToCamel = <T = unknown>(value: unknown) => deepTransformKeys(value, toCamel) as T;
const keysToSnake = <T = unknown>(value: unknown) => deepTransformKeys(value, toSnake) as T;

async function fetchApi<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      return null;
    }

    const json: ApiResponse<unknown> = await response.json();
    return json.data ? keysToCamel<T>(json.data) : null;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return null;
  }
}

export interface SiteSettings {
  id: string;
  siteName: string;
  tagline: string;
  description: string;
  // Branding
  logoUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  // Theme Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  foregroundColor: string;
  // Typography
  fontFamily: string;
  fontHeading: string;
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImageUrl: string;
  // Analytics
  googleAnalyticsId: string;
  plausibleDomain: string;
  // Hero
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  // About
  aboutTitle: string;
  aboutDescription: string;
  aboutImageUrl: string;
  // Contact
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  // Social
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };
  // Stats
  stats: Array<{ value: string; label: string }>;
  // Footer
  footerText: string;
  copyrightText: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  priceNote: string;
  features: string[];
  isPopular: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  isFeatured: boolean;
}

export interface Branding {
  siteName: string;
  logoUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  foregroundColor: string;
  fontFamily: string;
  fontHeading: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImageUrl: string;
  googleAnalyticsId: string;
  plausibleDomain: string;
}

export const api = {
  getSettings: () => fetchApi<SiteSettings>("/settings"),
  getBranding: () => fetchApi<Branding>("/settings/branding"),
  getServices: () => fetchApi<Service[]>("/services"),
  getPackages: () => fetchApi<Package[]>("/packages"),
  getProjects: () => fetchApi<Project[]>("/projects"),
  getFeaturedProjects: () => fetchApi<Project[]>("/projects/featured"),
  
  submitContact: async (data: {
    name: string;
    email: string;
    projectType?: string;
    message: string;
  }) => {
    const response = await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(keysToSnake(data)),
    });
    return response.json();
  },
};

