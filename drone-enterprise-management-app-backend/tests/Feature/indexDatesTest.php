<?php

namespace Tests\Feature;

use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;

class indexDatesTest extends TestCase
{

    /** @test */
    public function checks_if_json_response_has_required_fields(): void
    {

        $user = User::factory()->make(['role' => 'user']);

        $response = $this->actingAs($user)->withSession(['banned' => false])->get('/dates');

        $response->assertStatus(200)->assertJsonStructure([
            '*' => [
                'date'
            ]
        ]);
    }

    /** @test */
    public function checks_response_when_user_unauthenticated(): void
    {
        $this->assertGuest('web');

        $response = $this->get('/dates');

        $response->assertStatus(500)->assertJson([
            'status' => 'Error has occured',
            'message' => 'ACCESS_DENIED',
            'data' => 'You have no previleges to make this request',
        ]);
    }
}
