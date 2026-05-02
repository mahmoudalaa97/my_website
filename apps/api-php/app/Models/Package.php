<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'description',
        'price',
        'price_note',
        'features',
        'is_popular',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'is_popular' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
