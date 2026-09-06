<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('graduate_id')->constrained('graduates', 'user_id')->cascadeOnDelete();
            $table->string('title');
            $table->string('company');
            $table->string('duration')->default('');
            $table->text('description')->default('');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('educations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('graduate_id')->constrained('graduates', 'user_id')->cascadeOnDelete();
            $table->string('degree');
            $table->string('institution');
            $table->string('year', 50)->default('');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('educations');
        Schema::dropIfExists('work_experiences');
    }
};
