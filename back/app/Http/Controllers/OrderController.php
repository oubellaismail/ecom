<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Country;
use App\Models\Discount;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\PaymentStatus;
use App\Models\ProductItem;
use App\Models\ShopOrder;
use App\Models\CheckoutSession;
use App\Services\Payments\PaymentServiceResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    protected $paymentResolver;

    public function __construct(PaymentServiceResolver $paymentResolver = null)
    {
        $this->paymentResolver = $paymentResolver ?? new PaymentServiceResolver();
    }

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
            'payment_method_code' => 'required|exists:payment_methods,code'
        ]);
        
        // Validate payment method
        $payMethod = PaymentMethod::where('code', $request->payment_method_code)->first();
        if (!$payMethod->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or inactive payment method!'
            ], 400);
        }
        
        // Process checkout data
        $checkoutData = $this->processCheckoutData($request);
        if (!$checkoutData['success']) {
            return response()->json($checkoutData, 400);
        }
        
        // Generate checkout ID and store session
        $checkoutId = uniqid('CO-');
        $checkoutSession = $this->storeCheckoutSession($checkoutId, $checkoutData['data']);
        
        Log::info('Checkout data stored in database:', [
            'checkout_id' => $checkoutId
        ]);
        
        // Special handling for COD
        if ($request->payment_method_code === 'cod') {
            return $this->processCODOrder($checkoutId, $payMethod->id, $checkoutData['data']);
        }
        
        // For other payment methods, initiate payment using service
        try {
            $paymentService = $this->paymentResolver->resolve($request->payment_method_code);
            $paymentResponse = $paymentService->initiate(
                $checkoutData['data']['total_amount'],
                "Payment for checkout {$checkoutId}"
            );
            
            if (!$paymentResponse['success']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to initiate payment',
                    'errors' => $paymentResponse['details'] ?? null
                ], 400);
            }

            Log::info('Payment response:', [
                'paymentResponse' => $paymentResponse
            ]);
            
            // Store temporary payment record
            $tempPayment = $this->storePayment(
                $payMethod->id,
                $paymentResponse['order_id'] ?? $paymentResponse['session_id'],
                $checkoutData['data']['total_amount'],
                $checkoutId
            );
            
            // Return response with approval URL
            $responseData = [
                'checkout_id' => $checkoutId,
                'payment_id' => $tempPayment->id,
                'message' => 'Payment initiated'
            ];
            
            // Add redirect URL if provided
            if (isset($paymentResponse['approval_url']) && $paymentResponse['approval_url']) {
                $responseData['redirect_url'] = $paymentResponse['approval_url'];
            }
            
            return response()->json([
                'success' => true,
                'data' => $responseData
            ]);
            
        } catch (\Exception $e) {
            Log::error('Payment initiation error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing payment: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Process checkout data from request
     */
    private function processCheckoutData(Request $request)
    {
        $amountBeforeDiscount = $request->amount_before_discount;
        $discountAmount = 0;
        $discountId = null;
        $finalAmount = $amountBeforeDiscount;
        
        // Process discount if provided
        if (!empty($request->discount_code)) {
            $discount = Discount::where('code', $request->discount_code)
                ->where('is_active', true)
                ->first();
            
            if (!$discount || $discount->usage_limit <= $discount->actual_usage) {
                return [
                    'success' => false,
                    'message' => 'Invalid, expired, or fully used discount code'
                ];
            }
            
            $discountAmount = ($discount->discount_percentage / 100) * $amountBeforeDiscount;
            $discountId = $discount->id;
            $finalAmount -= $discountAmount;
        }
        
        // Verify product items and calculate total
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
        
        // Validate total amount matches calculated amount
        if (abs($calculatedTotal - $amountBeforeDiscount) > 0.01) {
            return [
                'success' => false,
                'message' => 'Amount mismatch',
                'calculated' => $calculatedTotal,
                'provided' => $amountBeforeDiscount
            ];
        }
        
        // Format shipping address
        $shippingAddress = [
            'address_line1' => $request->shipping_address['address_line1'],
            'address_line2' => $request->shipping_address['address_line2'] ?? null,
            'city' => $request->shipping_address['city'],
            'region' => $request->shipping_address['region'],
            'postal_code' => $request->shipping_address['postal_code'],
            'phone_number' => $request->shipping_address['phone_number'],
            'country_code' => $request->shipping_address['country_code'],
        ];
        
        return [
            'success' => true,
            'data' => [
                'amount_before_discount' => $amountBeforeDiscount,
                'discount_amount' => $discountAmount,
                'discount_id' => $discountId,
                'total_amount' => $finalAmount,
                'order_lines' => $orderLines,
                'shipping_address' => $shippingAddress,
                'notes' => $request->notes,
                'created_at' => now()->timestamp
            ]
        ];
    }
    
    /**
     * Store checkout session
     */
    private function storeCheckoutSession(string $checkoutId, array $data)
    {
        return CheckoutSession::create([
            'checkout_id' => $checkoutId,
            'data' => json_encode($data),
            'expires_at' => now()->addHours(1)
        ]);
    }
    
    /**
     * Store payment record
     */
    private function storePayment(int $paymentMethodId, string $providerPaymentId, float $amount, string $checkoutId)
    {
        return Payment::create([
            'order_id' => null, // Will be updated after order creation
            'payment_method_id' => $paymentMethodId,
            'provider_payment_id' => $providerPaymentId,
            'amount' => $amount,
            'payments_status_id' => PaymentStatus::NOT_PAID,
            'details' => json_encode([
                'checkout_id' => $checkoutId
            ])
        ]);
    }
    
    /**
     * Handle payment callback from providers
     */
    public function handlePaymentCallback(Request $request)
    {
        try {
            // Different payment providers will provide different parameters
            $paymentId = $request->get('token') ?? $request->get('session_id') ?? $request->get('payment_id');

            if (!$paymentId) {
                Log::error('Payment callback: No payment identifier provided', ['data' => $request->all()]);
                return response()->json([
                    'success' => false,
                    'message' => 'No payment identifier provided'
                ], 400);
            }
            
            // Find the payment by provider_payment_id
            $payment = Payment::where('provider_payment_id', $paymentId)->first();
            
            if (!$payment) {
                Log::error('Payment callback: Payment not found', ['data' => $request->all()]);
                return response()->json([
                    'success' => false,
                    'message' => 'Payment record not found'
                ], 404);
            }
            
            // Get checkout details from payment
            $paymentDetails = json_decode($payment->details, true);
            $checkoutId = $paymentDetails['checkout_id'] ?? null;
            
            if (!$checkoutId) {
                Log::error('Payment callback: Checkout ID not found', ['payment_id' => $payment->id]);
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
            
            if (!$checkoutData) {
                Log::error('Payment callback: Checkout data expired or not found', ['checkout_id' => $checkoutId]);
                return response()->json([
                    'success' => false,
                    'message' => 'Checkout data expired or not found'
                ], 400);
            }
            
            // Get payment method
            $paymentMethod = PaymentMethod::find($payment->payment_method_id);
            
            // Only capture payments for non-COD methods
            $captureData = ['success' => true, 'transaction_id' => null, 'details' => []];
            
            if ($paymentMethod->code !== 'cod') {
                $paymentService = $this->paymentResolver->resolve($paymentMethod->code);
                $captureData = $paymentService->capture($payment->provider_payment_id);
                
                if (!$captureData['success']) {
                    Log::error('Payment callback: Payment capture failed', ['payment_id' => $payment->id]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Payment capture failed',
                        'errors' => $captureData['details'] ?? null
                    ], 400);
                }
            }
            
            // Get or create shipping address
            $address = $this->getOrCreateAddress($checkoutData['shipping_address']);
            
            // Create order in transaction
            return DB::transaction(function () use ($checkoutData, $payment, $captureData, $paymentDetails, $address, $paymentMethod) {
                $userId = auth()->id() ?? 1; // Default to 1 for guest or testing

                // Create the order
                $order = ShopOrder::create([
                    'user_id' => $userId,
                    'order_number' => uniqid('ORD-'),
                    'order_status_id' => OrderStatus::PENDING,
                    'amount_before_discount' => $checkoutData['amount_before_discount'],
                    'discount_id' => $checkoutData['discount_id'],
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
                if (!empty($checkoutData['discount_id'])) {
                    $this->applyDiscount($checkoutData['discount_id']);
                }
                
                // Create order status history
                OrderStatusHistory::create([
                    'order_id' => $order->id,
                    'changed_at' => now(),
                    'comment' => 'Order created' . ($paymentMethod->code === 'cod' ? ' with cash on delivery' : ' with payment completed')
                ]);
                
                // Update payment with order ID and transaction details
                // For COD, payment_status remains NOT_PAID
                $payment->update([
                    'order_id' => $order->id,
                    'payments_status_id' => $paymentMethod->code === 'cod' ? PaymentStatus::NOT_PAID : PaymentStatus::PAID,
                    'transaction_id' => $captureData['transaction_id'],
                    'paid_at' => $paymentMethod->code === 'cod' ? null : now(),
                    'details' => json_encode([
                        'checkout_id' => $paymentDetails['checkout_id'],
                        'payment_details' => $captureData['details']
                    ])
                ]);
                
                return redirect(config('app.frontend_url') . '/checkout/success?order_number=' . $order->order_number);
            });
        } catch (\Exception $e) {
            Log::error('Payment callback error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            
            return redirect(config('app.frontend_url') . '/checkout/failed?error=server_error');
        }
    }
    
    /**
     * Get or create address from checkout data
     */
    private function getOrCreateAddress(array $shippingAddress)
    {
        $country = Country::where('code', $shippingAddress['country_code'])->first();
        
        $address = Address::firstOrCreate(
            [
                'address_line1' => $shippingAddress['address_line1'],
                'city' => $shippingAddress['city'],
                'postal_code' => $shippingAddress['postal_code'],
                'phone_number' => $shippingAddress['phone_number'],
                'country_id' => $country->id,
            ],
            [
                'address_line2' => $shippingAddress['address_line2'] ?? null,
                'region' => $shippingAddress['region'],
            ]
        );
        
        return $address;
    }
    
    /**
     * Apply discount and update usage
     */
    private function applyDiscount(int $discountId)
    {
        $discount = Discount::find($discountId);
        if ($discount) {
            $discount->increment('actual_usage');
            if ($discount->actual_usage >= $discount->usage_limit) {
                $discount->update(['is_active' => false]);
            }
        }
    }
    
    /**
     * Handle COD specific order processing
     */
    public function processCODOrder(string $checkoutId, int $paymentMethodId, array $checkoutData)
    {
        Log::info('Processing COD order', ['checkout_id' => $checkoutId]);
        
        try {
            // Generate a unique provider payment ID for COD
            $providerPaymentId = uniqid('COD-');
            
            // Store a payment record
            $payment = $this->storePayment(
                $paymentMethodId,
                $providerPaymentId,
                $checkoutData['total_amount'],
                $checkoutId
            );
            
            // Get or create address
            $address = $this->getOrCreateAddress($checkoutData['shipping_address']);
            
            // Create order directly for COD
            return DB::transaction(function () use ($checkoutData, $payment, $checkoutId, $address) {
                $userId = auth()->id() ?? 1; // Default to 1 for guest or testing
                
                // Create the order
                $order = ShopOrder::create([
                    'user_id' => $userId,
                    'order_number' => uniqid('ORD-'),
                    'order_status_id' => OrderStatus::PENDING,
                    'amount_before_discount' => $checkoutData['amount_before_discount'],
                    'discount_id' => $checkoutData['discount_id'],
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
                if (!empty($checkoutData['discount_id'])) {
                    $this->applyDiscount($checkoutData['discount_id']);
                }
                
                // Create order status history
                OrderStatusHistory::create([
                    'order_id' => $order->id,
                    'changed_at' => now(),
                    'comment' => 'Order created with cash on delivery'
                ]);
                
                // Update payment with order ID
                $payment->update([
                    'order_id' => $order->id,
                    'payments_status_id' => PaymentStatus::NOT_PAID,
                    'details' => json_encode([
                        'checkout_id' => $checkoutId
                    ])
                ]);
                
                return response()->json([
                    'success' => true,
                    'data' => [
                        'order_number' => $order->order_number,
                        'redirect_url' => config('app.frontend_url') . '/checkout/success?order_number=' . $order->order_number
                    ],
                    'message' => 'COD order processed successfully'
                ]);
            });
            
        } catch (\Exception $e) {
            Log::error('COD processing error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing COD order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update order status (admin only)
     */
    public function updateStatus(Request $request)
    {
        $validated = $request->validate([
            'order_status_code' => 'required|exists:order_statuses,code',
            'order_number' => 'required|exists:shop_orders,order_number',
        ]);

        $order_status_code = $validated['order_status_code'];
        $order_number = $validated['order_number'];

        $order_status_id = OrderStatus::where('code', $order_status_code)->first()->id;

        // Eager load the `orderStatus` relationship properly
        $order = ShopOrder::with(['user', 'orderStatus', 'order_lines'])
            ->where('order_number', $order_number)
            ->firstOrFail();

        $order->update(['order_status_id' => $order_status_id]);

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'changed_at' => now(),
            'comment' => "Updated the order status into $order_status_code.",
        ]);

        // Reload the order with its updated relationship
        $order->load('orderStatus');

        return response()->json([
            'success' => true,
            'data' => [],
            'message' => 'Order status updated', 
        ]);
    }

    /**
     * Update payment status (for marking COD as paid on delivery)
     */
    public function updatePaymentStatus(Request $request)
    {
        $validated = $request->validate([
            'order_number' => 'required|exists:shop_orders,order_number',
            'is_paid' => 'required|boolean'
        ]);

        $order = ShopOrder::where('order_number', $validated['order_number'])->firstOrFail();
        $payment = Payment::where('order_id', $order->id)->firstOrFail();

        // Only update status if it's COD or related payment methods
        $paymentMethod = PaymentMethod::find($payment->payment_method_id);
        if ($paymentMethod->code === 'cod') {
            $newStatus = $validated['is_paid'] ? PaymentStatus::PAID : PaymentStatus::NOT_PAID;
            
            $payment->update([
                'payments_status_id' => $newStatus,
                'paid_at' => $validated['is_paid'] ? now() : null
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment status updated'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Cannot update payment status for non-COD payment methods'
        ], 400);
    }

    public function getMyOrders(Request $request)
    {
        try {
            // Get authenticated user
            $user = auth()->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }
            
            // Build the query with safe relationship loading
            $orders = ShopOrder::where('user_id', $user->id)
                ->with([
                    'orderStatus:id,status,code',
                    'orderLines:id,order_id,product_item_id,qty,subtotal',
                    'orderLines.productItem:id,product_id,price',
                    'orderLines.productItem.product:id,name',
                    'address:id,address_line1,city,region,postal_code,country_id',
                ])
                ->orderBy('ordered_at', 'desc')
                ->get();
            
            // Transform the data to ensure consistent response format
            $transformedOrders = $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'ordered_at' => $order->ordered_at,
                    'total_amount' => $order->total_amount,
                    'order_status' => $order->orderStatus ? [
                        'id' => $order->orderStatus->id,
                        'status' => $order->orderStatus->status,
                        'code' => $order->orderStatus->code
                    ] : null,
                    'address' => $order->address ? [
                        'address_line1' => $order->address->address_line1,
                        'city' => $order->address->city,
                        'region' => $order->address->region,
                        'postal_code' => $order->address->postal_code
                    ] : null,
                    'order_lines' => $order->orderLines->map(function ($line) {
                        return [
                            'id' => $line->id,
                            'qty' => $line->qty,
                            'subtotal' => $line->subtotal,
                            'product' => $line->productItem && $line->productItem->product ? [
                                'id' => $line->productItem->product->id,
                                'name' => $line->productItem->product->name
                            ] : null
                        ];
                    })
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => $transformedOrders
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching user orders: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error fetching orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all orders for the orders page
     */
    public function index(Request $request)
    {
        try {
            // Get authenticated user
            $user = auth()->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }
            
            // Build the query with safe relationship loading
            $orders = ShopOrder::where('user_id', $user->id)
                ->with([
                    'orderStatus:id,status,code',
                    'orderLines:id,order_id,product_item_id,qty,subtotal',
                    'orderLines.productItem:id,product_id,price',
                    'orderLines.productItem.product:id,name',
                    'address:id,address_line1,city,region,postal_code,country_id',
                    'user:id,first_name,last_name',
                ])
                ->orderBy('ordered_at', 'desc')
                ->get();
            
            // Transform the data to ensure consistent response format
            $transformedOrders = $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'ordered_at' => $order->ordered_at,
                    'total_amount' => $order->total_amount,
                    'order_status' => $order->orderStatus ? [
                        'id' => $order->orderStatus->id,
                        'status' => $order->orderStatus->status,
                        'code' => $order->orderStatus->code
                    ] : null,
                    'address' => $order->address ? [
                        'address_line1' => $order->address->address_line1,
                        'city' => $order->address->city,
                        'region' => $order->address->region,
                        'postal_code' => $order->address->postal_code
                    ] : null,
                    'user' => $order->user ? [
                        'id' => $order->user->id,
                        'first_name' => $order->user->first_name,
                        'last_name' => $order->user->last_name
                    ] : null,
                    'order_lines' => $order->orderLines->map(function ($line) {
                        return [
                            'id' => $line->id,
                            'qty' => $line->qty,
                            'subtotal' => $line->subtotal,
                            'product' => $line->productItem && $line->productItem->product ? [
                                'id' => $line->productItem->product->id,
                                'name' => $line->productItem->product->name
                            ] : null
                        ];
                    })
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => $transformedOrders
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching orders: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error fetching orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}