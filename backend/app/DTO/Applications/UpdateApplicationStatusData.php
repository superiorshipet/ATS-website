<?php

namespace App\DTO\Applications;

use Illuminate\Http\Request;

class UpdateApplicationStatusData
{
    public function __construct(
        public readonly string $status,
        public readonly ?int $score,
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            status: (string) $request->input('status'),
            score: $request->filled('score') ? (int) $request->input('score') : null,
        );
    }
}
