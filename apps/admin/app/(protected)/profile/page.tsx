"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, AdminUser } from "@/lib/api";
import { User, Lock, Mail, Shield, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.getCurrentProfile(),
  });

  // Set form data when profile loads
  useEffect(() => {
    if (profile?.data) {
      setProfileForm({
        name: profile.data.name || "",
        email: profile.data.email || "",
      });
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name?: string; email?: string }) =>
      api.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      api.changePassword(data.currentPassword, data.newPassword),
    onSuccess: () => {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const userData = profile?.data;

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Overview
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">{userData?.role ? roleLabels[userData.role] : "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <Mail className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium truncate max-w-[150px]">{userData?.email || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Last Login</p>
                <p className="font-medium">
                  {userData?.lastLoginAt
                    ? new Date(userData.lastLoginAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {userData?.createdAt
                    ? new Date(userData.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Update Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Update Profile
            </CardTitle>
            <CardDescription>Change your name and email</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                  placeholder="your@email.com"
                />
              </div>
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending
                  ? "Changing..."
                  : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

