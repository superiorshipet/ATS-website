<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        if (User::query()->where('user_type', 'admin')->exists()) {
            return;
        }

        User::query()->create([
            'full_name' => env('ADMIN_NAME', 'Admin'),
            'email' => env('ADMIN_EMAIL', 'admin@example.com'),
            'password_hash' => Hash::make(env('ADMIN_PASSWORD', 'admin123456')),
            'phone' => env('ADMIN_PHONE', ''),
            'user_type' => 'admin',
            'is_active' => true,
        ]);
    }
}
