<?php

namespace App\Services\Payments;

class CODService implements PaymentServiceInterface
{
    public function initiate(float $amount, string $description): array
    {
        // For COD, we just need to return success without actual payment processing
        return [
            'success' => true,
            'order_id' => 'cod-' . uniqid(),
            'approval_url' => null, // No redirect needed for COD
            'message' => 'COD payment method selected'
        ];
    }

    public function capture(string $orderId): array
    {
        // For COD, capture is just a confirmation step
        return [
            'success' => true,
            'transaction_id' => $orderId,
            'details' => ['payment_method' => 'Cash on Delivery'],
            'message' => 'COD payment confirmed'
        ];
    }
}