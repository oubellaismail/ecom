<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\StatusController;
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

    //paypal

    // Payment initiation (no order created yet)
    Route::post('payments/initiate', [OrderController::class, 'initiatePayment']);
    
    // Order management (for existing orders)
    Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus']);

    Route::apiResource('statuses', StatusController::class);
});

//paypal

Route::prefix('api/paypal')->group(function () {
    Route::post('create', [PaypalController::class, 'createPayment']);
    Route::post('capture', [PaypalController::class, 'capturePayment']);
    Route::get('check-status', [PaypalController::class, 'checkPaymentStatus']);
});

Route::prefix('payments')->group(function () {
    Route::get('success', [OrderController::class, 'handlePaymentCallback'])->name('payment.success');
    Route::get('cancel', [OrderController::class, 'handlePayPalCancel'])->name('payment.cancel');

    Route::get('stripe/success', [OrderController::class, 'handlePaymentCallback'])->name('stripe.success');
    Route::get('stripe/cancel', function() {
        return redirect()->to('/payment/failed'); // Redirect to your frontend cancel page
    })->name('stripe.cancel');

    // COD specific processing
    Route::post('/payment/cod/process', [OrderController::class, 'processCODOrder']);
});


