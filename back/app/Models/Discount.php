<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Discount extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'discount_percentage',
        'usage_limit',
        'actual_usage',
        'is_active',
    ];

    // The table associated with the model
    protected $table = 'discounts';

    // Define if the discount is still valid based on the usage limit
    public function isValid()
    {
        return $this->is_active && $this->actual_usage < $this->usage_limit;
    }


    public function users()
    {
        return $this->belongsToMany(User::class)
                    ->withTimestamps();
    }

    public function hasUsedDiscount($discountId)
    {
        return $this->discounts()->where('discount_id', $discountId)->exists();
    }
}
