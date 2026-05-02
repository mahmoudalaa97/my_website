<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Package;
use App\Models\Project;
use App\Models\Service;
use App\Models\SiteSettings;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Default super admin
        Admin::firstOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@admin.com')],
            [
                'password' => env('ADMIN_PASSWORD', 'Admin123!'),
                'name' => env('ADMIN_NAME', 'Super Admin'),
                'role' => Admin::ROLE_SUPER_ADMIN,
                'is_active' => true,
            ]
        );

        // Default site settings
        SiteSettings::firstOrCreate([], [
            'social_links' => [],
            'stats' => [
                ['value' => '50+', 'label' => 'Projects Completed'],
                ['value' => '10+', 'label' => 'Years Experience'],
                ['value' => '100%', 'label' => 'Client Satisfaction'],
            ],
        ]);

        // Sample services
        if (Service::count() === 0) {
            Service::create([
                'title' => 'Web Development',
                'description' => 'Modern, fast, responsive websites built with the latest technologies.',
                'icon' => 'Code',
                'features' => ['Next.js & React', 'Tailwind CSS', 'SEO optimized'],
                'sort_order' => 1,
            ]);
            Service::create([
                'title' => 'Mobile Apps',
                'description' => 'Native and cross-platform mobile experiences.',
                'icon' => 'Smartphone',
                'features' => ['React Native', 'iOS & Android', 'App Store deployment'],
                'sort_order' => 2,
            ]);
        }

        // Sample packages
        if (Package::count() === 0) {
            Package::create([
                'name' => 'Starter',
                'description' => 'Perfect for small projects',
                'price' => '$499',
                'price_note' => 'one-time',
                'features' => ['5 pages', 'Responsive design', 'Basic SEO'],
                'sort_order' => 1,
            ]);
            Package::create([
                'name' => 'Professional',
                'description' => 'For growing businesses',
                'price' => '$1,499',
                'price_note' => 'one-time',
                'features' => ['Unlimited pages', 'CMS', 'Advanced SEO', '3 months support'],
                'is_popular' => true,
                'sort_order' => 2,
            ]);
        }

        // Sample project
        if (Project::count() === 0) {
            Project::create([
                'title' => 'Sample Project',
                'description' => 'A showcase of our work.',
                'tags' => ['Next.js', 'TypeScript', 'Tailwind'],
                'is_featured' => true,
                'sort_order' => 1,
            ]);
        }
    }
}
