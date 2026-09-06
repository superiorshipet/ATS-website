<?php

namespace App\Http\Controllers\Api;

use App\DTO\CV\SaveCvData;
use App\Http\Controllers\Controller;
use App\Services\CVService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CVController extends Controller
{
    public function __construct(private readonly CVService $cv)
    {
    }

    public function show(Request $request): JsonResponse
    {
        $graduateId = (int) $request->query('graduate_id', $request->query('user_id', 1));

        return response()->json(['success' => true, 'data' => $this->cv->get($graduateId)]);
    }

    public function save(Request $request): JsonResponse
    {
        $request->validate([
            'graduate_id' => ['nullable', 'integer', 'exists:graduates,user_id'],
            'user_id' => ['nullable', 'integer', 'exists:graduates,user_id'],
        ]);

        $this->cv->save(SaveCvData::fromRequest($request));

        return response()->json(['success' => true, 'message' => 'CV saved successfully']);
    }

    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'graduate_id' => ['nullable', 'integer', 'exists:graduates,user_id'],
            'user_id' => ['nullable', 'integer', 'exists:graduates,user_id'],
            'cv_file' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ]);

        $graduateId = (int) $request->input('graduate_id', $request->input('user_id', 1));
        $url = $this->cv->uploadResume($graduateId, $request->file('cv_file'));

        return response()->json(['success' => true, 'cv_url' => $url]);
    }
}
