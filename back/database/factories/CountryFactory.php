<?php

namespace Database\Factories;

use App\Models\Country;
use Illuminate\Database\Eloquent\Factories\Factory;
use Webpatser\Countries\Countries;

class CountryFactory extends Factory
{
    protected $model = Country::class;

    public function definition(): array
    {
        // Get all countries
        $countries = Countries::all();

        // Randomly pick a country from the list
        $country = $countries[$this->faker->numberBetween(0, count($countries) - 1)];

        return [
            'name' => $country['name'],
            'code' => $country['iso_alpha2'], // Using the ISO Alpha-2 country code
        ];
    }
}
