<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $methods = [
            [
                'name' => 'PayPal',
                'code' => 'paypal',
                'is_active' => true,
            ],
            [
                'name' => 'Stripe',
                'code' => 'stripe',
                'is_active' => true,
            ],
            [
                'name' => 'Cash on Delivery',
                'code' => 'cod',
                'is_active' => true,
            ]
        ];

        foreach ($methods as $method) {
            PaymentMethod::updateOrCreate(
                ['code' => $method['code']],
                $method
            );
        }
    }
}
