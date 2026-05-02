<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SiteSettings extends Model
{
    use HasUuids;

    protected $table = 'site_settings';

    public $timestamps = false;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'social_links' => 'array',
            'stats' => 'array',
            'updated_at' => 'datetime',
        ];
    }
}
