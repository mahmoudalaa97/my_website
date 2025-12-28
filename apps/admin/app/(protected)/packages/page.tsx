"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/toaster";
import { Loader2, Plus, Pencil, Trash2, X, Save, Star, Eye } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";

interface PackageForm {
  id?: string;
  name: string;
  description: string;
  price: string;
  priceNote: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

const defaultForm: PackageForm = {
  name: "",
  description: "",
  price: "",
  priceNote: "",
  features: [],
  isPopular: false,
  isActive: true,
};

export default function PackagesPage() {
  const queryClient = useQueryClient();
  const { canEdit, canDelete, isViewer } = usePermissions();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PackageForm>(defaultForm);
  const [featureInput, setFeatureInput] = useState("");

  const { data: packages, isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: () => api.getPackages(true),
  });

  const createMutation = useMutation({
    mutationFn: (data: PackageForm) => api.createPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast({ title: "Success", description: "Package created successfully" });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PackageForm }) =>
      api.updatePackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast({ title: "Success", description: "Package updated successfully" });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deletePackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast({ title: "Success", description: "Package deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData(defaultForm);
    setIsEditing(false);
    setFeatureInput("");
  };

  const handleEdit = (pkg: any) => {
    setFormData({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      priceNote: pkg.priceNote || "",
      features: pkg.features || [],
      isPopular: pkg.isPopular,
      isActive: pkg.isActive,
    });
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...dataWithoutId } = formData;
      updateMutation.mutate({ id: formData.id, data: dataWithoutId });
    } else {
      createMutation.mutate(formData);
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({ ...formData, features: [...formData.features, featureInput.trim()] });
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {isViewer && (
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
              <Eye className="h-5 w-5" />
              <span>You have view-only access. Contact an admin to make changes.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {canEdit && (
        <Card>
          <CardHeader>
            <CardTitle>{formData.id ? "Edit Package" : "Add New Package"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Package Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. $999 or Custom"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceNote">Price Note</Label>
              <Input
                id="priceNote"
                value={formData.priceNote}
                onChange={(e) => setFormData({ ...formData, priceNote: e.target.value })}
                placeholder="e.g. starting price, per month"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Features</Label>
              <div className="flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Add a feature"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                />
                <Button type="button" variant="outline" onClick={addFeature}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
                  >
                    {feature}
                    <button type="button" onClick={() => removeFeature(index)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isPopular}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked })}
                />
                <Label>Popular</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label>Active</Label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {formData.id ? "Update" : "Create"} Package
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Packages</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {packages?.data?.map((pkg: any) => (
                <div
                  key={pkg.id}
                  className="rounded-lg border p-4 relative"
                >
                  {pkg.isPopular && (
                    <Star className="absolute top-3 right-3 h-4 w-4 text-yellow-500 fill-yellow-500" />
                  )}
                  <div className="mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{pkg.name}</h3>
                      {!pkg.isActive && (
                        <span className="rounded bg-muted px-2 py-0.5 text-xs">Inactive</span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-primary">{pkg.price}</p>
                    {pkg.priceNote && (
                      <p className="text-xs text-muted-foreground">{pkg.priceNote}</p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {pkg.description}
                  </p>
                  {(canEdit || canDelete) && (
                    <div className="flex gap-2">
                      {canEdit && (
                        <Button variant="outline" size="sm" onClick={() => handleEdit(pkg)}>
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMutation.mutate(pkg.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3 mr-1 text-destructive" />
                          Delete
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {packages?.data?.length === 0 && (
                <p className="text-center text-muted-foreground py-8 col-span-3">No packages found</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

