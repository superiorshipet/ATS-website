<?php

namespace App\Services;

use App\Repositories\Contracts\ChatMessageRepositoryInterface;
use Illuminate\Support\Facades\DB;

class ChatbotService
{
    public function __construct(private readonly ChatMessageRepositoryInterface $messages)
    {
    }

    public function reply(?int $userId, string $message): string
    {
        $stats = [
            'graduates' => DB::table('graduates')->count(),
            'jobs' => DB::table('jobs')->where('status', 'active')->count(),
            'applications' => DB::table('applications')->count(),
        ];

        $reply = "أهلاً بك في منصة توظيف. لدينا حالياً {$stats['jobs']} وظيفة نشطة و{$stats['graduates']} خريج مسجل.";

        if ($userId) {
            $this->messages->create([
                'user_id' => $userId,
                'message' => $message,
                'response' => $reply,
            ]);
        }

        return $reply;
    }

    public function history(int $userId)
    {
        return $this->messages->recentForUser($userId);
    }
}
