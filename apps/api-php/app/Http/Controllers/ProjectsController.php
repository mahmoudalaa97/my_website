<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectsController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Project::where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    public function featured(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Project::where('is_active', true)->where('is_featured', true)
                ->orderBy('sort_order')->get(),
        ]);
    }

    public function show(string $id): JsonResponse
    {
        return response()->json(['success' => true, 'data' => Project::findOrFail($id)]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'nullable|string|max:1000',
            'tags' => 'nullable|array',
            'live_url' => 'nullable|string|max:1000',
            'github_url' => 'nullable|string|max:1000',
            'is_featured' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        return response()->json(['success' => true, 'data' => Project::create($data)], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $project = Project::findOrFail($id);
        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'image_url' => 'sometimes|nullable|string|max:1000',
            'tags' => 'sometimes|array',
            'live_url' => 'sometimes|nullable|string|max:1000',
            'github_url' => 'sometimes|nullable|string|max:1000',
            'is_featured' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer',
            'is_active' => 'sometimes|boolean',
        ]);
        $project->update($data);
        return response()->json(['success' => true, 'data' => $project]);
    }

    public function destroy(string $id): JsonResponse
    {
        Project::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    public function reorder(Request $request): JsonResponse
    {
        $data = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|uuid',
            'items.*.sort_order' => 'required|integer',
        ]);

        foreach ($data['items'] as $item) {
            Project::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }
        return response()->json(['success' => true]);
    }
}
