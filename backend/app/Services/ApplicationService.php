<?php

namespace App\Services;

use App\DTO\Applications\CreateApplicationData;
use App\DTO\Applications\UpdateApplicationStatusData;
use App\Repositories\Contracts\ApplicationRepositoryInterface;

class ApplicationService
{
    public function __construct(private readonly ApplicationRepositoryInterface $applications)
    {
    }

    public function apply(CreateApplicationData $data): array
    {
        if ($this->applications->existsForJobAndGraduate($data->jobId, $data->graduateId)) {
            return ['success' => false, 'error' => 'You have already applied for this job'];
        }

        $this->applications->create([
            'job_id' => $data->jobId,
            'graduate_id' => $data->graduateId,
            'cover_letter' => $data->coverLetter,
            'status' => 'pending',
        ]);

        return ['success' => true, 'message' => 'Application submitted successfully'];
    }

    public function byGraduate(int $graduateId)
    {
        return $this->withArabicStatuses($this->applications->byGraduate($graduateId));
    }

    public function byJob(int $jobId)
    {
        return $this->applications->byJob($jobId);
    }

    public function byEmployer(int $employerId)
    {
        return $this->applications->byEmployer($employerId);
    }

    public function updateStatus(int $id, UpdateApplicationStatusData $data): bool
    {
        return $this->applications->updateStatus($id, $data->status, $data->score);
    }

    private function withArabicStatuses($applications)
    {
        $labels = [
            'pending' => 'قيد المراجعة',
            'reviewing' => 'جاري المراجعة',
            'accepted' => 'مقبول',
            'rejected' => 'مرفوض',
        ];

        return $applications->map(function ($application) use ($labels) {
            $application->status_ar = $labels[$application->status] ?? $application->status;
            return $application;
        });
    }
}
