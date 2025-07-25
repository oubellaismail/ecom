<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Requests\StoreCategoryRequest;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        $categories = Category::query()->get(['name', 'slug', 'description']);

        return response()->json([
            'success' => true,
            'data' => $categories,
            'message' => 'Categories retrieved successfully',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(StoreCategoryRequest $request)
    {

        // Generate slug if not provided
        $slug = $request->slug ?? Str::slug($request->name);

        // Check if slug already exists, append a number if needed
        $originalSlug = $slug;
        $count = 1;

        while (Category::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        $category = Category::create([
            'name' => $request->name,
            'description' => $request->description,
            'slug' => $slug
        ]);

        return response()->json([
            'success' => true,
            'slug' => $category->slug,
            'message' => 'Category created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */

    public function show(string $slug)
    {

        $category = Category::where('slug', $slug)
            ->with(['products' => function ($query) {
                $query->select('id', 'name', 'category_id'); // Ensure category_id is included
            }])
            ->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $category->only(['name', 'description', 'products']),
            'message' => 'Category retrieved successfully'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, string $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'slug' => 'nullable|string|max:255|unique:categories,slug,' . $id
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Prevent category from becoming its own parent
        if ($request->has('parent_id') && $request->parent_id == $id) {
            return response()->json([
                'success' => false,
                'message' => 'Category cannot be its own parent'
            ], 422);
        }

        // Generate slug if name changed and slug not provided
        if ($request->has('name') && !$request->has('slug') && $request->name != $category->name) {
            $slug = Str::slug($request->name);

            // Check if slug already exists
            $originalSlug = $slug;
            $count = 1;

            while (Category::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = $originalSlug . '-' . $count;
                $count++;
            }

            $request->merge(['slug' => $slug]);
        }

        $category->update($request->only([
            'name',
            'description',
            'parent_id',
            'slug'
        ]));

        return response()->json([
            'success' => true,
            'data' => $category,
            'message' => 'Category updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */

    public function destroy(string $slug)
    {
        $category = Category::where('slug', $slug)->with('products')->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found'
            ], 404);
        }

        // return  response()->json([
        //     'category' => $category
        // ]);

        // Check if category has products
        if ($category->products()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete category with associated products. Please delete or reassign products first.'
            ], 422);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' =>  "Category {$slug} deleted successfully"
        ]);
    }

    /**
     * Display random products from a random category with a limit of 8
     */
    public function showByCategory()
{
    // Get a random category that has products
    $category = Category::whereHas('products')
        ->inRandomOrder()
        ->first();

    if (!$category) {
        return response()->json([
            'success' => false,
            'message' => 'No categories with products found'
        ], 404);
    }

    // Get random products from the category with a limit of 8
    $products = $category->products()
        ->inRandomOrder()
        ->limit(4)
        ->with(['productItem:id,product_id,price,product_image,qty_in_stock'])
        ->get()
        ->map(function ($product) {
            return [
                'id' => $product->id,
                'product_id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => optional($product->productItem)->price,
                'qty_in_stock' => optional($product->productItem)->qty_in_stock,
                'product_image' => $product->productItem && $product->productItem->product_image
                    ? asset('storage/' . $product->productItem->product_image)
                    : null,
            ];
        });

    return response()->json([
        'success' => true,
        'data' => [
            'category' => $category->only(['name', 'slug', 'description']),
            'products' => $products
        ],
        'message' => 'Random products from random category retrieved successfully'
    ]);
}

}
