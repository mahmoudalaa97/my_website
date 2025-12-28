import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function usePermissions() {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.getCurrentProfile(),
  });

  const role = profile?.data?.role;

  const canEdit = role === "super_admin" || role === "admin" || role === "editor";
  const canDelete = role === "super_admin" || role === "admin";
  const canManageSettings = role === "super_admin" || role === "admin";
  const canManageUsers = role === "super_admin" || role === "admin";
  const canManageMessages = role === "super_admin" || role === "admin";
  const isViewer = role === "viewer";

  return {
    role,
    canEdit,
    canDelete,
    canManageSettings,
    canManageUsers,
    canManageMessages,
    isViewer,
  };
}

