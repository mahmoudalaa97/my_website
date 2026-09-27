<?php

namespace App\Http\Controllers;

use App\Models\SiteSettings;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function index(): JsonResponse
    {
        $maintenance = false;

        try {
            DB::connection()->getPdo();
            $db = 'connected';
            $maintenance = (bool) SiteSettings::query()->value('maintenance_mode');
        } catch (\Throwable $e) {
            $db = 'disconnected';
        }

        return response()->json([
            'success' => true,
            'status' => $maintenance ? 'maintenance' : 'ok',
            'database' => $db,
            'maintenance' => $maintenance,
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    public function live(): JsonResponse
    {
        return response()->json(['status' => 'alive']);
    }

    public function ready(): JsonResponse
    {
        try {
            DB::connection()->getPdo();
            return response()->json(['status' => 'ready']);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'not_ready'], 503);
        }
    }
}
