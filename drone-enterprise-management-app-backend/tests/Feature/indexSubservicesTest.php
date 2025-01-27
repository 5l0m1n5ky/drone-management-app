<?php

namespace Tests\Feature;

use Tests\TestCase;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

class IndexSubservicesTest extends TestCase
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
        $response = $this->get('/api/subservices');

        $response->assertStatus(200)->assertJsonStructure([
            '*' => [
                'id',
                'service_id',
                'subservice',
                'unit_amount_min',
                'unit_amount_max',
                'unit_price',
                'created_at',
                'updated_at'
            ]
        ]);
    }
}
