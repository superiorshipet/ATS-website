<?php

namespace App\Repositories\Eloquent;

use App\Models\ChatMessage;
use App\Repositories\Contracts\ChatMessageRepositoryInterface;
use Illuminate\Support\Collection;

class ChatMessageRepository implements ChatMessageRepositoryInterface
{
    public function create(array $data): void
    {
        ChatMessage::query()->create($data);
    }

    public function recentForUser(int $userId, int $limit = 50): Collection
    {
        return ChatMessage::query()
            ->select('id', 'message', 'response', 'created_at')
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->reverse()
            ->values();
    }
}
