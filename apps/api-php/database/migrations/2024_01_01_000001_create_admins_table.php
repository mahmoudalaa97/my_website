<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email')->unique();
            $table->string('password')->nullable();
            $table->string('name');
            $table->enum('role', ['super_admin', 'admin', 'editor', 'viewer'])->default('viewer');
            $table->boolean('is_active')->default(true);
            $table->string('invite_token')->nullable();
            $table->timestamp('invite_expires_at')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();

            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};
