"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/toaster";
import { usePermissions } from "@/hooks/use-permissions";
import { Loader2, TriangleAlert } from "lucide-react";

export function MaintenanceToggle() {
  const queryClient = useQueryClient();
  const { canManageSettings } = usePermissions();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.getSettings(),
  });

  const enabled = Boolean(settings?.data?.maintenanceMode);

  const mutation = useMutation({
    mutationFn: (maintenanceMode: boolean) => api.updateSettings({ maintenanceMode }),
    onSuccess: (_res, maintenanceMode) => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({
        title: maintenanceMode ? "Maintenance mode on" : "Site is live",
        description: maintenanceMode
          ? "Visitors now see the maintenance page instead of the website."
          : "The public website is visible again.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update maintenance mode",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className={enabled ? "border-amber-500/60 bg-amber-500/5" : undefined}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TriangleAlert className="h-5 w-5" />
          Maintenance mode
        </CardTitle>
        <CardDescription>
          Hide the public website and show a short “back in a moment” page. The admin panel stays available.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <Label htmlFor="maintenance-mode" className="text-base">
              {enabled ? "Website is hidden" : "Website is live"}
            </Label>
            <p className="text-sm text-muted-foreground">
              {enabled
                ? "Customers will not see services, pricing, or contact details."
                : "Turn this on if the site should not be public right now."}
            </p>
          </div>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <Switch
              id="maintenance-mode"
              checked={enabled}
              disabled={!canManageSettings || mutation.isPending}
              onCheckedChange={(checked) => mutation.mutate(checked)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
