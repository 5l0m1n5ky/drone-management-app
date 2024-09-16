<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'service_id' => 1,
            'user_id' => 1,
            'state_id' => fake()->numberBetween(1, 5),
            'order_details_id' => 1,
            'price_brutto' => fake()->randomFloat(2, 500, 2500),
            'date' => fake()->date(),
            'order_latitude' => fake()->latitude(53.1, 53.2),
            'order_longitude' => fake()->latitude(18.2, 18.3),
            'customer_name' => fake()->company(),
            'nip' => fake()->numberBetween(1111111111, 9999999999),
            'street_name' => fake()->streetName(),
            'street_number' => fake()->numberBetween(0, 99),
            'apartment_number' => fake()->optional()->numberBetween(0, 99),
            'zip' => fake()->numberBetween(11111, 99999),
            'city' => fake()->city(),
            'customer_comment' => fake()->optional()->text(),
            'email' => fake()->email(),
            'tel' => fake()->numberBetween(111111111, 99999999),
            'order_alias' => fake()->text(14),
        ];
    }
}
