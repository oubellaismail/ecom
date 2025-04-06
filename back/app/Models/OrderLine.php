<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderLine extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['order_id', 'product_item_id', 'qty', 'subtotal'];

    public function order()
    {
        return $this->belongsTo(ShopOrder::class, 'order_id');
    }

    public function productItem()
    {
        return $this->belongsTo(ProductItem::class, 'product_item_id');
    }
}
