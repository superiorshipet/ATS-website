<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface ChatMessageRepositoryInterface
{
    public function create(array $data): void;

    public function recentForUser(int $userId, int $limit = 50): Collection;
}
