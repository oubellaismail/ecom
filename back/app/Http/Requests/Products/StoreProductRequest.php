<?php

namespace App\Http\Requests\Products;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()?->role_id === User::ROLE_ADMIN;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_slug' => 'required|exists:categories,slug',
            'qty_in_stock' => 'required|integer|min:0',  // Ensuring qty_in_stock is a non-negative integer
            'product_image' => 'nullable|string',  // Allow null or a string value for image
            'price' => 'required|numeric|min:0',  // Ensuring price is a numeric value and not negative
            'product_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }
    
}
