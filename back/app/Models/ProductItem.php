<?php

namespace App\Models;

use App\Models\Product;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'qty_in_stock',
        'product_image',
        'price',
        'product_id',
    ];

    public function product(){
        return $this->belongsTo(Product::class);
    }
}
