<?php

namespace App\Http\Controllers\Api;

use App\DTO\Applications\CreateApplicationData;
use App\DTO\Applications\UpdateApplicationStatusData;
use App\Http\Controllers\Controller;
use App\Services\ApplicationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function __construct(private readonly ApplicationService $applications)
    {
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'job_id' => ['required', 'integer', 'exists:jobs,id'],
            'graduate_id' => ['nullable', 'integer', 'exists:graduates,user_id'],
            'user_id' => ['nullable', 'integer', 'exists:graduates,user_id'],
        ]);

        $result = $this->applications->apply(CreateApplicationData::fromRequest($request));

        return response()->json($result, $result['success'] ? 200 : 400);
    }

    public function byGraduate(Request $request): JsonResponse
    {
        $graduateId = (int) $request->query('graduate_id', $request->query('user_id', 1));

        return response()->json(['success' => true, 'data' => $this->applications->byGraduate($graduateId)]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'in:pending,reviewing,accepted,rejected'],
            'score' => ['nullable', 'integer'],
        ]);

        $result = $this->applications->updateStatus($id, UpdateApplicationStatusData::fromRequest($request));

        return response()->json(['success' => $result, 'message' => 'Application status updated']);
    }

    public function byJob(int $jobId): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $this->applications->byJob($jobId)]);
    }

    public function byEmployer(Request $request): JsonResponse
    {
        if (!$request->filled('employer_id')) {
            return response()->json(['success' => false, 'error' => 'employer_id required'], 400);
        }

        return response()->json(['success' => true, 'data' => $this->applications->byEmployer((int) $request->query('employer_id'))]);
    }
}
