<?php

namespace App\DTO\Admin;

use Illuminate\Http\Request;

class CreateAdminData
{
    public function __construct(
        public readonly string $fullName,
        public readonly string $email,
        public readonly string $password,
        public readonly string $phone,
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            fullName: (string) $request->input('full_name'),
            email: (string) $request->input('email'),
            password: (string) $request->input('password'),
            phone: (string) $request->input('phone', ''),
        );
    }
}
