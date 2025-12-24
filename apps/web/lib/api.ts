const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

async function fetchApi<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      return null;
    }

    const json: ApiResponse<T> = await response.json();
    return json.data || null;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return null;
  }
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutDescription: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
  };
  stats: Array<{ value: string; label: string }>;
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

export const api = {
  getSettings: () => fetchApi<SiteSettings>("/settings"),
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
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

