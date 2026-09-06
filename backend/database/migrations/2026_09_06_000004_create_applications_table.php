<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('applications')) {
            return;
        }

        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained('jobs')->cascadeOnDelete();
            $table->foreignId('graduate_id')->constrained('graduates', 'user_id')->cascadeOnDelete();
            $table->text('cover_letter')->default('');
            $table->string('status', 30)->default('pending');
            $table->integer('score')->nullable();
            $table->timestamp('applied_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            $table->unique(['job_id', 'graduate_id']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
