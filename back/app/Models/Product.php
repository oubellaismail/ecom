<?php

namespace App\Models;

use App\Models\Category;
use App\Models\ProductItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'slug',
        'category_id',
    ];

    public function category() {
        return $this->belongsTo( Category::class);
    }

    /**
    * Get the product items for the product.
    */

    public function productItem()
    {
        return $this->hasOne(ProductItem::class); // ← returns a Collection
    }

    protected static function booted()
    {
        static::deleting(function ($product) {
            $product->productItem()->delete();
        });
    }

}
