<?php

namespace App\Http\Controllers;

use App\Models\SiteSettings;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = SiteSettings::firstOrCreate([], [
            'social_links' => [],
            'stats' => [],
        ]);

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    public function branding(): JsonResponse
    {
        $settings = SiteSettings::firstOrCreate([], [
            'social_links' => [],
            'stats' => [],
        ]);

        return response()->json([
            'success' => true,
            'data' => $settings->only([
                'site_name', 'tagline', 'logo_url', 'logo_dark_url', 'favicon_url',
                'primary_color', 'secondary_color', 'accent_color',
                'background_color', 'foreground_color',
                'font_family', 'font_heading',
            ]),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $settings = SiteSettings::firstOrCreate([], [
            'social_links' => [],
            'stats' => [],
        ]);

        $settings->fill($request->all())->save();

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }
}
