<?php

namespace App\Services\Payments;

use Illuminate\Http\Request;
use App\Http\Controllers\PaypalController;

class PayPalService implements PaymentServiceInterface
{
    public function initiate(float $amount, string $description): array
    {
        $paypal = new PaypalController();
        $request = new Request(['amount' => $amount, 'description' => $description]);
        $response = $paypal->createPayment($request);
        return json_decode($response->getContent(), true);
    }

    public function capture(string $orderId): array
    {
        $paypal = new PaypalController();
        $request = new Request(['order_id' => $orderId]);
        $response = $paypal->capturePayment($request);
        return json_decode($response->getContent(), true);
    }
}
