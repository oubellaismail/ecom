<?php

namespace App\Models;

use App\Models\User;
use App\Models\Country;
use App\Models\ShopOrder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'address_line1',
        'address_line2',
        'city',
        'region',
        'postal_code',
        'country_id',
        'phone_number'
    ];
    
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }
}
