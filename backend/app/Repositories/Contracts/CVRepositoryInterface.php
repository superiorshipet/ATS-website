<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface CVRepositoryInterface
{
    public function findCv(int $graduateId): ?object;

    public function workExperiences(int $graduateId): Collection;

    public function educations(int $graduateId): Collection;

    public function replaceWorkExperiences(int $graduateId, array $experiences): void;

    public function replaceEducations(int $graduateId, array $educations): void;
}
