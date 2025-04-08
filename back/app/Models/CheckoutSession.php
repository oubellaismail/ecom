<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CheckoutSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'checkout_id',
        'data',
        'expires_at'
    ];

    protected $casts = [
        'expires_at' => 'datetime'
    ];
}