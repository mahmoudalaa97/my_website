<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'email',
        'project_type',
        'message',
        'is_read',
        'is_archived',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'is_archived' => 'boolean',
            'created_at' => 'datetime',
        ];
    }
}
