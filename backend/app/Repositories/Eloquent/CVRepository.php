<?php

namespace App\Repositories\Eloquent;

use App\Models\Education;
use App\Models\WorkExperience;
use App\Repositories\Contracts\CVRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CVRepository implements CVRepositoryInterface
{
    public function findCv(int $graduateId): ?object
    {
        return DB::table('users as u')
            ->join('graduates as g', 'u.id', '=', 'g.user_id')
            ->select('u.id', 'u.full_name', 'u.email', 'u.phone', 'g.location', 'g.bio', 'g.skills', 'g.cv_url', 'g.graduation_year', 'g.major', 'g.gpa')
            ->where('u.id', $graduateId)
            ->first();
    }

    public function workExperiences(int $graduateId): Collection
    {
        return DB::table('work_experiences')
            ->select('id', 'title', 'company', 'duration', 'description')
            ->where('graduate_id', $graduateId)
            ->orderByDesc('id')
            ->get();
    }

    public function educations(int $graduateId): Collection
    {
        return DB::table('educations')
            ->select('id', 'degree', 'institution', 'year')
            ->where('graduate_id', $graduateId)
            ->orderByDesc('id')
            ->get();
    }

    public function replaceWorkExperiences(int $graduateId, array $experiences): void
    {
        WorkExperience::query()->where('graduate_id', $graduateId)->delete();

        foreach ($experiences as $experience) {
            WorkExperience::query()->create([
                'graduate_id' => $graduateId,
                'title' => $experience['title'] ?? '',
                'company' => $experience['company'] ?? '',
                'duration' => $experience['duration'] ?? '',
                'description' => $experience['description'] ?? '',
            ]);
        }
    }

    public function replaceEducations(int $graduateId, array $educations): void
    {
        Education::query()->where('graduate_id', $graduateId)->delete();

        foreach ($educations as $education) {
            Education::query()->create([
                'graduate_id' => $graduateId,
                'degree' => $education['degree'] ?? '',
                'institution' => $education['institution'] ?? '',
                'year' => $education['year'] ?? '',
            ]);
        }
    }
}
