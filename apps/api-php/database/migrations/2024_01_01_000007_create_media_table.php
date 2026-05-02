<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('filename');
            $table->string('original_name');
            $table->string('mime_type', 100);
            $table->integer('size');
            $table->string('url', 1000);
            $table->string('thumbnail_url', 1000)->nullable();
            $table->enum('type', ['image', 'document', 'video'])->default('image');
            $table->enum('provider', ['local', 's3', 'cloudinary'])->default('local');
            $table->string('folder')->nullable();
            $table->string('alt_text')->nullable();
            $table->uuid('uploaded_by')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('uploaded_by')->references('id')->on('admins')->nullOnDelete();
            $table->index('folder');
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
