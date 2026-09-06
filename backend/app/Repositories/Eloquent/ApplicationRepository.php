<?php

namespace App\Repositories\Eloquent;

use App\Models\Application;
use App\Repositories\Contracts\ApplicationRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ApplicationRepository implements ApplicationRepositoryInterface
{
    public function existsForJobAndGraduate(int $jobId, int $graduateId): bool
    {
        return Application::query()
            ->where('job_id', $jobId)
            ->where('graduate_id', $graduateId)
            ->exists();
    }

    public function create(array $data): Application
    {
        return Application::query()->create($data);
    }

    public function byGraduate(int $graduateId): Collection
    {
        return DB::table('applications as a')
            ->join('jobs as j', 'a.job_id', '=', 'j.id')
            ->join('employers as e', 'j.employer_id', '=', 'e.user_id')
            ->join('users as u', 'e.user_id', '=', 'u.id')
            ->select('a.*', 'j.title', 'j.location', 'j.job_type', 'j.salary_range', 'u.full_name as company_name')
            ->where('a.graduate_id', $graduateId)
            ->orderByDesc('a.applied_at')
            ->get();
    }

    public function byJob(int $jobId): Collection
    {
        return DB::table('applications as a')
            ->join('graduates as g', 'a.graduate_id', '=', 'g.user_id')
            ->join('users as u', 'g.user_id', '=', 'u.id')
            ->select('a.*', 'u.full_name', 'u.email', 'u.phone', 'g.skills', 'g.cv_url')
            ->where('a.job_id', $jobId)
            ->orderByDesc('a.applied_at')
            ->get();
    }

    public function byEmployer(int $employerId): Collection
    {
        return DB::table('applications as a')
            ->join('jobs as j', 'a.job_id', '=', 'j.id')
            ->join('graduates as g', 'a.graduate_id', '=', 'g.user_id')
            ->join('users as u', 'g.user_id', '=', 'u.id')
            ->select('a.*', 'j.title', 'j.location', 'j.job_type', 'u.full_name as graduate_name', 'a.score')
            ->where('j.employer_id', $employerId)
            ->orderByDesc('a.applied_at')
            ->get();
    }

    public function updateStatus(int $id, string $status, ?int $score): bool
    {
        return Application::query()->whereKey($id)->update([
            'status' => $status,
            'score' => $score,
            'updated_at' => now(),
        ]) > 0;
    }
}
