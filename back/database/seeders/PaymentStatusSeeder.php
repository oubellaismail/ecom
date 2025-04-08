<?php

namespace Database\Seeders;

use App\Models\PaymentStatus; // Import the PaymentStatus model
use Illuminate\Database\Seeder;

class PaymentStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['id' => 1, 'status' => 'Not Paid', 'description' => 'Order has not been paid'],
            ['id' => 2, 'status' => 'Paid', 'description' => 'Order has been paid'],
        ];

        foreach ($statuses as $status) {
            PaymentStatus::updateOrCreate(
                ['id' => $status['id']],  // Lookup by ID to update existing records
                $status  // Data to be inserted/updated
            );
        }

        $this->command->info('Payment statuses seeded successfully!');
    }
}
