<?php

namespace App\Services;

use App\DTO\CV\SaveCvData;
use App\Repositories\Contracts\CVRepositoryInterface;
use App\Repositories\Contracts\GraduateRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class CVService
{
    public function __construct(
        private readonly CVRepositoryInterface $cv,
        private readonly GraduateRepositoryInterface $graduates,
    ) {
    }

    public function get(int $graduateId): ?array
    {
        $cv = $this->cv->findCv($graduateId);
        if (!$cv) {
            return null;
        }

        $data = (array) $cv;
        $data['experiences'] = $this->cv->workExperiences($graduateId);
        $data['education'] = $this->cv->educations($graduateId);

        return $data;
    }

    public function save(SaveCvData $data): void
    {
        DB::transaction(function () use ($data) {
            $attributes = $data->attributes;

            $this->graduates->updateByUserId($data->graduateId, [
                'location' => $attributes['location'] ?? null,
                'bio' => $attributes['bio'] ?? null,
                'skills' => $attributes['skills'] ?? null,
                'major' => $attributes['major'] ?? null,
                'graduation_year' => isset($attributes['graduation_year']) ? (int) $attributes['graduation_year'] : null,
                'gpa' => isset($attributes['gpa']) ? (float) $attributes['gpa'] : null,
            ]);

            if (isset($attributes['experiences']) && is_array($attributes['experiences'])) {
                $this->cv->replaceWorkExperiences($data->graduateId, $attributes['experiences']);
            }

            if (isset($attributes['education']) && is_array($attributes['education'])) {
                $this->cv->replaceEducations($data->graduateId, $attributes['education']);
            }
        });
    }

    public function uploadResume(int $graduateId, UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $filename = 'resume_' . $graduateId . '_' . time() . '.' . $extension;
        $path = public_path('uploads/resumes');

        if (!is_dir($path)) {
            mkdir($path, 0775, true);
        }

        $file->move($path, $filename);
        $url = '/uploads/resumes/' . $filename;

        $this->graduates->updateByUserId($graduateId, ['cv_url' => $url]);

        return $url;
    }
}
