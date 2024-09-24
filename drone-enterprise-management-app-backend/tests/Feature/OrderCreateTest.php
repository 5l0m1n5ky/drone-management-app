<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderCreateTest extends TestCase
{

    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }
    
    /** @test */
    public function successful_create_order_test(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $response = $this->actingAs($user)->withSession(['banned' => false])->post('/orders/create', [
            'service_id' => 1,
            'subservice_id' => 1,
            'amount' => 10,
            'bgMusicId' => 1,
            'format' => '16:9',
            'report' => null,
            'latitude' => fake()->latitude(53.1, 53.2),
            'longitude' => fake()->latitude(18.2, 18.3),
            'date' => fake()->date(),
            'name' => fake()->firstName(),
            'surname' => fake()->lastName(),
            'nip' => fake()->numberBetween(1111111111, 9999999999),
            'streetName' => fake()->streetName(),
            'streetNumber' => fake()->numberBetween(0, 99),
            'apartmentNumber' => fake()->numberBetween(0, 99),
            'city' => fake()->city(),
            'zip' => fake()->numberBetween(11111, 99999),
            'tel' => fake()->numberBetween(111111111, 99999999),
            'email' => fake()->email(),
            'alias' => fake()->text(15),
            'description' => fake()->text(50),
            'price' => fake()->randomFloat(2, 500, 2500),
        ]);

        $response->assertStatus(200)->assertJsonStructure([
            'data',
            'message'
        ]);

        DB::table('orders')->where(['user_id' => $user->id])->delete();

    }

    /** @test */
    public function unsuccessful_create_order_test(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $this->expectException(\Illuminate\Validation\ValidationException::class);

        $response = $this->actingAs($user)->withSession(['banned' => false])->post('/orders/create', [
            'service_id' => null,
            'subservice_id' => null,
            'amount' => null,
            'bgMusicId' => 1,
            'format' => '16:9',
            'report' => null,
            'latitude' => null,
            'longitude' => null,
            'date' => null,
            'name' => null,
            'surname' => fake()->lastName(),
            'nip' => fake()->numberBetween(1111111111, 9999999999),
            'streetName' => null,
            'streetNumber' => null,
            'apartmentNumber' => fake()->numberBetween(0, 99),
            'city' => null,
            'zip' => null,
            'tel' => null,
            'email' => null,
            'alias' => null,
            'description' => fake()->text(50),
            'price' => null,
        ]);

        $response->assertStatus(302)->assertJsonStructure(
            [
                'message',
                'errors' => [
                    'service_id',
                    'subservice_id',
                    'amount',
                    'latitude',
                    'longitude',
                    'date',
                    'name',
                    'street_name',
                    'street_number',
                    'city',
                    'zip',
                    'tel',
                    'email',
                    'alias',
                    'price',
                ],
            ]
        )->assertJsonFragment(
                [
                    'service_id' => ['The service id field is required.'],
                    'subservice_id' => ['The subservice id field is required.'],
                    'amount' => ['The amount field is required.'],
                    'latitude' => ['The latitude field is required.'],
                    'longitude' => ['The longitude field is required.'],
                    'date' => ['The date field is required.'],
                    'name' => ['The name field is required.'],
                    'street_name' => ['The street name field is required.'],
                    'street_number' => ['The street number field is required.'],
                    'city' => ['The city field is required.'],
                    'zip' => ['The zip field is required.'],
                    'tel' => ['The tel field is required.'],
                    'email' => ['The email field is required.'],
                    'alias' => ['The alias field is required.'],
                    'price' => ['The price field is required.'],
                ]
            );
    }

    /** @test */
    public function check_csrf_protection(): void
    {
        $this->assertGuest('web');

        $response = $this->post('/orders/create', [
            'service_id' => 1,
            'subservice_id' => 1,
            'amount' => 10,
            'bgMusicId' => 1,
            'format' => '16:9',
            'report' => null,
            'latitude' => fake()->latitude(53.1, 53.2),
            'longitude' => fake()->latitude(18.2, 18.3),
            'date' => fake()->date(),
            'name' => fake()->firstName(),
            'surname' => fake()->lastName(),
            'nip' => fake()->numberBetween(1111111111, 9999999999),
            'streetName' => fake()->streetName(),
            'streetNumber' => fake()->numberBetween(0, 99),
            'apartmentNumber' => fake()->numberBetween(0, 99),
            'city' => fake()->city(),
            'zip' => fake()->numberBetween(11111, 99999),
            'tel' => fake()->numberBetween(111111111, 99999999),
            'email' => fake()->email(),
            'alias' => fake()->text(15),
            'description' => fake()->text(50),
            'price' => fake()->randomFloat(2, 500, 2500),
        ]);

        $response->assertStatus(500)->assertJsonStructure([
            'message'
        ]);

        $messageContent = $response->decodeResponseJson()['message'];

        $this->assertTrue(condition: $messageContent === 'CSRF_TOKEN_MISMATCH');
    }
}
