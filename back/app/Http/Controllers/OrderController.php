<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Discount;
use App\Models\ShopOrder;
use App\Models\OrderStatus;
use App\Models\ProductItem;
use Illuminate\Http\Request;
use App\Models\OrderStatusHistory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Orders\PlaceOrderRequest;

class OrderController extends Controller
{
    public function place_order(PlaceOrderRequest $request)
    {
        $discountAmount = 0;

        // Validate discount code if provided
        if (!empty($request['discount_code'])) {
            $discount = Discount::where('code', $request['discount_code'])->first();
            if ($discount && $discount->is_active && $discount->usage_limit > $discount->actual_usage) {
                $discountAmount = ($discount->discount_percentage / 100) * $request['total_amount'];
                $discount->increment('actual_usage');  // Increase the actual usage
                if ($discount->actual_usage >= $discount->usage_limit) {
                    $discount->update(['is_active' => false]); // Deactivate when the limit is reached
                }
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid, expired, or fully used discount code'
                ], 400);
            }
        }

        return DB::transaction(function () use ($request, $discountAmount) {
            // Fetch the user
            $user = Auth::user();

            // Create the order
            $order = ShopOrder::create([
                'user_id' => $user->id,
                'order_status_id' => OrderStatus::PENDING, 
                'order_number' => uniqid('ORD-'),
                'discount_amount' => $discountAmount,
                'total_amount' => $request['total_amount'] - $discountAmount,
                'notes' => $request['notes'] ?? null,
                'ordered_at' => now()
            ]);

            // Process order lines
            foreach ($request['order_lines'] as $line) {
                $productItem = ProductItem::find($line['product_item_id']);
                $order->orderLines()->create([
                    'product_item_id' => $line['product_item_id'],
                    'qty' => $line['qty'],
                    'subtotal' => $line['qty'] * $productItem->price
                ]);
            }

            // Create order status history
            OrderStatusHistory::create([
                'order_id' => $order->id,
                'order_status_id' => OrderStatus::PENDING,
                'changed_at' => now(),
                'comment' => 'Order placed'
            ]);

            return response()->json([
                'success' => true,
                'data' => $order->only('order_number'),
                'message' => 'Order placed successfully'
            ], 201);
        });
    }


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
