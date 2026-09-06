<?php

namespace App\DTO\Profile;

use Illuminate\Http\Request;

class UpdateProfileData
{
    public function __construct(
        public readonly int $userId,
        public readonly string $userType,
        public readonly string $fullName,
        public readonly string $phone,
        public readonly array $attributes,
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            userId: (int) $request->input('user_id', 1),
            userType: (string) $request->input('user_type', 'graduate'),
            fullName: (string) $request->input('full_name'),
            phone: (string) $request->input('phone', ''),
            attributes: $request->all(),
        );
    }
}
