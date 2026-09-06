<?php

namespace App\Services;

use App\DTO\Auth\LoginData;
use App\DTO\Auth\RegisterData;
use App\Models\User;
use App\Repositories\Contracts\EmployerRepositoryInterface;
use App\Repositories\Contracts\GraduateRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
        private readonly GraduateRepositoryInterface $graduates,
        private readonly EmployerRepositoryInterface $employers,
    ) {
    }

    public function login(LoginData $data): ?array
    {
        $user = $this->users->findByEmail($data->email);
        if (!$user || !$user->is_active || !Hash::check($data->password, $user->password_hash)) {
            return null;
        }

        return $this->authPayload($user);
    }

    public function register(RegisterData $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = $this->users->create([
                'full_name' => $data->fullName,
                'email' => $data->email,
                'password_hash' => Hash::make($data->password),
                'phone' => $data->phone,
                'user_type' => $data->userType,
                'is_active' => true,
            ]);

            if ($data->userType === 'employer') {
                $this->employers->create([
                    'user_id' => $user->id,
                    'company_name' => $data->fullName,
                ]);
            } else {
                $this->graduates->create([
                    'user_id' => $user->id,
                ]);
            }

            return $user;
        });
    }

    private function authPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->full_name,
            'email' => $user->email,
            'user_type' => $user->user_type,
            'token' => bin2hex(random_bytes(32)),
        ];
    }
}
