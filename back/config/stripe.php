<?php

return [
    'pk_key' => env('STRIPE_KEY', ''),
    'sk_key' => env('STRIPE_SECRET', ''),
    'currency' => env('STRIPE_CURRENCY', 'usd'),
];