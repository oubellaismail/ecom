<?php

namespace App\Http\Requests\Orders;

use Illuminate\Foundation\Http\FormRequest;

class PlaceOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'order_lines' => 'required|array',
            'order_lines.*.product_item_id' => 'required|exists:product_items,id',
            'order_lines.*.qty' => 'required|integer|min:1',
            'discount_code' => 'nullable|string|exists:discounts,code',
            'total_amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string'
        ];
    }
}
