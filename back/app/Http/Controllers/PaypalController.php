<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Srmklive\PayPal\Services\PayPal as PayPalClient;

class PaypalController extends Controller
{
    /**
     * Create a PayPal payment order
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
        
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $paypalToken = $provider->getAccessToken();
        
        $response = $provider->createOrder([
            "intent" => "CAPTURE",
            "application_context" => [
                "return_url" => route('paypal.success'),
                "cancel_url" => route('paypal.cancel'),
            ],
            "purchase_units" => [
                [
                    "amount" => [
                        "currency_code" => "USD",
                        "value" => $request->amount
                    ],
                    "description" => $request->description
                ]
            ]
        ]);
        
        if (isset($response['id']) && $response['id'] != null) {
            // For PayPal checkout, return the approval URL and order ID
            $approvalUrl = null;
            foreach ($response['links'] as $link) {
                if ($link['rel'] === 'approve') {
                    $approvalUrl = $link['href'];
                    break;
                }
            }
            
            return response()->json([
                'success' => true,
                'order_id' => $response['id'],
                'approval_url' => $approvalUrl
            ]);
        }
        
        return response()->json([
            'success' => false,
            'error' => 'Failed to create PayPal order',
            'details' => $response
        ], 400);
    }
    
    /**
     * Capture a payment after approval
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function capturePayment(Request $request): JsonResponse
    {
        $request->validate([
            'order_id' => 'required|string'
        ]);
        
        $orderId = $request->order_id;
        
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $paypalToken = $provider->getAccessToken();
        
        // Capture the order
        $response = $provider->capturePaymentOrder($orderId);
        
        if (isset($response['status']) && $response['status'] == 'COMPLETED') {
            // Payment successful
            $captureId = $response['purchase_units'][0]['payments']['captures'][0]['id'];
            
            return response()->json([
                'success' => true,
                'transaction_id' => $captureId,
                'status' => $response['status'],
                'details' => $response
            ]);
        }
        
        return response()->json([
            'success' => false,
            'error' => 'Payment capture failed',
            'details' => $response
        ], 400);
    }
    
    /**
     * Process the success callback from PayPal
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function paymentSuccess(Request $request): JsonResponse
    {
        // PayPal sends token and PayerID
        if (!$request->has('token')) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid callback from PayPal'
            ], 400);
        }
        
        return response()->json([
            'success' => true,
            'token' => $request->token,
            'payer_id' => $request->PayerID ?? null
        ]);
    }
    
    /**
     * Process the cancellation callback from PayPal
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
     * Check the status of a payment
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function checkPaymentStatus(Request $request): JsonResponse
    {
        $request->validate([
            'order_id' => 'required|string'
        ]);
        
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $paypalToken = $provider->getAccessToken();
        
        $response = $provider->showOrderDetails($request->order_id);
        
        if (isset($response['status'])) {
            return response()->json([
                'success' => true,
                'status' => $response['status'],
                'details' => $response
            ]);
        }
        
        return response()->json([
            'success' => false,
            'error' => 'Failed to retrieve payment status',
            'details' => $response
        ], 400);
    }
}