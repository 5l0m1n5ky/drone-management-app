<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;

class LogoutTest extends TestCase
{
    /** @test */
    public function logout_successful_attempt_test(): void
    {

        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $user = User::factory()->create();

        $response = $this->actingAs($user)->withSession(['banned' => false])->postJson('/logout');

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

        $this->assertGuest('web');

        $response = $this->postJson('/logout');

        $response->assertStatus(401)->assertJsonStructure([
            'message'
        ]);

        $errorMessage = $response->decodeResponseJson()['message'];

        $this->assertTrue($errorMessage === 'Unauthenticated.');
    }

    /** @test */
    public function check_csrf_protection(): void
    {
        $this->assertGuest('web');

        $response = $this->postJson('/logout');

        $response->assertStatus(500)->assertJsonStructure([
            'message'
        ]);
    }
}
