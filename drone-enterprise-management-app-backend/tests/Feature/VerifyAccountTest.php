<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Token;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

class VerifyAccountTest extends TestCase
{

    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    /** @test */
    public function verify_account_attempt_by_unverified_user(): void
    {
        $user = User::factory()->create(['email_verified_at' => null]);
        $token = Token::factory()->create(['user_id' => $user->id]);

        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $this->assertGuest(guard: 'web');

        $response = $this->actingAs($user)
            ->postJson('/verify-account?token=' . $token->token_value . '&user_id=' . $user->id);

        $response->assertStatus(200)->assertJsonStructure([
            'data' => [
                'request' => [
                    'id',
                    'token'
                ]
            ],
            'message'
        ]);

        $token->delete();
        $user->delete();
    }

    /** @test */
    public function verify_account_attempt_by_verified_user(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $token = Token::factory()->create(['user_id' => $user->id]);

        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $this->assertGuest('web');

        $response = $this->actingAs($user)
            ->postJson('/verify-account?token=' . $token->token_value . '&user_id=' . $user->id);

        $response->assertStatus(401)->assertJsonStructure([
            'data' => [
                'request' => [
                    'id',
                    'token'
                ]
            ],
            'message'
        ]);

        $token->delete();
        $user->delete();
    }

    /** @test */
    public function verify_account_attempt_by_nonexisting_user(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $this->assertGuest('web');

        $response = $this->postJson('/verify-account?token=' . random_int(000000, 999999) . '&user_id=999');

        $response->assertStatus(401)->assertJsonStructure([
            'data' => [
                'request' => [
                    'id',
                    'token'
                ]
            ],
            'message'
        ]);
    }

    /** @test */
    public function check_csrf_protection(): void
    {
        $this->assertGuest('web');

        $response = $this->postJson('/verify-account?token=' . random_int(000000, 999999) . '&user_id=999');

        $response->assertStatus(500)->assertJsonStructure([
            'message'
        ]);

    }
}
