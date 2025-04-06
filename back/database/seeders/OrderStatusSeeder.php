<?php

namespace Database\Seeders;

use App\Models\OrderStatus;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class OrderStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $statuses = [
            ['id' => 1, 'status' => 'Pending', 'description' => 'Order has been placed but not processed yet.'],
            ['id' => 2, 'status' => 'Processing', 'description' => 'Order is being prepared.'],
            ['id' => 3, 'status' => 'Shipped', 'description' => 'Order has been shipped to the customer.'],
            ['id' => 4, 'status' => 'Delivered', 'description' => 'Order has been delivered to the customer.'],
            ['id' => 5, 'status' => 'Canceled', 'description' => 'Order has been canceled.'],
            ['id' => 6, 'status' => 'Refunded', 'description' => 'Order has been refunded.'],
        ];

        foreach ($statuses as $status) {
            OrderStatus::updateOrCreate(['id' => $status['id']], $status);
        }

        $this->command->info('Order statuses seeded successfully!');
    }
}
