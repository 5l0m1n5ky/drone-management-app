<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderDetails>
 */
class OrderDetailsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'subservice_id' => 1,
            'amount' => fake()->numberBetween(10),
            'background_music_id' => fake()->numberBetween(1, 7),
            'format' => '16:9',
            'report' => false,
        ];
    }
}
