<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            DB::connection()->getPdo();
            $db = 'connected';
        } catch (\Throwable $e) {
            $db = 'disconnected';
        }

        return response()->json([
            'success' => true,
            'status' => 'ok',
            'database' => $db,
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
