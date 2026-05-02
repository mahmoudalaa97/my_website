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

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

// Upload function without Content-Type header (browser sets it for FormData)
async function uploadFile<T>(
  endpoint: string,
  file: File
): Promise<ApiResponse<T>> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Upload failed" }));
    throw new Error(error.message || "Upload failed");
  }

  return response.json();
}

export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

export interface UploadedFile {
  id: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  folder?: string;
  altText?: string;
  createdAt?: string;
}

export interface MediaItem extends UploadedFile {
  type: 'image' | 'document' | 'video';
  provider: 'local' | 's3' | 'cloudinary';
}

export interface SiteSettings {
  id: string;
  siteName: string;
  tagline: string;
  description: string;
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
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImageUrl: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };
  stats: Array<{ value: string; label: string }>;
  footerText: string;
  copyrightText: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  isActive?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetchApi<{ accessToken: string; admin: AdminUser }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    ),
  logout: () => fetchApi("/auth/logout", { method: "POST" }),
  getSession: () =>
    fetchApi<{ isAuthenticated: boolean; admin?: AdminUser }>(
      "/auth/session"
    ),
  getProfile: () =>
    fetchApi<AdminUser>("/auth/me"),

  // Profile
  getCurrentProfile: () =>
    fetchApi<AdminUser>("/profile"),
  updateProfile: (data: { name?: string; email?: string }) =>
    fetchApi<AdminUser>("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    fetchApi<{ message: string }>("/profile/password", {
      method: "PUT",
      body: JSON.stringify(keysToSnake({ currentPassword, newPassword })),
    }),

  // Users
  getUsers: (role?: AdminRole) =>
    fetchApi<AdminUser[]>(role ? `/users?role=${role}` : "/users"),
  getUser: (id: string) => fetchApi<AdminUser>(`/users/${id}`),
  createUser: (data: { name: string; email: string; password?: string; role: AdminRole }) =>
    fetchApi<AdminUser>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  inviteUser: (data: { name: string; email: string; role: AdminRole }) =>
    fetchApi<AdminUser & { inviteToken: string }>("/users/invite", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateUser: (id: string, data: { name?: string; email?: string; role?: AdminRole; isActive?: boolean }) =>
    fetchApi<AdminUser>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  suspendUser: (id: string) =>
    fetchApi<{ message: string }>(`/users/${id}/suspend`, { method: "PUT" }),
  activateUser: (id: string) =>
    fetchApi<{ message: string }>(`/users/${id}/activate`, { method: "PUT" }),
  resetUserPassword: (id: string, newPassword: string) =>
    fetchApi<{ message: string }>(`/users/${id}/reset-password`, {
      method: "PUT",
      body: JSON.stringify({ password: newPassword }),
    }),
  deleteUser: (id: string) =>
    fetchApi(`/users/${id}`, { method: "DELETE" }),
  acceptInvite: (token: string, password: string) =>
    fetchApi<{ message: string; email: string }>("/users/accept-invite", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),

  // Upload / Media Library
  uploadFile: (file: File, folder?: string) => {
    const endpoint = folder ? `/upload?folder=${folder}` : "/upload";
    return uploadFile<UploadedFile>(endpoint, file);
  },
  getMedia: (folder?: string) =>
    fetchApi<MediaItem[]>(folder ? `/upload?folder=${folder}` : "/upload"),
  getMediaFolders: () => fetchApi<string[]>("/upload/folders"),
  updateMedia: (id: string, altText: string) =>
    fetchApi<MediaItem>(`/upload/${id}`, {
      method: "PUT",
      body: JSON.stringify({ altText }),
    }),
  deleteMedia: (id: string) =>
    fetchApi(`/upload/${id}`, { method: "DELETE" }),

  // Settings
  getSettings: async () => {
    const res = await fetchApi<SiteSettings>("/settings");
    return { ...res, data: res.data ? keysToCamel<SiteSettings>(res.data) : res.data };
  },
  getBranding: async () => {
    const res = await fetchApi<Partial<SiteSettings>>("/settings/branding");
    return {
      ...res,
      data: res.data ? keysToCamel<Partial<SiteSettings>>(res.data) : res.data,
    };
  },
  updateSettings: async (data: Partial<SiteSettings>) => {
    const res = await fetchApi<SiteSettings>("/settings", {
      method: "PUT",
      body: JSON.stringify(keysToSnake(data)),
    });
    return { ...res, data: res.data ? keysToCamel<SiteSettings>(res.data) : res.data };
  },

  // Services
  getServices: (includeInactive = true) =>
    fetchApi<any[]>(`/services?includeInactive=${includeInactive}`),
  getService: (id: string) => fetchApi<any>(`/services/${id}`),
  createService: (data: any) =>
    fetchApi<any>("/services", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateService: (id: string, data: any) =>
    fetchApi<any>(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteService: (id: string) =>
    fetchApi(`/services/${id}`, { method: "DELETE" }),

  // Packages
  getPackages: (includeInactive = true) =>
    fetchApi<any[]>(`/packages?includeInactive=${includeInactive}`),
  getPackage: (id: string) => fetchApi<any>(`/packages/${id}`),
  createPackage: (data: any) =>
    fetchApi<any>("/packages", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updatePackage: (id: string, data: any) =>
    fetchApi<any>(`/packages/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deletePackage: (id: string) =>
    fetchApi(`/packages/${id}`, { method: "DELETE" }),

  // Projects
  getProjects: (includeInactive = true) =>
    fetchApi<any[]>(`/projects?includeInactive=${includeInactive}`),
  getProject: (id: string) => fetchApi<any>(`/projects/${id}`),
  createProject: (data: any) =>
    fetchApi<any>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProject: (id: string, data: any) =>
    fetchApi<any>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteProject: (id: string) =>
    fetchApi(`/projects/${id}`, { method: "DELETE" }),

  // Messages
  getMessages: (includeArchived = false) =>
    fetchApi<any[]>(`/messages?includeArchived=${includeArchived}`),
  getMessage: (id: string) => fetchApi<any>(`/messages/${id}`),
  markMessageRead: (id: string) =>
    fetchApi<any>(`/messages/${id}/read`, { method: "PATCH" }),
  archiveMessage: (id: string) =>
    fetchApi<any>(`/messages/${id}/archive`, { method: "PATCH" }),
  deleteMessage: (id: string) =>
    fetchApi(`/messages/${id}`, { method: "DELETE" }),
  getMessageStats: () => fetchApi<{ total: number; unread: number; archived: number }>("/messages/stats"),
};

