<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DiscountController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/test', function(Request $req) {
    return response()->json([
        'token' => "helo",
        'user' => "user"
    ]);
});

Route::post('/login', [AuthController::class, 'login'])->name("login");
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('products', ProductController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('discounts', DiscountController::class)->except(["update", "destroy"]);
    Route::apiResource('addresses', AddressController::class)->except(["index", "destroy"]);
    Route::get('countries', [CountryController::class, 'index']);
    Route::post('orders', [OrderController::class, 'place_order']);
});

