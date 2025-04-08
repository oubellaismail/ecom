<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Country;
use App\Models\Payment;
use App\Models\Discount;
use App\Models\ShopOrder;
use App\Models\OrderStatus;
use App\Models\ProductItem;
use Illuminate\Http\Request;
use App\Models\PaymentMethod;
use App\Models\PaymentStatus;
use App\Models\CheckoutSession;
use Illuminate\Validation\Rule;
use App\Models\OrderStatusHistory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\PaypalController;
use App\Http\Requests\Orders\PlaceOrderRequest;

class OrderController extends Controller
{
    /**
     * Initialize a payment without creating an order
     */
    public function initiatePayment(Request $request)
    {
        $request->validate([
            'amount_before_discount' => 'required|numeric|min:1',
            'total_amount' => 'required|numeric|min:1',
            'order_lines' => 'required|array',
            'order_lines.*.product_item_id' => 'required|exists:product_items,id',
            'order_lines.*.qty' => 'required|integer|min:1',
            'discount_code' => [
                'nullable',
                Rule::exists('discounts', 'code')->where('is_active', true)
            ],
            'notes' => 'nullable|string',
            'shipping_address' => 'required|array',
            'shipping_address.address_line1' => 'required|string|max:255',
            'shipping_address.address_line2' => 'nullable|string|max:255',
            'shipping_address.city' => 'required|string|max:100',
            'shipping_address.region' => 'required|string|max:100',
            'shipping_address.postal_code' => 'required|string|max:20',
            'shipping_address.phone_number' => 'required|string|max:15',
            'shipping_address.country_code' => 'required|exists:countries,code',
            'payment_method_code' => 'nullable|exists:payment_methods,code'
        ]);
        
        $pay_method = PaymentMethod::where('code', $request->payment_method_code)->first();
        if ($pay_method && !$pay_method->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid payment method!'
            ], 400);
        }
        
        $amountBeforeDiscount = $request->amount_before_discount;
        $discountAmount = 0;
        $discountId = null;
        $finalAmount = $amountBeforeDiscount;
        
        // Process discount if provided
        if (!empty($request->discount_code)) {
            $discount = Discount::where('code', $request->discount_code)->first();
        
            if (!$discount || !$discount->is_active || $discount->usage_limit <= $discount->actual_usage) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid, expired, or fully used discount code'
                ], 400);
            }
        
            $discountAmount = ($discount->discount_percentage / 100) * $amountBeforeDiscount;
            $discountId = $discount->id;
            $finalAmount -= $discountAmount;
        }
        
        // Verify product items and calculate total to confirm frontend calculation
        $calculatedTotal = 0;
        $orderLines = [];
        
        foreach ($request->order_lines as $line) {
            $productItem = ProductItem::find($line['product_item_id']);
            $subtotal = $line['qty'] * $productItem->price;
            $calculatedTotal += $subtotal;
        
            $orderLines[] = [
                'product_item_id' => $line['product_item_id'],
                'qty' => $line['qty'],
                'subtotal' => $subtotal
            ];
        }
        
        $shippingAddress = [
            'address_line1' => $request->shipping_address['address_line1'],
            'address_line2' => $request->shipping_address['address_line2'],
            'city' => $request->shipping_address['city'],
            'region' => $request->shipping_address['region'],
            'postal_code' => $request->shipping_address['postal_code'],
            'phone_number' => $request->shipping_address['phone_number'],
            'country_code' => $request->shipping_address['country_code'],
        ];
        
        // Validate total amount matches calculated amount
        if (abs($calculatedTotal - $amountBeforeDiscount) > 0.01) {
            return response()->json([
                'success' => false,
                'message' => 'Amount mismatch',
                'calculated' => $calculatedTotal,
                'provided' => $amountBeforeDiscount
            ], 400);
        }
        
        // Generate a unique checkout ID
        $checkoutId = uniqid('CO-');
        
        $checkoutSession = CheckoutSession::create([
            'checkout_id' => $checkoutId,
            'data' => json_encode([
                'amount_before_discount' => $amountBeforeDiscount,
                'discount_amount' => $discountAmount,
                'discount_id' => $discountId,
                'total_amount' => $finalAmount,
                'order_lines' => $orderLines,
                'shipping_address' => $shippingAddress,
                'notes' => $request->notes,
                'created_at' => now()->timestamp
            ]),
            'expires_at' => now()->addHours(1)
        ]);        
    
        Log::info('Checkout data stored in database:', [
            'checkout_id' => $checkoutId
        ]);
        
        // Initiate PayPal payment
        $paypalController = new PaypalController();
        $paymentRequest = new Request([
            'amount' => $finalAmount,
            'description' => "Payment for checkout {$checkoutId}"
        ]);
        
        $response = $paypalController->createPayment($paymentRequest);
        $paymentData = json_decode($response->getContent(), true);

        // return response()->json($paymentData);
        
        if (!$paymentData['success']) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to initiate payment',
                'errors' => $paymentData['details'] ?? null
            ], 400);
        }
        
        // Store temporary payment record
        $tempPayment = Payment::create([
            'order_id' => null, // Will be updated after order creation
            'payment_method_id' =>  PaymentMethod::where('code', $request->payment_method_code)->first()->id,
            'provider_payment_id' => $paymentData['order_id'],
            'amount' => $finalAmount,
            'payments_status_id' => PaymentStatus::NOT_PAID, 
            'details' => json_encode([
                'checkout_id' => $checkoutId
            ])
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'checkout_id' => $checkoutId,
                'payment_id' => $tempPayment->id,
                'redirect_url' => $paymentData['approval_url']
            ],
            'message' => 'Payment initiated'
        ]);
    }
    
    /**
     * Handle PayPal payment success and create order
     */
    public function handlePayPalCallback(Request $request)
    {
        try {
            // Find the payment by provider_payment_id
            $payment = Payment::where('provider_payment_id', $request->get('token', ''))->first();
            
            if (!$payment) {
                Log::error('PayPal callback: Payment not found', ['data' => $request->all()]);
                return response()->json([
                    'success' => false,
                    'message' => 'Payment record not found'
                ], 404);
            }
            
            // Get checkout details from payment
            $paymentDetails = json_decode($payment->details, true);
            $checkoutId = $paymentDetails['checkout_id'] ?? null;
            
            if (!$checkoutId) {
                Log::error('PayPal callback: Checkout ID not found', ['payment_id' => $payment->id]);
                return response()->json([
                    'success' => false,
                    'message' => 'Checkout information not found'
                ], 400);
            }
            
            // Get checkout data from session
            $checkoutSession = CheckoutSession::where('checkout_id', $checkoutId)
                ->where('expires_at', '>', now())
                ->first();
                
            $checkoutData = $checkoutSession ? json_decode($checkoutSession->data, true) : null;
            
            Log::info('Database checkout data retrieved:', [
                'checkout_id' => $checkoutId,
                'checkout_data' => $checkoutData
            ]);

            if (!$checkoutData) {
                Log::error('PayPal callback: Checkout data not found', ['checkout_id' => $checkoutId]);
                return response()->json([
                    'success' => false,
                    'message' => 'Checkout data expired or not found'
                ], 400);
            }
            
            // Capture the payment
            $paypalController = new PaypalController();
            $captureRequest = new Request(['order_id' => $payment->provider_payment_id]);
            $captureResponse = $paypalController->capturePayment($captureRequest);
            $captureData = json_decode($captureResponse->getContent(), true);
            
            if (!$captureData['success']) {
                Log::error('PayPal callback: Payment capture failed', ['payment_id' => $payment->id]);
                return response()->json([
                    'success' => false,
                    'message' => 'Payment capture failed',
                    'errors' => $captureData['details'] ?? null
                ], 400);
            }          

            $shipping_add = $checkoutData['shipping_address'];

            $country = Country::where('code', $shipping_add['country_code'])->first();

            Log::info('Country retreive check :', [
                'country' => $country,
            ]);

            $existingAddress = Address::where([
                ['address_line1', '=', $shipping_add['address_line1']],
                ['address_line2', '=', $shipping_add['address_line2'] ?? ''],
                ['city', '=', $shipping_add['city']],
                ['region', '=', $shipping_add['region']],
                ['postal_code', '=', $shipping_add['postal_code']],
                ['phone_number', '=', $shipping_add['phone_number']],
                ['country_id', '=', $country->id],
            ])->first();

    
            // Step 2: Create a new address if not found
            if (!$existingAddress) {
                $address = Address::create([
                    'address_line1' => $shipping_add['address_line1'],
                    'address_line2' => $shipping_add['address_line2'],
                    'city' => $shipping_add['city'],
                    'region' => $shipping_add['region'],
                    'postal_code' => $shipping_add['postal_code'],
                    'phone_number' => $shipping_add['phone_number'],
                    'country_id' => $country->id,
                ]);
                $address = Address::create($checkoutData['shipping_address']);
            } else {
                $address = $existingAddress;
            }
            
            // Create order only after successful payment
            return DB::transaction(function () use ($checkoutData, $payment, $captureData, $paymentDetails, $address) {
                // Fetch the user
                //! $user = Auth::user();
                
                // Create the order with PAID status directly
                $order = ShopOrder::create([
                    'user_id' => 1,
                    'order_number' => uniqid('ORD-'),
                    'amount_before_discount' => $checkoutData['amount_before_discount'],
                    'discount_amount' => $checkoutData['discount_amount'],
                    'total_amount' => $checkoutData['total_amount'],
                    'address_id' => $address->id,
                    'notes' => $checkoutData['notes'] ?? null,
                    'ordered_at' => now()
                ]);
                
                // Process order lines
                foreach ($checkoutData['order_lines'] as $line) {
                    $order->orderLines()->create([
                        'product_item_id' => $line['product_item_id'],
                        'qty' => $line['qty'],
                        'subtotal' => $line['subtotal']
                    ]);
                }
                
                // Apply discount if used
                if ($checkoutData['discount_id']) {
                    $discount = Discount::find($checkoutData['discount_id']);
                    if ($discount) {
                        $discount->increment('actual_usage');
                        if ($discount->actual_usage >= $discount->usage_limit) {
                            $discount->update(['is_active' => false]);
                        }
                    }
                }
                
                // Create order status history
                OrderStatusHistory::create([
                    'order_id' => $order->id,
                    'order_status_id' => OrderStatus::PENDING,
                    'changed_at' => now(),
                    'comment' => 'Order created with payment completed'
                ]);
                
                // Update payment with order ID and transaction details
                $payment->update([
                    'order_id' => $order->id,
                    'payments_status_id' => PaymentStatus::PAID,
                    'transaction_id' => $captureData['transaction_id'],
                    'paid_at' => now(),
                    'details' => json_encode([
                        'checkout_id' => $paymentDetails['checkout_id'],
                        'paypal_details' => $captureData['details']
                    ])
                ]);
                
                // Clear checkout session data
                
                return response()->json([
                    'success' => true,
                    'data' => [
                        'order_id' => $order->id,
                        'order_number' => $order->order_number
                    ],
                    'message' => 'Payment completed and order created successfully'
                ]);
            });
        } catch (\Exception $e) {
            Log::error('PayPal callback error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing payment'
            ], 500);
        }
    }
    
    /**
     * Handle PayPal payment cancellation
     */
    public function handlePayPalCancel(Request $request)
    {
        try {
            // Find payment by PayPal order ID
            $payment = Payment::where('provider_payment_id', $request->get('order_id', ''))->first();
            
            if ($payment) {
                $payment->update([
                    'status' => 'cancelled',
                    'details' => json_encode([
                        'checkout_id' => json_decode($payment->details, true)['checkout_id'] ?? null,
                        'cancelled_at' => now()->toIso8601String()
                    ])
                ]);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Payment was cancelled'
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Payment record not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('PayPal cancel error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing cancellation'
            ], 500);
        }
    }

    /**
     * Update order status (admin only)
     */
    public function updateStatus(Request $request, ShopOrder $order)
    {
        $validated = $request->validate([
            'order_status_id' => 'required|exists:order_statuses,id',
            'comment' => 'nullable|string'
        ]);

        $order->update(['order_status_id' => $validated['order_status_id']]);

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'order_status_id' => $validated['order_status_id'],
            'changed_at' => now(),
            'comment' => $validated['comment'] ?? null
        ]);

        return response()->json(['message' => 'Order status updated', 'order' => $order]);
    }
}