<?php

namespace App\Services\Payments;

use InvalidArgumentException;

class PaymentServiceResolver
{
    public function resolve(string $method): PaymentServiceInterface
    {
        return match ($method) {
            'paypal' => new PayPalService(),
            'stripe' => new StripeService(),
            'cod' => new CODService(),
            default => throw new InvalidArgumentException("Unsupported payment method: $method"),
        };
    }
}
