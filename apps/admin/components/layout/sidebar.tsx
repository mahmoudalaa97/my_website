"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Settings,
  Briefcase,
  Package,
  FolderKanban,
  MessageSquare,
  LogOut,
  Users,
  User,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api, AdminRole } from "@/lib/api";
import { useRouter } from "next/navigation";

const roleLabels: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: AdminRole[];
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Services", href: "/services", icon: Briefcase }, // All users can view (read-only for viewers)
  { name: "Packages", href: "/packages", icon: Package }, // All users can view
  { name: "Projects", href: "/projects", icon: FolderKanban }, // All users can view
  { name: "Messages", href: "/messages", icon: MessageSquare }, // All users can view
  { name: "Users", href: "/users", icon: Users, roles: ["super_admin", "admin"] }, // Admins only
  { name: "Settings", href: "/settings", icon: Settings }, // All users can view (read-only for non-admins)
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.getCurrentProfile(),
  });

  const currentUser = profile?.data;
  const userRole = currentUser?.role;

  const handleLogout = async () => {
    try {
      await api.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const filteredNavigation = navigation.filter((item) => {
    if (!item.roles) return true;
    return userRole && item.roles.includes(userRole);
  });

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">
            Admin
          </span>
        </div>

        {/* User Info */}
        {currentUser && (
          <div className="border-b border-sidebar-border px-3 py-3">
            <Link
              href="/profile"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                pathname === "/profile"
                  ? "bg-sidebar-accent"
                  : "hover:bg-sidebar-accent/50"
              )}
            >
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1 text-xs text-sidebar-foreground/60">
                  <Shield className="h-3 w-3" />
                  {roleLabels[currentUser.role]}
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

