"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/settings": "Site Settings",
  "/services": "Services",
  "/packages": "Pricing Packages",
  "/projects": "Projects",
  "/messages": "Messages",
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Admin";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
    </header>
  );
}

