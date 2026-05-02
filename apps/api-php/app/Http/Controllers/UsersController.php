<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UsersController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Admin::orderByDesc('created_at')->get([
                'id', 'email', 'name', 'role', 'is_active', 'last_login_at', 'created_at',
            ]),
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $admin = Admin::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $admin->only([
                'id', 'email', 'name', 'role', 'is_active', 'last_login_at', 'created_at',
            ]),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => 'required|email|unique:admins,email',
            'password' => 'required|string|min:8',
            'name' => 'required|string|max:255',
            'role' => 'required|in:super_admin,admin,editor,viewer',
        ]);

        $admin = Admin::create([...$data, 'is_active' => true]);
        return response()->json([
            'success' => true,
            'data' => $admin->only(['id', 'email', 'name', 'role', 'is_active']),
        ], 201);
    }

    public function invite(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => 'required|email|unique:admins,email',
            'name' => 'required|string|max:255',
            'role' => 'required|in:super_admin,admin,editor,viewer',
        ]);

        $token = Str::random(64);
        $admin = Admin::create([
            ...$data,
            'is_active' => false,
            'invite_token' => hash('sha256', $token),
            'invite_expires_at' => now()->addDays(7),
        ]);

        // TODO: send email with invite link containing $token
        // Mail::to($admin->email)->send(new InviteMail($token));

        return response()->json([
            'success' => true,
            'data' => [
                'admin' => $admin->only(['id', 'email', 'name', 'role']),
                'invite_token' => $token, // remove in production once email is wired
            ],
        ], 201);
    }

    public function acceptInvite(Request $request): JsonResponse
    {
        $data = $request->validate([
            'token' => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        $admin = Admin::where('invite_token', hash('sha256', $data['token']))
            ->where('invite_expires_at', '>', now())
            ->first();

        if (! $admin) {
            return response()->json(['success' => false, 'message' => 'Invalid or expired invite'], 400);
        }

        $admin->update([
            'password' => $data['password'],
            'is_active' => true,
            'invite_token' => null,
            'invite_expires_at' => null,
        ]);

        return response()->json(['success' => true]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $admin = Admin::findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:admins,email,'.$admin->id,
            'role' => 'sometimes|in:super_admin,admin,editor,viewer',
        ]);
        $admin->update($data);
        return response()->json([
            'success' => true,
            'data' => $admin->only(['id', 'email', 'name', 'role', 'is_active']),
        ]);
    }

    public function suspend(string $id): JsonResponse
    {
        $admin = Admin::findOrFail($id);
        $admin->update(['is_active' => false]);
        return response()->json(['success' => true]);
    }

    public function activate(string $id): JsonResponse
    {
        $admin = Admin::findOrFail($id);
        $admin->update(['is_active' => true]);
        return response()->json(['success' => true]);
    }

    public function resetPassword(Request $request, string $id): JsonResponse
    {
        $data = $request->validate(['password' => 'required|string|min:8']);
        $admin = Admin::findOrFail($id);
        $admin->update(['password' => $data['password']]);
        return response()->json(['success' => true]);
    }

    public function destroy(string $id): JsonResponse
    {
        Admin::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}
