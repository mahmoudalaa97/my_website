<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();

            // Basic Info
            $table->string('site_name')->default('Your Business Name');
            $table->string('tagline')->default('Your Tagline Here');
            $table->text('description')->nullable();

            // Branding
            $table->string('logo_url', 1000)->default('');
            $table->string('logo_dark_url', 1000)->default('');
            $table->string('favicon_url', 1000)->default('');

            // Theme Colors
            $table->string('primary_color', 50)->default('#0ea5e9');
            $table->string('secondary_color', 50)->default('#6366f1');
            $table->string('accent_color', 50)->default('#8b5cf6');
            $table->string('background_color', 50)->default('#09090b');
            $table->string('foreground_color', 50)->default('#fafafa');

            // Typography
            $table->string('font_family')->default('Inter');
            $table->string('font_heading')->default('Inter');

            // SEO
            $table->string('seo_title')->default('%s | Your Business');
            $table->text('seo_description')->nullable();
            $table->string('seo_keywords', 1000)->default('');
            $table->string('og_image_url', 1000)->default('');

            // Analytics
            $table->string('google_analytics_id')->default('');
            $table->string('plausible_domain')->default('');

            // Hero
            $table->string('hero_title')->default('Welcome to Our Website');
            $table->text('hero_subtitle')->nullable();
            $table->string('hero_badge')->default('Professional Services');
            $table->string('hero_cta_primary')->default('Our Services');
            $table->string('hero_cta_secondary')->default('Contact Us');

            // About
            $table->string('about_title')->default('About Us');
            $table->text('about_description')->nullable();
            $table->string('about_image_url', 1000)->default('');

            // Contact
            $table->string('email')->default('');
            $table->string('phone')->default('');
            $table->string('whatsapp')->default('');
            $table->string('location')->default('');

            // Social
            $table->json('social_links');
            $table->json('stats');

            // Footer
            $table->string('footer_text')->default('');
            $table->string('copyright_text')->default('© {year} {siteName}. All rights reserved.');

            $table->timestamp('updated_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
