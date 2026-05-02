<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Media::query()->orderByDesc('created_at');
        if ($request->filled('folder')) {
            $query->where('folder', $request->string('folder'));
        }
        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }
        return response()->json(['success' => true, 'data' => $query->get()]);
    }

    public function folders(): JsonResponse
    {
        $folders = Media::whereNotNull('folder')->distinct()->pluck('folder');
        return response()->json(['success' => true, 'data' => $folders]);
    }

    public function show(string $id): JsonResponse
    {
        return response()->json(['success' => true, 'data' => Media::findOrFail($id)]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:10240',
            'folder' => 'nullable|string',
            'alt_text' => 'nullable|string',
        ]);

        return response()->json([
            'success' => true,
            'data' => $this->saveFile($request, $request->file('file')),
        ], 201);
    }

    public function storeMultiple(Request $request): JsonResponse
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'file|max:10240',
            'folder' => 'nullable|string',
        ]);

        $saved = [];
        foreach ($request->file('files') as $file) {
            $saved[] = $this->saveFile($request, $file);
        }
        return response()->json(['success' => true, 'data' => $saved], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $media = Media::findOrFail($id);
        $data = $request->validate([
            'alt_text' => 'sometimes|nullable|string',
            'folder' => 'sometimes|nullable|string',
        ]);
        $media->update($data);
        return response()->json(['success' => true, 'data' => $media]);
    }

    public function destroy(string $id): JsonResponse
    {
        $media = Media::findOrFail($id);
        if ($media->provider === 'local') {
            Storage::disk('public')->delete(str_replace('/storage/', '', $media->url));
        }
        $media->delete();
        return response()->json(['success' => true]);
    }

    private function saveFile(Request $request, $file): Media
    {
        $folder = $request->input('folder', 'uploads');
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid().'.'.$extension;
        $path = $file->storeAs($folder, $filename, 'public');

        $mime = $file->getMimeType();
        $type = str_starts_with($mime, 'image/') ? 'image'
              : (str_starts_with($mime, 'video/') ? 'video' : 'document');

        return Media::create([
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $mime,
            'size' => $file->getSize(),
            'url' => '/storage/'.$path,
            'type' => $type,
            'provider' => 'local',
            'folder' => $folder,
            'alt_text' => $request->input('alt_text'),
            'uploaded_by' => $request->user()?->id,
        ]);
    }
}
