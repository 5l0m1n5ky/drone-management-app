<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class indexSubservicesTest extends TestCase
{

    /** @test */
    public function checks_if_json_response_has_required_fields(): void
    {
        $response = $this->get('/subservices');

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
