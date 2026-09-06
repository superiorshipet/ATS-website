<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Collection;

class UserRepository implements UserRepositoryInterface
{
    public function findByEmail(string $email): ?User
    {
        return User::query()->where('email', $email)->first();
    }

    public function find(int $id): ?User
    {
        return User::query()->find($id);
    }

    public function create(array $data): User
    {
        return User::query()->create($data);
    }

    public function update(int $id, array $data): bool
    {
        return User::query()->whereKey($id)->update($data) > 0;
    }

    public function all(): Collection
    {
        return User::query()
            ->select('id', 'full_name', 'email', 'phone', 'user_type', 'is_active', 'created_at')
            ->orderByDesc('created_at')
            ->get();
    }

    public function delete(int $id): bool
    {
        return User::query()->whereKey($id)->delete() > 0;
    }

    public function hasAdmin(): bool
    {
        return User::query()->where('user_type', 'admin')->exists();
    }
}
