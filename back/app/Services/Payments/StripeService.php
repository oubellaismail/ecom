<?php

namespace App\Services\Payments;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\StripeController;

class StripeService implements PaymentServiceInterface
{
    public function initiate(float $amount, string $description): array
    {

        $stripe = new StripeController();
        $request = new Request(['amount' => $amount, 'description' => $description]);

        $response = $stripe->createPayment($request);
        return json_decode($response->getContent(), true);
    }

    public function capture(string $orderId): array
    {
        try {
            \Stripe\Stripe::setApiKey(config('stripe.sk_key'));
            
            // Retrieve the session
            $session = \Stripe\Checkout\Session::retrieve($orderId);
            $paymentIntentId = $session->payment_intent;
            
            // Retrieve the payment intent
            $paymentIntent = \Stripe\PaymentIntent::retrieve($paymentIntentId);
            
            // Check if payment is successful
            if ($paymentIntent->status === 'succeeded') {
                return [
                    'success' => true,
                    'transaction_id' => $paymentIntentId, // Use payment intent ID as transaction ID
                    'details' => [
                        'payment_method' => $paymentIntent->payment_method,
                        'amount' => $paymentIntent->amount / 100, // Convert from cents
                        'currency' => $paymentIntent->currency,
                        'status' => $paymentIntent->status
                    ]
                ];
            } else {
                Log::error('Payment capture failed: Payment not succeeded', [
                    'status' => $paymentIntent->status,
                    'session_id' => $orderId
                ]);
                
                return [
                    'success' => false,
                    'details' => [
                        'status' => $paymentIntent->status,
                        'message' => 'Payment intent status is not succeeded'
                    ]
                ];
            }
        } catch (\Exception $e) {
            Log::error('Stripe capture error: ' . $e->getMessage(), [
                'session_id' => $orderId, 
                'exception' => $e
            ]);
            
            return [
                'success' => false,
                'details' => [
                    'message' => $e->getMessage()
                ]
            ];
        }
    }
}
