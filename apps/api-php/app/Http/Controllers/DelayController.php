<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DelayController extends Controller
{
    private const DEFAULT_SECONDS = 1;

    private const MAX_SECONDS = 10;

    public function index(Request $request): JsonResponse
    {
        $seconds = (int) $request->query('seconds', self::DEFAULT_SECONDS);
        $seconds = max(0, min($seconds, self::MAX_SECONDS));

        if ($seconds > 0) {
            sleep($seconds);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'delayedSeconds' => $seconds,
                'timestamp' => now()->toIso8601String(),
            ],
        ]);
    }
}
