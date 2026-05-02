<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()->only([
                'id', 'email', 'name', 'role', 'is_active', 'last_login_at', 'created_at',
            ]),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $admin = $request->user();
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:admins,email,'.$admin->id,
        ]);
        $admin->update($data);
        return response()->json([
            'success' => true,
            'data' => $admin->only(['id', 'email', 'name', 'role']),
        ]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $admin = $request->user();
        $data = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8',
        ]);

        if (! Hash::check($data['current_password'], $admin->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect'],
            ]);
        }

        $admin->update(['password' => $data['new_password']]);
        return response()->json(['success' => true, 'message' => 'Password updated']);
    }
}
