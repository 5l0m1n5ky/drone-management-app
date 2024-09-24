<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => random_int(1, 999),
            'title' => 'Powiadomienie z systemu SlominSky',
            'content' => fake()->text(100),
            'comment' => fake()->text(50),
            'state_id' => random_int(1, 5),
            'seen' => false,
        ];
    }
}
