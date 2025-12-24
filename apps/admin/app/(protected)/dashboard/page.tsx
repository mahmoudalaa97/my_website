"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Briefcase, Package, FolderKanban, MessageSquare, Mail, Archive } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: () => api.getServices(true),
  });

  const { data: packages } = useQuery({
    queryKey: ["packages"],
    queryFn: () => api.getPackages(true),
  });

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.getProjects(true),
  });

  const { data: messageStats } = useQuery({
    queryKey: ["messageStats"],
    queryFn: () => api.getMessageStats(),
  });

  const stats = [
    {
      title: "Services",
      value: services?.data?.length || 0,
      icon: Briefcase,
      color: "text-blue-500",
    },
    {
      title: "Packages",
      value: packages?.data?.length || 0,
      icon: Package,
      color: "text-green-500",
    },
    {
      title: "Projects",
      value: projects?.data?.length || 0,
      icon: FolderKanban,
      color: "text-purple-500",
    },
    {
      title: "Total Messages",
      value: messageStats?.data?.total || 0,
      icon: MessageSquare,
      color: "text-orange-500",
    },
    {
      title: "Unread Messages",
      value: messageStats?.data?.unread || 0,
      icon: Mail,
      color: "text-red-500",
    },
    {
      title: "Archived",
      value: messageStats?.data?.archived || 0,
      icon: Archive,
      color: "text-gray-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/services"
              className="block rounded-lg border p-3 hover:bg-accent transition-colors"
            >
              <div className="font-medium">Manage Services</div>
              <div className="text-sm text-muted-foreground">
                Add, edit, or remove services
              </div>
            </Link>
            <Link
              href="/packages"
              className="block rounded-lg border p-3 hover:bg-accent transition-colors"
            >
              <div className="font-medium">Manage Packages</div>
              <div className="text-sm text-muted-foreground">
                Configure pricing packages
              </div>
            </Link>
            <Link
              href="/projects"
              className="block rounded-lg border p-3 hover:bg-accent transition-colors"
            >
              <div className="font-medium">Manage Projects</div>
              <div className="text-sm text-muted-foreground">
                Update your portfolio
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {messageStats?.data?.unread ? (
                <p>
                  You have{" "}
                  <span className="font-medium text-foreground">
                    {messageStats.data.unread} unread message
                    {messageStats.data.unread > 1 ? "s" : ""}
                  </span>
                </p>
              ) : (
                <p>No new messages</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

