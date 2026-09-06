<?php

namespace App\Services;

use App\DTO\Jobs\CreateJobData;
use App\Repositories\Contracts\JobRepositoryInterface;

class JobService
{
    public function __construct(private readonly JobRepositoryInterface $jobs)
    {
    }

    public function list(?int $employerId)
    {
        return $employerId ? $this->jobs->byEmployer($employerId) : $this->jobs->active();
    }

    public function find(int $id): ?object
    {
        return $this->jobs->findWithCompany($id);
    }

    public function create(CreateJobData $data): int
    {
        $job = $this->jobs->create($this->payload($data));
        return $job->id;
    }

    public function update(int $id, CreateJobData $data): bool
    {
        return $this->jobs->update($id, $this->payload($data));
    }

    public function delete(int $id): bool
    {
        return $this->jobs->delete($id);
    }

    private function payload(CreateJobData $data): array
    {
        return [
            'employer_id' => $data->employerId,
            'title' => $data->title,
            'department' => $data->department,
            'location' => $data->location,
            'job_type' => $data->jobType,
            'salary_range' => $data->salaryRange,
            'description' => $data->description,
            'requirements' => $data->requirements,
            'skills' => $data->skills,
            'status' => $data->status,
        ];
    }
}
