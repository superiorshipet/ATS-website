<?php

namespace App\Repositories\Eloquent;

use App\Models\Employer;
use App\Repositories\Contracts\EmployerRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class EmployerRepository implements EmployerRepositoryInterface
{
    public function create(array $data): Employer
    {
        return Employer::query()->create($data);
    }

    public function findByUserId(int $userId): ?Employer
    {
        return Employer::query()->where('user_id', $userId)->first();
    }

    public function updateByUserId(int $userId, array $data): bool
    {
        return Employer::query()->where('user_id', $userId)->update($data) > 0;
    }

    public function allWithUsers(): Collection
    {
        return DB::table('users as u')
            ->join('employers as e', 'u.id', '=', 'e.user_id')
            ->select('u.id', 'u.full_name', 'u.email', 'u.phone', 'u.is_active', 'u.created_at', 'e.company_name', 'e.sector', 'e.employee_count', 'e.is_verified')
            ->orderByDesc('u.created_at')
            ->get();
    }
}
