<?php

namespace App\Services;

use App\DTO\Profile\UpdateProfileData;
use App\Repositories\Contracts\EmployerRepositoryInterface;
use App\Repositories\Contracts\GraduateRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Http\UploadedFile;

class ProfileService
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
        private readonly GraduateRepositoryInterface $graduates,
        private readonly EmployerRepositoryInterface $employers,
    ) {
    }

    public function get(int $userId, string $userType): ?array
    {
        $user = $this->users->find($userId);
        if (!$user) {
            return null;
        }

        $data = [
            'id' => $user->id,
            'full_name' => $user->full_name,
            'email' => $user->email,
            'phone' => $user->phone ?? '',
            'user_type' => $user->user_type,
            'avatar_url' => $user->avatar_url,
            'joined_date' => $user->created_at?->format('F Y'),
        ];

        if ($userType === 'employer') {
            $employer = $this->employers->findByUserId($userId);
            if ($employer) {
                $data += $employer->only(['company_name', 'sector', 'employee_count', 'website', 'is_verified']);
            }
        } else {
            $graduate = $this->graduates->findByUserId($userId);
            if ($graduate) {
                $data += $graduate->only(['location', 'bio', 'skills', 'graduation_year', 'major', 'gpa']);
            }
        }

        return $data;
    }

    public function update(UpdateProfileData $data): void
    {
        $this->users->update($data->userId, [
            'full_name' => $data->fullName,
            'phone' => $data->phone,
        ]);

        if ($data->userType === 'employer') {
            $this->employers->updateByUserId($data->userId, [
                'company_name' => $data->attributes['company_name'] ?? $data->fullName,
                'sector' => $data->attributes['sector'] ?? null,
                'employee_count' => $data->attributes['employee_count'] ?? null,
                'website' => $data->attributes['website'] ?? null,
            ]);
            return;
        }

        $this->graduates->updateByUserId($data->userId, [
            'location' => $data->attributes['location'] ?? null,
            'bio' => $data->attributes['bio'] ?? null,
            'skills' => $data->attributes['skills'] ?? null,
            'major' => $data->attributes['major'] ?? null,
            'graduation_year' => isset($data->attributes['graduation_year']) ? (int) $data->attributes['graduation_year'] : null,
            'gpa' => isset($data->attributes['gpa']) ? (float) $data->attributes['gpa'] : null,
        ]);
    }

    public function uploadAvatar(int $userId, UploadedFile $file): string
    {
        $url = $this->storePublicUpload($file, 'avatars', 'avatar_' . $userId);
        $this->users->update($userId, ['avatar_url' => $url]);

        return $url;
    }

    private function storePublicUpload(UploadedFile $file, string $folder, string $prefix): string
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $filename = $prefix . '_' . time() . '.' . $extension;
        $path = public_path("uploads/$folder");

        if (!is_dir($path)) {
            mkdir($path, 0775, true);
        }

        $file->move($path, $filename);

        return "/uploads/$folder/$filename";
    }
}
