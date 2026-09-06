<?php

namespace App\Http\Controllers\Api;

use App\DTO\Profile\UpdateProfileData;
use App\Http\Controllers\Controller;
use App\Services\ProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(private readonly ProfileService $profiles)
    {
    }

    public function show(Request $request): JsonResponse
    {
        $userId = (int) $request->query('user_id', $request->query('id', 1));
        $userType = (string) $request->query('user_type', 'graduate');
        $profile = $this->profiles->get($userId, $userType);

        if (!$profile) {
            return response()->json(['success' => false, 'error' => 'User not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $profile]);
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'full_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
        ]);

        $this->profiles->update(UpdateProfileData::fromRequest($request));

        return response()->json(['success' => true, 'message' => 'Profile updated successfully']);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'avatar' => ['required', 'file', 'mimes:jpg,jpeg,png,gif,webp', 'max:5120'],
        ]);

        $url = $this->profiles->uploadAvatar((int) $request->input('user_id'), $request->file('avatar'));

        return response()->json(['success' => true, 'avatar_url' => $url]);
    }
}
