<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RegisterTest extends TestCase
{

    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    /** @test */
    public function register_attempt_test(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $this->assertGuest('web');

        $password = 'P455word!';

        $response = $this->postJson('/register', [
            'email' => fake()->email(),
            'password' => $password,
            'password_confirmation' => $password,
            'terms' => true,
            'newsletter' => true,
        ]);

        $response->assertStatus(200)->assertJsonStructure([
            'data' => [
                'user' => [
                    'id',
                    'email',
                    'role'
                ],
            ],
            'message',
        ]);

        $userId = $response->decodeResponseJson()['data']['user']['id'];

        $user = User::find($userId);
        DB::table('tokens')->where('user_id', $user->id)->delete();
        $user->delete();
    }

    /** @test */
    public function register_attempt_with_invalid_password_format_test(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $this->assertGuest('web');

        $password = 'pass';

        $response = $this->postJson('/register', [
            'email' => fake()->email(),
            'password' => $password,
            'password_confirmation' => $password,
            'terms' => true,
            'newsletter' => true,
        ]);

        $response->assertStatus(422)->assertJsonStructure([
            'message',
            'errors',
        ]);
    }

    /** @test */
    public function register_attempt_with_passwords_mismatch_format_test(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $this->assertGuest('web');

        $response = $this->postJson('/register', [
            'email' => fake()->email(),
            'password' => fake()->password(),
            'password_confirmation' => fake()->password(),
            'terms' => true,
            'newsletter' => true,
        ]);

        $response->assertStatus(422)->assertJsonStructure([
            'message',
            'errors',
        ]);
    }

    /** @test */
    public function register_attempt_while_user_already_exists_test(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $this->assertGuest('web');

        $email = fake()->email();
        $emailVerifiedAt = now();
        $password = fake()->password();
        $role = 'user';
        $terms = true;
        $newsletter = true;

        $existingUser = User::create([
            'email' => $email,
            'email_verified_at' => $emailVerifiedAt,
            'password' => $password,
            'role' => $role,
            'newsletter' => $newsletter
        ]);

        $response = $this->postJson('/register', [
            'email' => $email,
            'password' => $password,
            'password_confirmation' => $password,
            'terms' => $terms,
            'newsletter' => $newsletter,
        ]);

        $response->assertStatus(422)->assertJsonStructure([
            'message',
            'errors',
        ]);

        $existingUser->delete();
    }

    /** @test */
    public function check_csrf_protection(): void
    {
        $this->assertGuest('web');

        $password = 'P455word!';

        $response = $this->postJson('/register', [
            'email' => fake()->email(),
            'password' => $password,
            'password_confirmation' => $password,
            'terms' => true,
            'newsletter' => true,
        ]);

        $response->assertStatus(500)->assertJsonStructure([
            'message',
        ]);

    }
}
