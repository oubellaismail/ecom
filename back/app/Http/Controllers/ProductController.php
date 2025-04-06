<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductItem;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\Products\StoreProductRequest;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Product::with(['category', 'productItem']);

        // Filter by category name
        if (request()->has('category')) {
            $query->whereHas('category', function ($q) {
                $q->where('name', 'like', '%' . request('category') . '%');
            });
        }

        // Filter by product name or description
        if (request()->has('search')) {
            $query->where(function($q) {
                $q->where('name', 'like', '%' . request('search') . '%')
                  ->orWhere('description', 'like', '%' . request('search') . '%');
            });
        }

        // Filter by price range
        if (request()->has('min_price') || request()->has('max_price')) {
            $query->whereHas('productItem', function ($q) {
                if (request()->has('min_price') && request()->has('max_price')) {
                    $q->whereBetween('price', [request('min_price'), request('max_price')]);
                } elseif (request()->has('min_price')) {
                    $q->where('price', '>=', request('min_price'));
                } elseif (request()->has('max_price')) {
                    $q->where('price', '<=', request('max_price'));
                }
            });
        }

        // $products = $query->get();
        $products = $query->select(['id', 'name', 'slug', 'description', 'category_id'])
        ->with([
            'category:id,name,slug', 
            'productItem:id,product_id,price,qty_in_stock'
        ])
        ->get();

        $transformedProducts = $products->map(function ($product) {
            return [
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'category' => $product->category ? [
                    'name' => $product->category->name,
                    'slug' => $product->category->slug,
                ] : null,
                'product_item' => $product->productItem ? [
                    'price' => $product->productItem->price,
                    'qty_in_stock' => $product->productItem->qty_in_stock,
                ] : null,
            ];
        });


        return response()->json([
            'success' => true,
            'data' => $transformedProducts,
            'message' => 'Products retrieved successfully'
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        // Generate slug for product
        $slug = $request->slug ?? Str::slug($request->name);
        $originalSlug = $slug;
        $count = 1;

        // Ensure the slug is unique
        while (Product::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        // Begin a database transaction to ensure both are created successfully
        DB::beginTransaction();

        try {
            // Step 1: Create the product
            $product = Product::create([
                'name' => $request->name,
                'description' => $request->description,
                'category_id' => $request->category_id,
                'slug' => $slug,
            ]);

            $productItem = ProductItem::create([
                'product_id' => $product->id,  // Associate product item with the created product
                'qty_in_stock' => $request->qty_in_stock,
                'product_image' => $request->product_image, // Nullable if not provided
                'price' => $request->price,
            ]);

            // Commit the transaction if everything is successful
            \DB::commit();

            return response()->json([
                'success' => true,
                'data' => $product->slug,
                'message' => "Product and product item for {$slug} created successfully"
            ], 201);

        } catch (\Exception $e) {
            // Rollback the transaction if there’s an error
            \DB::rollBack();

            // Optionally log the error or return a message
            return response()->json([
                'success' => false,
                'message' => 'Error creating product and product item',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $product = Product::where('slug', $slug)->with(['category', 'productItem'])->first();
        
        if (!$product) {
            return response()->json([
                'success' => false, 
                'message' => 'Product not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => [
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'category' => [
                    'name' => $product->category->name,
                    'slug' => $product->category->slug
                ],
                'product_item' => $product->productItem ? [
                    'qty_in_stock' => $product->productItem->qty_in_stock,
                    'price' => $product->productItem->price
                ] : null
            ],
            'message' => 'Product retrieved successfully'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::find($id);
        
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'sometimes|required|exists:categories,id',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $product->update($request->only([
            'name', 'description', 'category_id', 'is_active'
        ]));
        
        return response()->json([
            'success' => true,
            'data' => $product->loadMissing('category'),
            'message' => 'Product updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $slug)
    {
        $product = Product::where('slug', $slug)->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        // Delete associated product item first
        $product->productItem()->delete();

        // Delete the product itself
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product and its associated product item deleted successfully'
        ]);
    }
}
