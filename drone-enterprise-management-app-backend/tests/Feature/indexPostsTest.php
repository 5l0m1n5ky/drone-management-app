<?php

namespace Tests\Feature;

use Tests\TestCase;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

class IndexPostsTest extends TestCase
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
        $response = $this->get('/api/posts');

        $response->assertStatus(200)->assertJsonStructure([
            '*' => [
                'id',
                'visibility',
                'location',
                'path',
                'cover',
                'description',
                'created_at',
                'updated_at'
            ]
        ]);
    }
}
