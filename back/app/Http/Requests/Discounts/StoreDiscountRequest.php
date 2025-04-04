<?php

namespace App\Http\Requests\Discounts;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class StoreDiscountRequest extends FormRequest
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
            'discount_percentage' => 'required|numeric|gt:0|max:100',
            'usage_limit' => 'required|integer|min:1',
        ];
    }
}
