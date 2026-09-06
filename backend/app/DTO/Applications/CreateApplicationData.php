<?php

namespace App\DTO\Applications;

use Illuminate\Http\Request;

class CreateApplicationData
{
    public function __construct(
        public readonly int $jobId,
        public readonly int $graduateId,
        public readonly string $coverLetter,
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            jobId: (int) $request->input('job_id'),
            graduateId: (int) $request->input('graduate_id', $request->input('user_id')),
            coverLetter: (string) $request->input('cover_letter', ''),
        );
    }
}
