<?php

namespace App\Repositories\Contracts;

use App\Models\Job;
use Illuminate\Support\Collection;

interface JobRepositoryInterface
{
    public function active(): Collection;

    public function byEmployer(int $employerId): Collection;

    public function allForAdmin(): Collection;

    public function findWithCompany(int $id): ?object;

    public function create(array $data): Job;

    public function update(int $id, array $data): bool;

    public function delete(int $id): bool;
}
