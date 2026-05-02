<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServicesController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Service::where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $service = Service::findOrFail($id);
        return response()->json(['success' => true, 'data' => $service]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'nullable|string|max:100',
            'features' => 'nullable|array',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $service = Service::create($data);
        return response()->json(['success' => true, 'data' => $service], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $service = Service::findOrFail($id);

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'icon' => 'sometimes|string|max:100',
            'features' => 'sometimes|array',
            'sort_order' => 'sometimes|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        $service->update($data);
        return response()->json(['success' => true, 'data' => $service]);
    }

    public function destroy(string $id): JsonResponse
    {
        Service::findOrFail($id)->delete();
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
            Service::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['success' => true]);
    }
}
