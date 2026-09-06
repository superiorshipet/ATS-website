<?php

namespace App\Repositories\Contracts;

use App\Models\Employer;
use Illuminate\Support\Collection;

interface EmployerRepositoryInterface
{
    public function create(array $data): Employer;

    public function findByUserId(int $userId): ?Employer;

    public function updateByUserId(int $userId, array $data): bool;

    public function allWithUsers(): Collection;
}
