<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LoginTest extends TestCase
{

    use RefreshDatabase; 

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }
    
    /** @test */
    public function succesful_login_attempt_test(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $this->assertGuest('web');

        $email = fake()->email();
        $password = fake()->password();

        $user = User::factory()->create([
            'email' => $email,
            'password' => bcrypt($password),
        ]);

        $response = $this->postJson('/login', [
            'email' => $email,
            'password' => $password,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'user' => [
                        'id',
                        'email',
                        'privileges'
                    ]
                ],
                'message',
            ]);

        $this->assertAuthenticatedAs($user);

        $user->delete();
    }

    /** @test */
    public function login_attempt_credentials_mismatch_test(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $this->assertGuest('web');

        $email = fake()->email();

        $user = User::factory()->create([
            'email' => $email,
            'password' => bcrypt(fake()->password()),
        ]);

        $response = $this->postJson('/login', [
            'email' => $email,
            'password' => fake()->password(),
        ]);

        $response->assertStatus(401)
            ->assertJsonStructure([
                'data' => [
                    'user' => [
                        'email',
                        'password'
                    ]
                ],
                'message'
            ]);

        $user->delete();
    }

    /** @test */
    public function request_validity_test(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $this->assertGuest('web');

        $response = $this->postJson('/login', [
            'email' => 'email.com',
            'password' => 'pass',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'errors'
            ]);
    }

    /** @test */
    public function check_csrf_protection(): void
    {

        $this->assertGuest('web');

        $response = $this->postJson('/login', [
            'email' => fake()->email(),
            'password' => fake()->password(),
        ]);

        $response->assertStatus(500)->assertJsonStructure([
            'message',
        ]);

    }



}
