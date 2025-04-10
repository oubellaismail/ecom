<?php

namespace App\Services\Payments;

interface PaymentServiceInterface
{
    public function initiate(float $amount, string $description): array;
    public function capture(string $orderId): array;
}
