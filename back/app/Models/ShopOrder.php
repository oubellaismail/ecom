<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ShopOrder extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'order_status_id',
        'order_number', 'tax_amount', 'discount_amount',
        'total_amount', 'notes', 'ordered_at', 'amount_before_discount'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function status()
    {
        return $this->belongsTo(OrderStatus::class, 'order_status_id');
    }

    public function statusHistories()
    {
        return $this->hasMany(OrderStatusHistory::class, 'order_id');
    }

    public function orderLines()
    {
        return $this->hasMany(OrderLine::class, 'order_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'order_id');
    }

    public function orderStatus(){
        return $this->belongsTo(orderStatus::class);
    }
}
