<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\MessagesController;
use App\Http\Controllers\PackagesController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectsController;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;

// Health
Route::get('health', [HealthController::class, 'index']);
Route::get('health/live', [HealthController::class, 'live']);
Route::get('health/ready', [HealthController::class, 'ready']);

// Named fallback so redirected unauthenticated requests get JSON, not a 500 from URL generator
Route::get('login', fn () => response()->json([
    'success' => false,
    'message' => 'Unauthenticated',
], 401))->name('login');

// Auth
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/logout', [AuthController::class, 'logout']);
Route::get('auth/session', [AuthController::class, 'session']); // optional auth — controller handles both
Route::middleware('auth:sanctum')->group(function () {
    Route::get('auth/me', [AuthController::class, 'me']);
});

// Public reads + create message
Route::get('settings', [SettingsController::class, 'index']);
Route::get('settings/branding', [SettingsController::class, 'branding']);
Route::get('services', [ServicesController::class, 'index']);
Route::get('services/{id}', [ServicesController::class, 'show']);
Route::get('packages', [PackagesController::class, 'index']);
Route::get('packages/{id}', [PackagesController::class, 'show']);
Route::get('projects', [ProjectsController::class, 'index']);
Route::get('projects/featured', [ProjectsController::class, 'featured']);
Route::get('projects/{id}', [ProjectsController::class, 'show']);
Route::post('messages', [MessagesController::class, 'store']);

// Public invite acceptance
Route::post('users/accept-invite', [UsersController::class, 'acceptInvite']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {

    // Profile (any authenticated admin)
    Route::get('profile', [ProfileController::class, 'show']);
    Route::put('profile', [ProfileController::class, 'update']);
    Route::put('profile/password', [ProfileController::class, 'updatePassword']);

    // Messages — admin/super_admin only
    Route::middleware('role:super_admin,admin')->group(function () {
        Route::get('messages', [MessagesController::class, 'index']);
        Route::get('messages/stats', [MessagesController::class, 'stats']);
        Route::get('messages/{id}', [MessagesController::class, 'show']);
        Route::patch('messages/{id}/read', [MessagesController::class, 'markRead']);
        Route::patch('messages/{id}/archive', [MessagesController::class, 'archive']);
        Route::patch('messages/{id}/unarchive', [MessagesController::class, 'unarchive']);
        Route::delete('messages/{id}', [MessagesController::class, 'destroy']);
    });

    // Settings update — admin/super_admin
    Route::middleware('role:super_admin,admin')->group(function () {
        Route::put('settings', [SettingsController::class, 'update']);
    });

    // Services — editor+ for create/update/reorder, admin+ for delete
    Route::middleware('role:super_admin,admin,editor')->group(function () {
        Route::post('services', [ServicesController::class, 'store']);
        Route::put('services/{id}', [ServicesController::class, 'update']);
        Route::post('services/reorder', [ServicesController::class, 'reorder']);

        Route::post('packages', [PackagesController::class, 'store']);
        Route::put('packages/{id}', [PackagesController::class, 'update']);
        Route::post('packages/reorder', [PackagesController::class, 'reorder']);

        Route::post('projects', [ProjectsController::class, 'store']);
        Route::put('projects/{id}', [ProjectsController::class, 'update']);
        Route::post('projects/reorder', [ProjectsController::class, 'reorder']);
    });
    Route::middleware('role:super_admin,admin')->group(function () {
        Route::delete('services/{id}', [ServicesController::class, 'destroy']);
        Route::delete('packages/{id}', [PackagesController::class, 'destroy']);
        Route::delete('projects/{id}', [ProjectsController::class, 'destroy']);
    });

    // Users — super_admin/admin only
    Route::middleware('role:super_admin,admin')->group(function () {
        Route::get('users', [UsersController::class, 'index']);
        Route::get('users/{id}', [UsersController::class, 'show']);
        Route::post('users', [UsersController::class, 'store']);
        Route::post('users/invite', [UsersController::class, 'invite']);
        Route::put('users/{id}', [UsersController::class, 'update']);
        Route::put('users/{id}/suspend', [UsersController::class, 'suspend']);
        Route::put('users/{id}/activate', [UsersController::class, 'activate']);
        Route::put('users/{id}/reset-password', [UsersController::class, 'resetPassword']);
        Route::delete('users/{id}', [UsersController::class, 'destroy']);
    });

    // Upload — editor+ for create/update, admin+ for delete
    Route::get('upload', [UploadController::class, 'index']);
    Route::get('upload/folders', [UploadController::class, 'folders']);
    Route::get('upload/{id}', [UploadController::class, 'show']);
    Route::middleware('role:super_admin,admin,editor')->group(function () {
        Route::post('upload', [UploadController::class, 'store']);
        Route::post('upload/multiple', [UploadController::class, 'storeMultiple']);
        Route::put('upload/{id}', [UploadController::class, 'update']);
    });
    Route::middleware('role:super_admin,admin')->group(function () {
        Route::delete('upload/{id}', [UploadController::class, 'destroy']);
    });
});
