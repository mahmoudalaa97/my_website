// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Entity Types
export interface Admin {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteSettings {
  id: string;
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
  socialLinks: SocialLinks;
  stats: SiteStat[];
  updatedAt: Date;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
}

export interface SiteStat {
  value: string;
  label: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  priceNote: string;
  features: string[];
  isPopular: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  projectType?: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
}

// DTO Types for API requests
export interface CreateServiceDto {
  title: string;
  description: string;
  icon: string;
  features: string[];
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateServiceDto extends Partial<CreateServiceDto> {}

export interface CreatePackageDto {
  name: string;
  description: string;
  price: string;
  priceNote: string;
  features: string[];
  isPopular?: boolean;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdatePackageDto extends Partial<CreatePackageDto> {}

export interface CreateProjectDto {
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  isFeatured?: boolean;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

export interface UpdateSiteSettingsDto {
  siteName?: string;
  tagline?: string;
  description?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  socialLinks?: SocialLinks;
  stats?: SiteStat[];
}

export interface CreateContactMessageDto {
  name: string;
  email: string;
  projectType?: string;
  message: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  admin: Omit<Admin, 'createdAt' | 'updatedAt'>;
}

