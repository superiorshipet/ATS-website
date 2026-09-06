<?php

namespace App\Http\Controllers\Api;

use App\DTO\Admin\CreateAdminData;
use App\DTO\Jobs\CreateJobData;
use App\Http\Controllers\Controller;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\AdminService;
use App\Services\JobService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function __construct(
        private readonly AdminService $admin,
        private readonly JobService $jobs,
        private readonly UserRepositoryInterface $users,
    ) {
    }

    public function stats(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $this->admin->stats()]);
    }

    public function users(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $this->admin->users()]);
    }

    public function jobs(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $this->admin->jobs()]);
    }

    public function companies(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $this->admin->companies()]);
    }

    public function graduates(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $this->admin->graduates()]);
    }

    public function create(Request $request): JsonResponse
    {
        $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'phone' => ['nullable', 'string', 'max:50'],
        ]);

        $userId = $this->admin->createAdmin(CreateAdminData::fromRequest($request));

        return response()->json(['success' => true, 'message' => 'Admin created successfully', 'user_id' => $userId]);
    }

    public function updateUserStatus(Request $request, int $id): JsonResponse
    {
        $request->validate(['is_active' => ['required', 'boolean']]);

        $result = $this->users->update($id, ['is_active' => (bool) $request->boolean('is_active')]);

        return response()->json(['success' => $result]);
    }

    public function deleteUser(int $id): JsonResponse
    {
        return response()->json(['success' => $this->users->delete($id)]);
    }

    public function updateJob(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['active', 'draft', 'closed'])],
        ]);

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

        return response()->json(['success' => $result, 'message' => $result ? 'Job updated' : 'Update failed']);
    }

    public function deleteJob(int $id): JsonResponse
    {
        return response()->json(['success' => $this->jobs->delete($id)]);
    }
}
