<?php

namespace App\Models;

use App\Support\StorageUrl;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Media extends Model
{
    use HasUuids;

    protected $table = 'media';

    public $timestamps = false;

    protected $fillable = [
        'filename',
        'original_name',
        'mime_type',
        'size',
        'url',
        'thumbnail_url',
        'type',
        'provider',
        'folder',
        'alt_text',
        'uploaded_by',
    ];

    protected function casts(): array
    {
        return [
            'size' => 'integer',
            'created_at' => 'datetime',
        ];
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'uploaded_by');
    }

    public function getUrlAttribute(?string $value): ?string
    {
        return StorageUrl::toPublicUrl($value);
    }

    public function getThumbnailUrlAttribute(?string $value): ?string
    {
        return StorageUrl::toPublicUrl($value);
    }
}
