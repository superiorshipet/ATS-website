<?php

namespace App\DTO\Jobs;

use Illuminate\Http\Request;

class CreateJobData
{
    public function __construct(
        public readonly int $employerId,
        public readonly string $title,
        public readonly string $department,
        public readonly string $location,
        public readonly string $jobType,
        public readonly string $salaryRange,
        public readonly string $description,
        public readonly string $requirements,
        public readonly ?string $skills,
        public readonly string $status,
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            employerId: (int) $request->input('employer_id'),
            title: (string) $request->input('title'),
            department: (string) $request->input('department', ''),
            location: (string) $request->input('location', ''),
            jobType: (string) $request->input('job_type', 'fulltime'),
            salaryRange: (string) $request->input('salary_range', ''),
            description: (string) $request->input('description', ''),
            requirements: (string) $request->input('requirements', ''),
            skills: self::normalizeSkills($request->input('skills')),
            status: (string) $request->input('status', 'active'),
        );
    }

    protected static function normalizeSkills(mixed $skills): ?string
    {
        if (is_array($skills)) {
            return implode(',', array_filter(array_map('trim', $skills)));
        }

        if (is_string($skills) && trim($skills) !== '') {
            return trim($skills);
        }

        return null;
    }
}
