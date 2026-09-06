<?php

namespace App\Repositories\Eloquent;

use App\Models\Graduate;
use App\Repositories\Contracts\GraduateRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class GraduateRepository implements GraduateRepositoryInterface
{
    public function create(array $data): Graduate
    {
        return Graduate::query()->create($data);
    }

    public function findByUserId(int $userId): ?Graduate
    {
        return Graduate::query()->where('user_id', $userId)->first();
    }

    public function updateByUserId(int $userId, array $data): bool
    {
        return Graduate::query()->where('user_id', $userId)->update($data) > 0;
    }

    public function allWithUsers(): Collection
    {
        return DB::table('users as u')
            ->join('graduates as g', 'u.id', '=', 'g.user_id')
            ->select('u.id', 'u.full_name', 'u.email', 'u.phone', 'u.is_active', 'u.created_at', 'g.location', 'g.major', 'g.graduation_year', 'g.gpa', 'g.skills')
            ->orderByDesc('u.created_at')
            ->get();
    }
}
