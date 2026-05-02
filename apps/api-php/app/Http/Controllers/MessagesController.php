<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessagesController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'project_type' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        $msg = ContactMessage::create($data);
        return response()->json(['success' => true, 'data' => $msg], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $query = ContactMessage::query()->orderByDesc('created_at');

        if ($request->boolean('unread')) {
            $query->where('is_read', false);
        }
        if ($request->has('archived')) {
            $query->where('is_archived', $request->boolean('archived'));
        }

        return response()->json([
            'success' => true,
            'data' => $query->get(),
        ]);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total' => ContactMessage::count(),
                'unread' => ContactMessage::where('is_read', false)->count(),
                'archived' => ContactMessage::where('is_archived', true)->count(),
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        return response()->json(['success' => true, 'data' => ContactMessage::findOrFail($id)]);
    }

    public function markRead(string $id): JsonResponse
    {
        $msg = ContactMessage::findOrFail($id);
        $msg->update(['is_read' => true]);
        return response()->json(['success' => true, 'data' => $msg]);
    }

    public function archive(string $id): JsonResponse
    {
        $msg = ContactMessage::findOrFail($id);
        $msg->update(['is_archived' => true]);
        return response()->json(['success' => true, 'data' => $msg]);
    }

    public function unarchive(string $id): JsonResponse
    {
        $msg = ContactMessage::findOrFail($id);
        $msg->update(['is_archived' => false]);
        return response()->json(['success' => true, 'data' => $msg]);
    }

    public function destroy(string $id): JsonResponse
    {
        ContactMessage::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}
