<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentStatus extends Model
{

    use HasFactory;

    const NOT_PAID = 1;
    const PAID = 2;

    protected $fillable = ['status', 'description'];

    public function payments()
    {
        return $this->hasMany(Payment::class, 'payment_method_id');
    }
}
