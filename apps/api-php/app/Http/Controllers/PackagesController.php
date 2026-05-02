<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PackagesController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Package::where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    public function show(string $id): JsonResponse
    {
        return response()->json(['success' => true, 'data' => Package::findOrFail($id)]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|string|max:100',
            'price_note' => 'nullable|string|max:255',
            'features' => 'nullable|array',
            'is_popular' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        return response()->json(['success' => true, 'data' => Package::create($data)], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $package = Package::findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|string|max:100',
            'price_note' => 'sometimes|string|max:255',
            'features' => 'sometimes|array',
            'is_popular' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer',
            'is_active' => 'sometimes|boolean',
        ]);
        $package->update($data);
        return response()->json(['success' => true, 'data' => $package]);
    }

    public function destroy(string $id): JsonResponse
    {
        Package::findOrFail($id)->delete();
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
            Package::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }
        return response()->json(['success' => true]);
    }
}
