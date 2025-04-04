<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderStatusHistory extends Model
{
    use HasFactory;

    protected $fillable = ['order_id', 'order_status_id', 'changed_at', 'comment', 'changed_by'];

    public function order()
    {
        return $this->belongsTo(ShopOrder::class, 'order_id');
    }

    public function status()
    {
        return $this->belongsTo(OrderStatus::class, 'order_status_id');
    }

    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
