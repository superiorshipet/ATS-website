<?php

use Illuminate\Support\Facades\Route;

Route::get('/test', fn () => response()->json(['message' => 'API is working!']));
Route::get('/', fn () => response()->json(['message' => 'ATS Laravel backend is running']));
