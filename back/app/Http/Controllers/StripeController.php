<?php

namespace App\Http\Controllers;

use Stripe\Stripe;
use Stripe\PaymentIntent;
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\ApiErrorException;

class StripeController extends Controller
{

    /**
     * Create a Stripe Checkout Session
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function createPayment(Request $request): JsonResponse
    {


        $request->validate([
            'amount' => 'required|numeric|min:1',
            'description' => 'required|string'
        ]);

        Stripe::setApiKey(config('stripe.sk_key'));

        try {

            Log::info('Check session:', [
                'request' => 'Im here'
            ]);

            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => config('stripe.currency', 'usd'),
                        'product_data' => [
                            'name' => $request->description,
                        ],
                        'unit_amount' => (int)($request->amount * 100),
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => route('stripe.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('stripe.cancel'),
            ]);

            return response()->json([
                'success' => true,
                'order_id' => $session->id,
                'approval_url' => $session->url,
            ]);
        } catch (ApiErrorException $e) {
            Log::error('Stripe error: ' . $e->getMessage(), ['exception' => $e]);

            return response()->json([
                'success' => false,
                'error' => 'Stripe API error',
                'message' => $e->getMessage(),
                'details' => $e->getError()
            ], 400);
        }
    }

    /**
     * Capture payment success callback
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function paymentSuccess(Request $request): JsonResponse
    {
        // Log::info('Check session:', [
        //     'request' => 'Im here'
        // ]);

        if (!$request->has('session_id')) {
            return response()->json([
                'success' => false,
                'error' => 'Missing session ID'
            ], 400);
        }

        try {
            $session = Session::retrieve($request->session_id);
            $paymentIntentId = $session->payment_intent;

            Log::info("Error Message " ,[
                'session' => $session
            ]);

            return response()->json([
                'success' => true,
                'session_id' => $session->id,
                'payment_intent_id' => $paymentIntentId
            ]);
        } catch (ApiErrorException $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Handle payment cancellation
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function paymentCancel(Request $request): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error' => 'Payment was cancelled by user'
        ]);
    }

    /**
     * Check payment status
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function checkPaymentStatus(Request $request): JsonResponse
    {
        $request->validate([
            'payment_intent_id' => 'required|string'
        ]);

        try {
            $intent = PaymentIntent::retrieve($request->payment_intent_id);

            return response()->json([
                'success' => true,
                'status' => $intent->status,
                'details' => $intent
            ]);
        } catch (ApiErrorException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Unable to retrieve payment intent',
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
