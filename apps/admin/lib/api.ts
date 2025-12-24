const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

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

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetchApi<{ accessToken: string; admin: { id: string; email: string; name: string } }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    ),
  logout: () => fetchApi("/auth/logout", { method: "POST" }),
  getSession: () =>
    fetchApi<{ isAuthenticated: boolean; admin?: { id: string; email: string; name: string } }>(
      "/auth/session"
    ),
  getProfile: () =>
    fetchApi<{ id: string; email: string; name: string }>("/auth/me"),

  // Settings
  getSettings: () => fetchApi<any>("/settings"),
  updateSettings: (data: any) =>
    fetchApi<any>("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

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

