<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $admin = Admin::where('email', $data['email'])->first();

        if (! $admin || ! Hash::check($data['password'], $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]);
        }

        if (! $admin->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Account is suspended',
            ], 403);
        }

        $admin->update(['last_login_at' => now()]);

        $token = $admin->createToken('auth')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'admin' => $admin->only(['id', 'email', 'name', 'role', 'is_active', 'last_login_at']),
                'accessToken' => $token,
            ],
        ])->cookie(
            'accessToken',
            $token,
            60 * 24 * 7,
            '/',
            null,
            app()->isProduction(),
            true,
            false,
            'lax'
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ])->withoutCookie('accessToken');
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()->only([
                'id', 'email', 'name', 'role', 'is_active', 'last_login_at', 'created_at',
            ]),
        ]);
    }

    public function session(Request $request): JsonResponse
    {
        // Optional auth — try the sanctum guard but don't require it
        $admin = auth('sanctum')->user() ?: $this->resolveFromCookie($request);

        return response()->json([
            'success' => true,
            'data' => $admin
                ? ['isAuthenticated' => true, 'admin' => $admin->only(['id', 'email', 'name', 'role'])]
                : ['isAuthenticated' => false],
        ]);
    }

    private function resolveFromCookie(Request $request): ?Admin
    {
        $token = $request->cookie('accessToken');
        if (! $token) {
            return null;
        }
        $accessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
        return $accessToken?->tokenable;
    }
}
