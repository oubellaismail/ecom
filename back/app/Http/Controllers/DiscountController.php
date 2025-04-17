<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\Discounts\StoreDiscountRequest;

class DiscountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $discounts = Discount::all();
        return response()->json([
            'success' => true,
            'data' => $discounts,
            'message' => 'Discounts retrieved successfully'
        ]);
    }

    public function show($code)
    {
        // Fetch discount record by code
        $discount = Discount::where('code', $code)->first();

        // Check if discount exists and is valid
        if (!$discount || !$discount->isValid()) {
            return response()->json([
                'success' => false,
                'message' => "Discount not found or invalid"
            ], 404);
        }

        // Get authenticated user
        $user = auth()->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => "Please log in to use this discount"
            ], 401);
        }

        // Check if user has already used this discount
        if ($user->hasUsedDiscount($discount->id)) {
            return response()->json([
                'success' => false,
                'message' => 'You have already used this discount.'
            ], 400);
        }

        // Return discount data
        return response()->json([
            'success' => true,
            'data' => $discount->only(['code', 'discount_percentage']),
            'message' => "Discount retrieved successfully"
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDiscountRequest $request)
    {
        $code = strtoupper(Str::random(8)); // Generates 8 random characters

        // Create the discount
        $discount = Discount::create([
            'code' => $code,
            'discount_percentage' => $request['discount_percentage'],
            'usage_limit' => $request['usage_limit'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $discount->code,
            'message' => 'Discounts created successfully',
        ]);
    }
}
