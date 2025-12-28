"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorPicker } from "@/components/ui/color-picker";
import { ImageUpload } from "@/components/ui/image-upload";
import { api, SiteSettings } from "@/lib/api";
import { toast } from "@/components/ui/toaster";
import { Loader2, Save, Eye, Palette, Type, Globe, BarChart, Layout, Mail, Info } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";

const GOOGLE_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Source Sans Pro",
  "Playfair Display",
  "Merriweather",
  "Raleway",
  "Nunito",
  "Work Sans",
  "DM Sans",
  "Space Grotesk",
  "Outfit",
];

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { canManageSettings } = usePermissions();
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.getSettings(),
  });

  useEffect(() => {
    if (settings?.data) {
      setFormData(settings.data);
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: (data: Partial<SiteSettings>) => api.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({ title: "Success", description: "Settings updated successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out id and updatedAt before sending to API
    const { id, updatedAt, ...updateData } = formData;
    mutation.mutate(updateData);
  };

  const updateField = <K extends keyof SiteSettings>(field: K, value: SiteSettings[K]) => {
    
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSocialLink = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!canManageSettings && (
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
              <Eye className="h-5 w-5" />
              <span>You have view-only access to settings. Contact an admin to make changes.</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="general" className="gap-2">
            <Info className="h-4 w-4 hidden sm:inline" />
            General
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-2">
            <Palette className="h-4 w-4 hidden sm:inline" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="typography" className="gap-2">
            <Type className="h-4 w-4 hidden sm:inline" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <Globe className="h-4 w-4 hidden sm:inline" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart className="h-4 w-4 hidden sm:inline" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2">
            <Layout className="h-4 w-4 hidden sm:inline" />
            Content
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Mail className="h-4 w-4 hidden sm:inline" />
            Contact
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic information about your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={formData.siteName || ""}
                    onChange={(e) => updateField("siteName", e.target.value)}
                    disabled={!canManageSettings}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline || ""}
                    onChange={(e) => updateField("tagline", e.target.value)}
                    disabled={!canManageSettings}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={3}
                  disabled={!canManageSettings}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Settings */}
        <TabsContent value="branding">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logo & Favicon</CardTitle>
                <CardDescription>Upload your brand assets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <ImageUpload
                    label="Logo (Light Mode)"
                    value={formData.logoUrl || ""}
                    onChange={(url) => updateField("logoUrl", url)}
                    disabled={!canManageSettings}
                    accept="image/*"
                  />
                  <ImageUpload
                    label="Logo (Dark Mode)"
                    value={formData.logoDarkUrl || ""}
                    onChange={(url) => updateField("logoDarkUrl", url)}
                    disabled={!canManageSettings}
                    accept="image/*"
                  />
                </div>
                <ImageUpload
                  label="Favicon"
                  value={formData.faviconUrl || ""}
                  onChange={(url) => updateField("faviconUrl", url)}
                  disabled={!canManageSettings}
                  accept="image/x-icon,image/png,image/svg+xml"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Theme Colors</CardTitle>
                <CardDescription>Customize your website&apos;s color scheme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <ColorPicker
                    label="Primary Color"
                    value={formData.primaryColor || "#0ea5e9"}
                    onChange={(color) => updateField("primaryColor", color)}
                    disabled={!canManageSettings}
                  />
                  <ColorPicker
                    label="Secondary Color"
                    value={formData.secondaryColor || "#6366f1"}
                    onChange={(color) => updateField("secondaryColor", color)}
                    disabled={!canManageSettings}
                  />
                  <ColorPicker
                    label="Accent Color"
                    value={formData.accentColor || "#8b5cf6"}
                    onChange={(color) => updateField("accentColor", color)}
                    disabled={!canManageSettings}
                  />
                  <ColorPicker
                    label="Background Color"
                    value={formData.backgroundColor || "#09090b"}
                    onChange={(color) => updateField("backgroundColor", color)}
                    disabled={!canManageSettings}
                  />
                  <ColorPicker
                    label="Foreground Color"
                    value={formData.foregroundColor || "#fafafa"}
                    onChange={(color) => updateField("foregroundColor", color)}
                    disabled={!canManageSettings}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Typography Settings */}
        <TabsContent value="typography">
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>Choose fonts for your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Body Font</Label>
                  <select
                    id="fontFamily"
                    value={formData.fontFamily || "Inter"}
                    onChange={(e) => updateField("fontFamily", e.target.value)}
                    disabled={!canManageSettings}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {GOOGLE_FONTS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fontHeading">Heading Font</Label>
                  <select
                    id="fontHeading"
                    value={formData.fontHeading || "Inter"}
                    onChange={(e) => updateField("fontHeading", e.target.value)}
                    disabled={!canManageSettings}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {GOOGLE_FONTS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-lg border bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                <p style={{ fontFamily: formData.fontHeading }} className="text-2xl font-bold mb-1">
                  Heading Text ({formData.fontHeading})
                </p>
                <p style={{ fontFamily: formData.fontFamily }} className="text-base">
                  Body text using {formData.fontFamily}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Search engine optimization settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">Title Template</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle || ""}
                  onChange={(e) => updateField("seoTitle", e.target.value)}
                  placeholder="%s | Your Business"
                  disabled={!canManageSettings}
                />
                <p className="text-xs text-muted-foreground">Use %s as a placeholder for page titles</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">Meta Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription || ""}
                  onChange={(e) => updateField("seoDescription", e.target.value)}
                  rows={3}
                  disabled={!canManageSettings}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoKeywords">Keywords</Label>
                <Input
                  id="seoKeywords"
                  value={formData.seoKeywords || ""}
                  onChange={(e) => updateField("seoKeywords", e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  disabled={!canManageSettings}
                />
              </div>
              <ImageUpload
                label="OG Image (Social Sharing)"
                value={formData.ogImageUrl || ""}
                onChange={(url) => updateField("ogImageUrl", url)}
                disabled={!canManageSettings}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Settings */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Track your website visitors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input
                  id="googleAnalyticsId"
                  value={formData.googleAnalyticsId || ""}
                  onChange={(e) => updateField("googleAnalyticsId", e.target.value)}
                  placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
                  disabled={!canManageSettings}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plausibleDomain">Plausible Domain</Label>
                <Input
                  id="plausibleDomain"
                  value={formData.plausibleDomain || ""}
                  onChange={(e) => updateField("plausibleDomain", e.target.value)}
                  placeholder="yourdomain.com"
                  disabled={!canManageSettings}
                />
                <p className="text-xs text-muted-foreground">
                  Privacy-friendly analytics alternative to Google Analytics
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Settings */}
        <TabsContent value="content">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Content for the hero section of your homepage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heroBadge">Badge Text</Label>
                  <Input
                    id="heroBadge"
                    value={formData.heroBadge || ""}
                    onChange={(e) => updateField("heroBadge", e.target.value)}
                    disabled={!canManageSettings}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Input
                    id="heroTitle"
                    value={formData.heroTitle || ""}
                    onChange={(e) => updateField("heroTitle", e.target.value)}
                    disabled={!canManageSettings}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Textarea
                    id="heroSubtitle"
                    value={formData.heroSubtitle || ""}
                    onChange={(e) => updateField("heroSubtitle", e.target.value)}
                    rows={3}
                    disabled={!canManageSettings}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="heroCtaPrimary">Primary CTA Button</Label>
                    <Input
                      id="heroCtaPrimary"
                      value={formData.heroCtaPrimary || ""}
                      onChange={(e) => updateField("heroCtaPrimary", e.target.value)}
                      disabled={!canManageSettings}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heroCtaSecondary">Secondary CTA Button</Label>
                    <Input
                      id="heroCtaSecondary"
                      value={formData.heroCtaSecondary || ""}
                      onChange={(e) => updateField("heroCtaSecondary", e.target.value)}
                      disabled={!canManageSettings}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About Section</CardTitle>
                <CardDescription>Content for the about section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aboutTitle">About Title</Label>
                  <Input
                    id="aboutTitle"
                    value={formData.aboutTitle || ""}
                    onChange={(e) => updateField("aboutTitle", e.target.value)}
                    disabled={!canManageSettings}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutDescription">About Description</Label>
                  <Textarea
                    id="aboutDescription"
                    value={formData.aboutDescription || ""}
                    onChange={(e) => updateField("aboutDescription", e.target.value)}
                    rows={5}
                    disabled={!canManageSettings}
                  />
                </div>
                <ImageUpload
                  label="About Image"
                  value={formData.aboutImageUrl || ""}
                  onChange={(url) => updateField("aboutImageUrl", url)}
                  disabled={!canManageSettings}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Footer</CardTitle>
                <CardDescription>Footer content and copyright</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="footerText">Footer Text</Label>
                  <Textarea
                    id="footerText"
                    value={formData.footerText || ""}
                    onChange={(e) => updateField("footerText", e.target.value)}
                    rows={2}
                    disabled={!canManageSettings}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="copyrightText">Copyright Text</Label>
                  <Input
                    id="copyrightText"
                    value={formData.copyrightText || ""}
                    onChange={(e) => updateField("copyrightText", e.target.value)}
                    placeholder="© {year} {siteName}. All rights reserved."
                    disabled={!canManageSettings}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use {"{year}"} for current year and {"{siteName}"} for site name
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Your contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => updateField("email", e.target.value)}
                      disabled={!canManageSettings}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ""}
                      onChange={(e) => updateField("phone", e.target.value)}
                      disabled={!canManageSettings}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp || ""}
                      onChange={(e) => updateField("whatsapp", e.target.value)}
                      disabled={!canManageSettings}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location || ""}
                      onChange={(e) => updateField("location", e.target.value)}
                      disabled={!canManageSettings}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Links to your social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.socialLinks?.linkedin || ""}
                      onChange={(e) => updateSocialLink("linkedin", e.target.value)}
                      placeholder="https://linkedin.com/in/your-profile"
                      disabled={!canManageSettings}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={formData.socialLinks?.github || ""}
                      onChange={(e) => updateSocialLink("github", e.target.value)}
                      placeholder="https://github.com/your-profile"
                      disabled={!canManageSettings}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={formData.socialLinks?.twitter || ""}
                      onChange={(e) => updateSocialLink("twitter", e.target.value)}
                      placeholder="https://twitter.com/your-profile"
                      disabled={!canManageSettings}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={formData.socialLinks?.instagram || ""}
                      onChange={(e) => updateSocialLink("instagram", e.target.value)}
                      placeholder="https://instagram.com/your-profile"
                      disabled={!canManageSettings}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      value={formData.socialLinks?.youtube || ""}
                      onChange={(e) => updateSocialLink("youtube", e.target.value)}
                      placeholder="https://youtube.com/@your-channel"
                      disabled={!canManageSettings}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={formData.socialLinks?.facebook || ""}
                      onChange={(e) => updateSocialLink("facebook", e.target.value)}
                      placeholder="https://facebook.com/your-page"
                      disabled={!canManageSettings}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {canManageSettings && (
        <div className="flex justify-end sticky bottom-6 bg-background/80 backdrop-blur-sm py-4 -mx-6 px-6 border-t">
          <Button type="submit" disabled={mutation.isPending} size="lg">
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save All Changes
          </Button>
        </div>
      )}
    </form>
  );
}
