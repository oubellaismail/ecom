<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/test', function(Request $req) {
    return response()->json([
        'token' => "helo",
        'user' => "user"
    ]);
    Route::apiResource('products', ProductController::class);
    
    // Logout route
    Route::post('/logout', 'App\Http\Controllers\API\AuthController@logout');
});

Route::post('/login', 'App\Http\Controllers\API\AuthController@login');
Route::post('/register', 'App\Http\Controllers\API\AuthController@register');