<?php

namespace App\Services;

use App\DTO\Admin\CreateAdminData;
use App\Repositories\Contracts\EmployerRepositoryInterface;
use App\Repositories\Contracts\GraduateRepositoryInterface;
use App\Repositories\Contracts\JobRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminService
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
        private readonly GraduateRepositoryInterface $graduates,
        private readonly EmployerRepositoryInterface $employers,
        private readonly JobRepositoryInterface $jobs,
    ) {
    }

    public function stats(): array
    {
        return [
            'total_graduates' => DB::table('graduates')->count(),
            'total_employers' => DB::table('employers')->count(),
            'active_jobs' => DB::table('jobs')->where('status', 'active')->count(),
            'total_jobs' => DB::table('jobs')->count(),
            'total_applications' => DB::table('applications')->count(),
            'total_users' => DB::table('users')->count(),
        ];
    }

    public function createAdmin(CreateAdminData $data): int
    {
        $user = $this->users->create([
            'full_name' => $data->fullName,
            'email' => $data->email,
            'password_hash' => Hash::make($data->password),
            'phone' => $data->phone,
            'user_type' => 'admin',
            'is_active' => true,
        ]);

        return $user->id;
    }

    public function users()
    {
        return $this->users->all();
    }

    public function jobs()
    {
        return $this->jobs->allForAdmin();
    }

    public function companies()
    {
        return $this->employers->allWithUsers();
    }

    public function graduates()
    {
        return $this->graduates->allWithUsers();
    }
}
