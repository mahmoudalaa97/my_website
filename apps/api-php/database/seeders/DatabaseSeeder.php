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
            'tagline' => 'Software partner for startups & small business owners',
            'description' => 'Affordable websites, mobile apps, and Google Maps setup for startups and small business owners.',
            'seo_description' => 'Affordable websites, mobile apps, and Google Maps setup for startups and small business owners. Get found online and grow.',
            'seo_keywords' => 'small business website, startup software, mobile app developer, google business profile setup, google maps for business, local seo, affordable website design',
            'hero_title' => 'Grow Your Business Online',
            'hero_subtitle' => "I build websites and mobile apps for startups and small business owners — and get you on Google Maps so customers actually find you. Launch fast, spend less, grow more.",
            'hero_badge' => 'For Startups & Small Business Owners',
            'hero_cta_primary' => 'Start Growing',
            'hero_cta_secondary' => 'See What I Build',
            'about_title' => 'Your Software Partner For Growth',
            'about_description' => "I'm an entrepreneur and software builder who loves working with startups and small business owners. I've been on your side of the table — I know what it's like to need a real website, an app that works, and customers who can actually find you, without paying agency prices.\n\nI build the whole thing with you: your website, your mobile app, your Google Business Profile — all connected so your business shows up online, ranks in \"near me\" searches, and turns visitors into customers. Simple, honest, and priced for real business owners.",
            'social_links' => [],
            'maintenance_mode' => false,
            'stats' => [
                ['value' => '5+', 'label' => 'Years Building'],
                ['value' => '50+', 'label' => 'Businesses Online'],
                ['value' => '30+', 'label' => 'On Google Maps'],
                ['value' => '100%', 'label' => 'Owner Approved'],
            ],
        ]);

        // Sample services
        if (Service::count() === 0) {
            Service::create([
                'title' => 'Business Websites',
                'description' => 'Fast, modern websites built to attract customers and convert. Mobile‑friendly, SEO‑ready, and easy to update.',
                'icon' => 'Globe',
                'features' => ['Custom design', 'Mobile‑first', 'SEO optimized'],
                'sort_order' => 1,
            ]);
            Service::create([
                'title' => 'Mobile Apps',
                'description' => 'iOS and Android apps that let your customers order, book, and connect with your business from their phone.',
                'icon' => 'Smartphone',
                'features' => ['iOS & Android', 'App Store & Play Store', 'Push notifications'],
                'sort_order' => 2,
            ]);
            Service::create([
                'title' => 'Google Maps & Local Presence',
                'description' => 'Get listed on Google Maps, verified, and optimized so nearby customers actually find you in search.',
                'icon' => 'MapPin',
                'features' => ['Google Business Profile', 'Local SEO', 'Reviews & photos'],
                'sort_order' => 3,
            ]);
            Service::create([
                'title' => 'E‑commerce & Online Ordering',
                'description' => 'Sell products or accept orders online. Payments, inventory, delivery — all in one place.',
                'icon' => 'ShoppingCart',
                'features' => ['Online store', 'Payments integrated', 'Order management'],
                'sort_order' => 4,
            ]);
            Service::create([
                'title' => 'Automation That Saves Time',
                'description' => 'Automate bookings, invoices, follow‑ups and daily tasks so you can focus on your customers, not paperwork.',
                'icon' => 'Workflow',
                'features' => ['Bookings & invoices', 'Email/WhatsApp automation', 'Simple dashboards'],
                'sort_order' => 5,
            ]);
            Service::create([
                'title' => 'Ongoing Support & Growth',
                'description' => 'I stick around after launch — updates, fixes, new features, and help growing your online presence as you scale.',
                'icon' => 'LifeBuoy',
                'features' => ['Monthly updates', 'Priority support', 'Growth advice'],
                'sort_order' => 6,
            ]);
        }

        // Sample packages
        if (Package::count() === 0) {
            Package::create([
                'name' => 'Launch',
                'description' => 'Get your business online fast',
                'price' => '$499',
                'price_note' => 'one-time',
                'features' => [
                    '5‑page business website',
                    'Mobile responsive',
                    'Google Business Profile setup',
                    'Basic SEO',
                ],
                'sort_order' => 1,
            ]);
            Package::create([
                'name' => 'Grow',
                'description' => 'Website + Google Maps + online ordering',
                'price' => '$1,499',
                'price_note' => 'one-time',
                'features' => [
                    'Custom website with CMS',
                    'Google Maps optimization & local SEO',
                    'Online ordering or bookings',
                    'Reviews collection system',
                    '3 months support',
                ],
                'is_popular' => true,
                'sort_order' => 2,
            ]);
            Package::create([
                'name' => 'Scale',
                'description' => 'Full digital presence with mobile app',
                'price' => 'From $3,499',
                'price_note' => 'custom quote',
                'features' => [
                    'Everything in Grow',
                    'iOS & Android mobile app',
                    'Automation (bookings, invoices, follow‑ups)',
                    'Priority support',
                    'Ongoing growth advice',
                ],
                'sort_order' => 3,
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
