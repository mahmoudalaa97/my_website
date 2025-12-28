"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { api, AdminRole, AdminUser } from "@/lib/api";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Mail,
  Shield,
  Search,
  X,
  Key,
  UserPlus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const roleLabels: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

const roleColors: Record<AdminRole, string> = {
  super_admin: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  admin: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  editor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  viewer: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

type ModalType = "create" | "invite" | "edit" | "reset-password" | null;

interface FormData {
  id?: string;
  name: string;
  email: string;
  role: AdminRole;
  password?: string;
}

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminRole | "">("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "viewer",
    password: "",
  });
  const [newPassword, setNewPassword] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.getUsers(),
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.getCurrentProfile(),
  });

  const currentUserRole = profile?.data?.role;
  const canManageUsers =
    currentUserRole === "super_admin" || currentUserRole === "admin";

  const createMutation = useMutation({
    mutationFn: (data: FormData) =>
      api.createUser({
        name: data.name,
        email: data.email,
        role: data.role,
        password: data.password,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      closeModal();
      toast({ title: "Success", description: "User created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const inviteMutation = useMutation({
    mutationFn: (data: FormData) =>
      api.inviteUser({
        name: data.name,
        email: data.email,
        role: data.role,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      closeModal();
      toast({
        title: "Invitation sent",
        description: "An invitation email has been sent to the user.",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FormData> }) =>
      api.updateUser(id, {
        name: data.name,
        email: data.email,
        role: data.role,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      closeModal();
      toast({ title: "Success", description: "User updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const suspendMutation = useMutation({
    mutationFn: (id: string) => api.suspendUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "Success", description: "User suspended" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => api.activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "Success", description: "User activated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      api.resetUserPassword(id, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      closeModal();
      toast({ title: "Success", description: "Password reset successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "Success", description: "User deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const closeModal = () => {
    setModalType(null);
    setSelectedUser(null);
    setFormData({ name: "", email: "", role: "viewer", password: "" });
    setNewPassword("");
  };

  const openCreateModal = () => {
    setFormData({ name: "", email: "", role: "viewer", password: "" });
    setModalType("create");
  };

  const openInviteModal = () => {
    setFormData({ name: "", email: "", role: "viewer" });
    setModalType("invite");
  };

  const openEditModal = (user: AdminUser) => {
    setSelectedUser(user);
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setModalType("edit");
  };

  const openResetPasswordModal = (user: AdminUser) => {
    setSelectedUser(user);
    setNewPassword("");
    setModalType("reset-password");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "create") {
      createMutation.mutate(formData);
    } else if (modalType === "invite") {
      inviteMutation.mutate(formData);
    } else if (modalType === "edit" && selectedUser) {
      updateMutation.mutate({ id: selectedUser.id, data: formData });
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser && newPassword.length >= 8) {
      resetPasswordMutation.mutate({ id: selectedUser.id, password: newPassword });
    }
  };

  const handleToggleActive = (user: AdminUser) => {
    if (user.isActive) {
      suspendMutation.mutate(user.id);
    } else {
      activateMutation.mutate(user.id);
    }
  };

  const canManageRole = (targetRole: AdminRole): boolean => {
    if (currentUserRole === "super_admin") return true;
    if (currentUserRole === "admin") {
      return targetRole === "editor" || targetRole === "viewer";
    }
    return false;
  };

  const filteredUsers = (users?.data || []).filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (!canManageUsers) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don&apos;t have permission to manage users.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={openInviteModal} variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Invite User
            </Button>
            <Button onClick={openCreateModal}>
              <Plus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as AdminRole | "")}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">All Roles</option>
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Users Table */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">User</th>
                    <th className="text-left py-3 px-4 font-medium">Role</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Last Login</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            roleColors[user.role]
                          }`}
                        >
                          {roleLabels[user.role]}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {canManageRole(user.role) &&
                        user.id !== profile?.data?.id ? (
                          <Switch
                            checked={user.isActive}
                            onCheckedChange={() => handleToggleActive(user)}
                            disabled={
                              suspendMutation.isPending ||
                              activateMutation.isPending
                            }
                          />
                        ) : (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {user.isActive ? "Active" : "Suspended"}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          {canManageRole(user.role) && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditModal(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openResetPasswordModal(user)}
                              >
                                <Key className="h-4 w-4" />
                              </Button>
                              {user.id !== profile?.data?.id && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => {
                                    if (
                                      confirm(
                                        "Are you sure you want to delete this user?"
                                      )
                                    ) {
                                      deleteMutation.mutate(user.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Invite/Edit Modal */}
      {(modalType === "create" ||
        modalType === "invite" ||
        modalType === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {modalType === "create" && (
                  <>
                    <Plus className="h-5 w-5" /> Create User
                  </>
                )}
                {modalType === "invite" && (
                  <>
                    <UserPlus className="h-5 w-5" /> Invite User
                  </>
                )}
                {modalType === "edit" && (
                  <>
                    <Edit className="h-5 w-5" /> Edit User
                  </>
                )}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as AdminRole,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    required
                  >
                    {Object.entries(roleLabels)
                      .filter(([value]) => canManageRole(value as AdminRole))
                      .map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                  </select>
                </div>
                {modalType === "create" && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="••••••••"
                      minLength={8}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum 8 characters
                    </p>
                  </div>
                )}
                {modalType === "invite" && (
                  <p className="text-sm text-muted-foreground">
                    An email will be sent to the user with an invitation link to
                    set their password.
                  </p>
                )}
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createMutation.isPending ||
                      inviteMutation.isPending ||
                      updateMutation.isPending
                    }
                  >
                    {modalType === "create" && "Create User"}
                    {modalType === "invite" && "Send Invitation"}
                    {modalType === "edit" && "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reset Password Modal */}
      {modalType === "reset-password" && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" /> Reset Password
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Reset password for <strong>{selectedUser.name}</strong> (
                {selectedUser.email})
              </p>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={8}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 8 characters
                  </p>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      resetPasswordMutation.isPending || newPassword.length < 8
                    }
                  >
                    Reset Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

