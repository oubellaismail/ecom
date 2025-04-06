<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'code', 'is_active'];

    public function payments()
    {
        return $this->hasMany(Payment::class, 'payment_method_id');
    }
}
