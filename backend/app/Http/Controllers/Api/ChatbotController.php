<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ChatbotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    public function __construct(private readonly ChatbotService $chatbot)
    {
    }

    public function handle(Request $request): JsonResponse
    {
        $message = (string) $request->input('message', '');
        $userId = $request->filled('user_id') ? (int) $request->input('user_id') : null;

        return response()->json([
            'success' => true,
            'response' => $this->chatbot->reply($userId, $message),
        ]);
    }

    public function history(Request $request): JsonResponse
    {
        if (!$request->filled('user_id')) {
            return response()->json(['success' => false, 'error' => 'user_id is required'], 400);
        }

        return response()->json(['success' => true, 'data' => $this->chatbot->history((int) $request->query('user_id'))]);
    }
}
