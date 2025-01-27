<?php

namespace Tests\Feature;

use Tests\TestCase;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

class IndexServicesTest extends TestCase
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
        $response = $this->get('/api/services');

        $response->assertStatus(200)->assertJsonStructure([
            '*' => [
                'id',
                'service_type'
            ]
        ]);
    }
}
