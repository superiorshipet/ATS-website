<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CVController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::get('/jobs', [JobController::class, 'index']);
Route::post('/jobs', [JobController::class, 'store']);
Route::get('/jobs/{id}', [JobController::class, 'show'])->whereNumber('id');
Route::put('/jobs/{id}', [JobController::class, 'update'])->whereNumber('id');
Route::delete('/jobs/{id}', [JobController::class, 'destroy'])->whereNumber('id');

Route::get('/profile', [ProfileController::class, 'show']);
Route::put('/profile', [ProfileController::class, 'update']);
Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);

Route::get('/cv', [CVController::class, 'show']);
Route::post('/cv', [CVController::class, 'save']);
Route::post('/cv/upload', [CVController::class, 'upload']);

Route::post('/applications', [ApplicationController::class, 'store']);
Route::get('/applications', [ApplicationController::class, 'byGraduate']);
Route::put('/applications/{id}/status', [ApplicationController::class, 'updateStatus'])->whereNumber('id');
Route::get('/applications/job/{id}', [ApplicationController::class, 'byJob'])->whereNumber('id');
Route::get('/applications/employer', [ApplicationController::class, 'byEmployer']);

Route::get('/admin/stats', [AdminController::class, 'stats']);
Route::get('/admin/users', [AdminController::class, 'users']);
Route::get('/admin/jobs', [AdminController::class, 'jobs']);
Route::get('/admin/companies', [AdminController::class, 'companies']);
Route::get('/admin/graduates', [AdminController::class, 'graduates']);
Route::post('/admin/create', [AdminController::class, 'create']);
Route::put('/admin/users/{id}/status', [AdminController::class, 'updateUserStatus'])->whereNumber('id');
Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser'])->whereNumber('id');
Route::put('/admin/jobs/{id}', [AdminController::class, 'updateJob'])->whereNumber('id');
Route::delete('/admin/jobs/{id}', [AdminController::class, 'deleteJob'])->whereNumber('id');

Route::post('/chatbot', [ChatbotController::class, 'handle']);
Route::get('/chatbot/history', [ChatbotController::class, 'history']);
