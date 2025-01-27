<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

class IndexDatesTest extends TestCase
{

    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    /** @test */
    public function checks_if_json_response_has_required_fields(): void
    {

        $user = User::factory()->make(['role' => 'user']);

        $response = $this->actingAs($user)->withSession(['banned' => false])->get('/api/dates');

        $response->assertStatus(200)->assertJsonStructure([
            '*' => [
                'date'
            ]
        ]);
    }
}
