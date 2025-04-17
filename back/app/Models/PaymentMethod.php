<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentMethod extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'code', 'is_active'];

    const PAYPAL = 1;
    const STRIPE = 2;
    const COD = 3;

    public function payments()
    {
        return $this->hasMany(Payment::class, 'payment_method_id');
    }
}
