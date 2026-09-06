<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('password_hash');
            $table->string('phone', 50)->default('');
            $table->string('user_type', 20)->default('graduate');
            $table->text('avatar_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('user_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
