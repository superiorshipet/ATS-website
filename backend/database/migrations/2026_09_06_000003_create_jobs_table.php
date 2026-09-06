<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('jobs')) {
            return;
        }

        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employer_id')->constrained('employers', 'user_id')->cascadeOnDelete();
            $table->string('title');
            $table->string('department')->default('');
            $table->string('location')->default('');
            $table->string('job_type', 50)->default('fulltime');
            $table->string('salary_range')->default('');
            $table->text('description')->default('');
            $table->text('requirements')->default('');
            $table->text('skills')->nullable();
            $table->string('status', 30)->default('active');
            $table->timestamps();

            $table->index('employer_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
