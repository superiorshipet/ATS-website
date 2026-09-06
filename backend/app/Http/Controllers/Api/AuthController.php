<?php

namespace App\Http\Controllers\Api;

use App\DTO\Auth\LoginData;
use App\DTO\Auth\RegisterData;
use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $auth)
    {
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = $this->auth->login(new LoginData($data['email'], $data['password']));
        if (!$user) {
            return response()->json(['success' => false, 'error' => 'Invalid credentials'], 401);
        }

        return response()->json(['success' => true, 'message' => 'Login successful', 'data' => $user]);
    }

    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'phone' => ['nullable', 'string', 'max:50'],
            'user_type' => ['nullable', Rule::in(['graduate', 'employer'])],
        ]);

        $user = $this->auth->register(RegisterData::fromRequest($request));

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'user_id' => $user->id,
        ]);
    }
}
