<?php

namespace App\Repositories\Eloquent;

use App\Models\Job;
use App\Repositories\Contracts\JobRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class JobRepository implements JobRepositoryInterface
{
    public function active(): Collection
    {
        return $this->baseQuery()
            ->where('j.status', 'active')
            ->orderByDesc('j.created_at')
            ->get();
    }

    public function byEmployer(int $employerId): Collection
    {
        return $this->baseQuery()
            ->where('j.employer_id', $employerId)
            ->orderByDesc('j.created_at')
            ->get();
    }

    public function allForAdmin(): Collection
    {
        return $this->baseQuery()
            ->orderByDesc('j.created_at')
            ->get();
    }

    public function findWithCompany(int $id): ?object
    {
        return $this->baseQuery()->where('j.id', $id)->first();
    }

    public function create(array $data): Job
    {
        return Job::query()->create($data);
    }

    public function update(int $id, array $data): bool
    {
        return Job::query()->whereKey($id)->update($data) > 0;
    }

    public function delete(int $id): bool
    {
        return Job::query()->whereKey($id)->delete() > 0;
    }

    private function baseQuery()
    {
        return DB::table('jobs as j')
            ->join('employers as e', 'j.employer_id', '=', 'e.user_id')
            ->join('users as u', 'e.user_id', '=', 'u.id')
            ->select('j.*', 'u.full_name as company_name');
    }
}
