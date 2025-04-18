<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\ProductItem;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\Products\StoreProductRequest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;


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
            $query->where(function ($q) {
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
                'productItem:id,product_id,price,qty_in_stock,product_image'
            ])
            ->get();

        $transformedProducts = $products->map(function ($product) {
            return [
                'id' => $product->id,
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
                    'product_image' => $product->productItem->product_image
                        ? asset('storage/' . $product->productItem->product_image)
                        : null,
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

            $imagePath = null;
            if ($request->hasFile('product_image') && $request->file('product_image')->isValid()) {
                $image = $request->file('product_image');

                // Generate a unique filename
                $filename = Str::slug(pathinfo($request->name, PATHINFO_FILENAME)) . '-' . uniqid() . '.' . $image->getClientOriginalExtension();

                // Store the image in the 'public/products' directory
                $imagePath = $image->storeAs('products', $filename, 'public');
            }

            $category_id = Category::where('slug', $request->category_slug)->firstOrFail()->id;

            // Step 1: Create the product
            $product = Product::create([
                'name' => $request->name,
                'description' => $request->description,
                // 'category_id' => Category::where('slug', $request->category_slug)->firstOrFail()->id(),
                'category_id' => $category_id,
                'slug' => $slug,
            ]);

            $productItem = ProductItem::create([
                'product_id' => $product->id,  // Associate product item with the created product
                'qty_in_stock' => $request->qty_in_stock,
                'product_image' => $imagePath, // Nullable if not provided
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
            // Rollback the transaction if there's an error
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
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'category' => [
                    'name' => $product->category->name,
                    'slug' => $product->category->slug
                ],
                'product_item' => $product->productItem ? [
                    'qty_in_stock' => $product->productItem->qty_in_stock,
                    'price' => $product->productItem->price,
                    'product_image' => $product->productItem->product_image
                        ? asset('storage/' . $product->productItem->product_image)
                        : null,
                ] : null
            ],
            'message' => 'Product retrieved successfully'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $slug)
{
    $product = Product::where('slug', $slug)->first();

    if (!$product) {
        return response()->json([
            'success' => false,
            'message' => 'Product not found'
        ], 404);
    }

    $validator = Validator::make($request->all(), [
        'name' => 'sometimes|required|string|max:255',
        'description' => 'nullable|string',
        'category_slug' => 'sometimes|required|exists:categories,slug',
        'price' => 'sometimes|required|numeric|min:0',
        'qty_in_stock' => 'sometimes|required|integer|min:0',
        'product_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation error',
            'errors' => $validator->errors()
        ], 422);
    }

    DB::beginTransaction();

    try {
        // Update product fields
        if ($request->filled('name')) {
            Log::info('Checkout data stored in database:', [
                'checkout_id' => $request->name
            ]);
            $product->name = $request->name;
            // Update slug if name changes
            $product->slug = Str::slug($request->name);
        }

        if ($request->filled('description')) {
            $product->description = $request->description;
        }

        if ($request->filled('category_slug')) {
            $category = Category::where('slug', $request->category_slug)->first();
            if ($category) {
                $product->category_id = $category->id;
            }
        }

        // Save product changes
        $product->save();

        // Get existing product item or create a new one
        $productItem = ProductItem::where('product_id', $product->id)->first();
        if (!$productItem) {
            $productItem = new ProductItem();
            $productItem->product_id = $product->id;
        }

        // Update product item fields
        if ($request->filled('price')) {
            $productItem->price = $request->price;
        }

        if ($request->filled('qty_in_stock')) {
            $productItem->qty_in_stock = $request->qty_in_stock;
        }

        // Handle image upload
        if ($request->hasFile('product_image') && $request->file('product_image')->isValid()) {
            // Delete old image if exists
            if ($productItem->product_image) {
                Storage::disk('public')->delete($productItem->product_image);
            }

            $image = $request->file('product_image');
            $filename = Str::slug($product->name) . '-' . uniqid() . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('products', $filename, 'public');
            $productItem->product_image = $imagePath;
        }

        // Save product item changes
        $productItem->save();

        DB::commit();

        // Load the updated relationships
        $product->load(['category', 'productItem']);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'category' => $product->category ? [
                    'name' => $product->category->name,
                    'slug' => $product->category->slug
                ] : null,
                'product_item' => [
                    'qty_in_stock' => $productItem->qty_in_stock,
                    'price' => $productItem->price,
                    'product_image' => $productItem->product_image
                        ? asset('storage/' . $productItem->product_image)
                        : null,
                ]
            ],
            'message' => 'Product updated successfully'
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        \Log::error('Product update error: ' . $e->getMessage());
        \Log::error($e->getTraceAsString());

        return response()->json([
            'success' => false,
            'message' => 'Error updating product',
            'error' => $e->getMessage()
        ], 500);
    }
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
