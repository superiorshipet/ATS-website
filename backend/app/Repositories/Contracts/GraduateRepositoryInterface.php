<?php

namespace App\Repositories\Contracts;

use App\Models\Graduate;
use Illuminate\Support\Collection;

interface GraduateRepositoryInterface
{
    public function create(array $data): Graduate;

    public function findByUserId(int $userId): ?Graduate;

    public function updateByUserId(int $userId, array $data): bool;

    public function allWithUsers(): Collection;
}
