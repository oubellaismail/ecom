<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\ShopOrder;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use App\Models\OrderStatus;
use App\Models\ProductItem;

class StatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // 1. Total Sales (Total revenue from payments)
        $totalSales = Payment::where('status', 'completed')
            ->sum('amount');
        // 2. Total Orders (Count of all orders)
        $totalOrders = ShopOrder::count();

        // 3. Total Products (Count of all products)
        $totalProducts = Product::count();

        // 4. Total Customers (Count users with the "customer" role, assuming role_id 2 for customers)
        $totalCustomers = User::where('role_id', 2)->count();

        // 5. Total Orders with Pending Status
        $pendingStatusId = OrderStatus::where('status', 'Pending')->first()->id; // Assuming you have "pending" status
        $totalPendingOrders = ShopOrder::where('order_status_id', $pendingStatusId)->count();

        // 6. Total Products with Qty in Stock Less than 10
        $totalLowStockProducts = ProductItem::where('qty_in_stock', '<', 10)->count();

        // 7. Sales Overview for the Previous 6 Months (Monthly sales totals)
        $sixMonthsAgo = Carbon::now()->subMonths(6);
        $salesOverview = Payment::where('status', 'completed')
            ->where('paid_at', '>=', $sixMonthsAgo)
            ->selectRaw('SUM(amount) as total, EXTRACT(MONTH FROM paid_at) as month, EXTRACT(YEAR FROM paid_at) as year')
            ->groupByRaw('EXTRACT(YEAR FROM paid_at), EXTRACT(MONTH FROM paid_at)')
            ->orderByRaw('EXTRACT(YEAR FROM paid_at) DESC, EXTRACT(MONTH FROM paid_at) DESC')
            ->get();


        // 8. Monthly Average and Total Revenue for the Last 6 Months
        $monthlyAverage = $salesOverview->avg('total');
        $totalRevenueLast6Months = $salesOverview->sum('total');

        // 9. 10 Recent Orders
        $recentOrders = ShopOrder::with('user', 'orderStatus')
            ->orderBy('ordered_at', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_sales' => (float)$totalSales,
                'total_orders' => (int)$totalOrders,
                'total_products' => (int)$totalProducts,
                'total_customers' => (int)$totalCustomers,
                'total_pending_orders' => (int)$totalPendingOrders,
                'total_low_stock_products' => (int)$totalLowStockProducts,
                'sales_overview' => $salesOverview->map(function ($item) {
                    return [
                        'total' => (float)$item->total,
                        'month' => (int)$item->month,
                        'year' => (int)$item->year
                    ];
                }),
                'monthly_average_revenue' => (float)$monthlyAverage,
                'total_revenue_last_6_months' => (float)$totalRevenueLast6Months,
                'recent_orders' => $recentOrders->map(function ($recentOrder) {
                    return [
                        "user_full_name" => $recentOrder->user->username . ' ' . $recentOrder->user->last_name,
                        "order_status" => $recentOrder->orderStatus->status,
                        "order_number" => $recentOrder->order_number,
                        "total_amount" => (float)$recentOrder->total_amount
                    ];
                }),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
