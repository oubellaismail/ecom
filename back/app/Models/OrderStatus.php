<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderStatus extends Model
{
    use HasFactory;

    const PENDING = 1;
    const PROCESSING = 2;
    const SHIPPED = 3;
    const DELIVERED = 4;
    const CANCELED = 5;
    const REFUNDED = 6;


    public function orders()
    {
        return $this->hasMany(ShopOrder::class);
    }

    public function statusHistories()
    {
        return $this->hasMany(OrderStatusHistory::class);
    }
}
