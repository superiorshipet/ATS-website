<?php

use App\Http\Controllers\Api\StatusController;
use Illuminate\Support\Facades\Route;

Route::get('/', [StatusController::class, 'index']);
Route::get('/test', [StatusController::class, 'test']);
