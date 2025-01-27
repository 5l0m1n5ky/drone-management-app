<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Token;
use Illuminate\Support\Facades\DB;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RegenerateTokenTest extends TestCase
{

    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    /** @test */
    public function regenerate_token_when_existing_user_with_unverified_email(): void
    {

        // config(['mail.mailer' => 'null']);

        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $this->assertGuest('api');

        $user = User::factory()->create(['role' => 'user', 'email_verified_at' => null]);
        Token::factory()->create(['user_id' => $user->id]);

        $response = $this->postJson('/api/regenerate-token', ['user_id' => $user->id]);

        $response->assertStatus(200)->assertJsonStructure([
            'data',
            'message'
        ]);

        DB::table('tokens')->where('user_id', $user->id)->delete();
        $user->delete();
    }

    /** @test */
    public function regenerate_token_when_existing_user_with_verified_email(): void
    {

        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $this->assertGuest('api');

        $user = User::factory()->create(['role' => 'user', 'email_verified_at' => now()]);
        Token::factory()->create(['user_id' => $user->id]);

        $response = $this->postJson('/api/regenerate-token', ['user_id' => $user->id]);

        $response->assertStatus(401)->assertJsonStructure([
            'data',
            'message'
        ]);

        DB::table('tokens')->where('user_id', $user->id)->delete();
        $user->delete();
    }

    /** @test */
    public function regenerate_token_when_nonexisting_user(): void
    {

        // config(['mail.mailer' => 'null']);

        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $this->assertGuest('api');

        $unexistingUserId = DB::table('users')->max('id') + 1;

        $response = $this->postJson('/api/regenerate-token', ['user_id' => $unexistingUserId]);

        $response->assertStatus(401)->assertJsonStructure([
            'data',
            'message'
        ]);
    }

    // /** @test */
    // public function check_csrf_protection(): void
    // {
    //     $this->assertGuest('api');

    //     $unexistingUserId = DB::table('users')->max('id') + 1;

    //     $response = $this->postJson('/api/regenerate-token', ['user_id' => $unexistingUserId]);

    //     $response->assertStatus(401)->assertJsonStructure([
    //         'message'
    //     ]);
    // }
}
