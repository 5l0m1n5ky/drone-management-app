<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CheckAuthTest extends TestCase
{

    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    /** @test */
    public function successful_check_if_user_is_still_authenticated(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $user = User::factory()->create();

        $response = $this->actingAs($user)->withSession(['banned' => false])->get('/api/user/check');

        $response->assertStatus(200)->assertJsonStructure([
            'data',
            'message'
        ]);

        $user->delete();
    }

    /** @test */
    public function unsuccessful_check_if_user_is_still_authenticated(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $this->assertGuest('api');

        $response = $this->getJson('/api/user/check');

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

    //     $response = $this->getJson('/api/user/check');

    //     $response->assertStatus(401)->assertJsonStructure([
    //         'message'
    //     ]);
    // }
}
