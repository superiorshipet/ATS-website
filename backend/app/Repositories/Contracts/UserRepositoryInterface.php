<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Support\Collection;

interface UserRepositoryInterface
{
    public function findByEmail(string $email): ?User;

    public function find(int $id): ?User;

    public function create(array $data): User;

    public function update(int $id, array $data): bool;

    public function all(): Collection;

    public function delete(int $id): bool;

    public function hasAdmin(): bool;
}
