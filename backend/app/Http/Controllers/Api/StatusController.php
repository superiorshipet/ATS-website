<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class StatusController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['message' => 'ATS Laravel backend is running']);
    }

    public function test(): JsonResponse
    {
        return response()->json(['message' => 'API is working!']);
    }
}
