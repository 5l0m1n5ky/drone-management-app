<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LogoutTest extends TestCase
{

    use RefreshDatabase; 

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }
    
    /** @test */
    public function logout_successful_attempt_test(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $user = User::factory()->create();

        $response = $this->actingAs($user)->withSession(['banned' => false])->postJson('/api/logout');

        $response->assertStatus(200)->assertJsonStructure([
            'data',
            'message'
        ]);

        $this->assertNull(session()->get($user->id));

        $user->delete();
    }

    /** @test */
    public function logout_unsuccessful_attempt_test(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $this->assertGuest('api');

        $response = $this->postJson('/api/logout');

        $response->assertStatus(401)->assertJsonStructure([
            'message'
        ]);

        $errorMessage = $response->decodeResponseJson()['message'];

        $this->assertTrue($errorMessage === 'Unauthenticated.');
    }

    // /** @test */
    // public function check_csrf_protection(): void
    // {
    //     $this->assertGuest('api');

    //     $response = $this->postJson('/api/logout');

    //     $response->assertStatus(401)->assertJsonStructure([
    //         'message'
    //     ]);
    // }
}
