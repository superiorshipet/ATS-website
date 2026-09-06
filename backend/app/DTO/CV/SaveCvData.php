<?php

namespace App\DTO\CV;

use Illuminate\Http\Request;

class SaveCvData
{
    public function __construct(
        public readonly int $graduateId,
        public readonly array $attributes,
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            graduateId: (int) $request->input('graduate_id', $request->input('user_id', 1)),
            attributes: $request->all(),
        );
    }
}
