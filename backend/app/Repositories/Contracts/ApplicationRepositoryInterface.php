<?php

namespace App\Repositories\Contracts;

use App\Models\Application;
use Illuminate\Support\Collection;

interface ApplicationRepositoryInterface
{
    public function existsForJobAndGraduate(int $jobId, int $graduateId): bool;

    public function create(array $data): Application;

    public function byGraduate(int $graduateId): Collection;

    public function byJob(int $jobId): Collection;

    public function byEmployer(int $employerId): Collection;

    public function updateStatus(int $id, string $status, ?int $score): bool;
}
