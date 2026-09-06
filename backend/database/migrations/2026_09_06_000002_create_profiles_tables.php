<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('graduates', function (Blueprint $table) {
            $table->foreignId('user_id')->primary()->constrained('users')->cascadeOnDelete();
            $table->string('location')->nullable();
            $table->text('bio')->nullable();
            $table->text('skills')->nullable();
            $table->text('cv_url')->nullable();
            $table->integer('graduation_year')->nullable();
            $table->string('major')->nullable();
            $table->decimal('gpa', 4, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('employers', function (Blueprint $table) {
            $table->foreignId('user_id')->primary()->constrained('users')->cascadeOnDelete();
            $table->string('company_name');
            $table->string('sector')->nullable();
            $table->string('employee_count', 100)->nullable();
            $table->text('website')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employers');
        Schema::dropIfExists('graduates');
    }
};
