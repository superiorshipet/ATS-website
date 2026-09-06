<?php

namespace App\Http\Controllers\Api;

use App\DTO\Jobs\CreateJobData;
use App\Http\Controllers\Controller;
use App\Services\JobService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function __construct(private readonly JobService $jobs)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $employerId = $request->filled('employer_id') ? (int) $request->query('employer_id') : null;

        return response()->json(['success' => true, 'data' => $this->jobs->list($employerId)]);
    }

    public function show(int $id): JsonResponse
    {
        $job = $this->jobs->find($id);
        if (!$job) {
            return response()->json(['success' => false, 'error' => 'Job not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $job]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'employer_id' => ['required', 'integer', 'exists:employers,user_id'],
            'title' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
        ]);

        $jobId = $this->jobs->create(CreateJobData::fromRequest($request));

        return response()->json(['success' => true, 'message' => 'Job created successfully', 'job_id' => $jobId]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $existing = $this->jobs->find($id);
        if (!$existing) {
            return response()->json(['success' => false, 'error' => 'Job not found'], 404);
        }

        $request->merge([
            'employer_id' => $existing->employer_id,
            'title' => $request->input('title', $existing->title),
            'department' => $request->input('department', $existing->department),
            'location' => $request->input('location', $existing->location),
            'job_type' => $request->input('job_type', $existing->job_type),
            'salary_range' => $request->input('salary_range', $existing->salary_range),
            'description' => $request->input('description', $existing->description),
            'requirements' => $request->input('requirements', $existing->requirements),
            'skills' => $request->input('skills', $existing->skills),
            'status' => $request->input('status', $existing->status),
        ]);

        $result = $this->jobs->update($id, CreateJobData::fromRequest($request));

        return response()->json(['success' => $result, 'message' => $result ? 'Job updated successfully' : 'Update failed']);
    }

    public function destroy(int $id): JsonResponse
    {
        $result = $this->jobs->delete($id);

        return response()->json(['success' => $result, 'message' => $result ? 'Job deleted successfully' : 'Delete failed']);
    }
}
