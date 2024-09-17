<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class indexBgMusicTest extends TestCase
{

    /** @test */
    public function checks_if_json_response_has_required_fields(): void
    {
        $response = $this->get('/background-music');

        $response->assertStatus(200)->assertJsonStructure([
            '*' => [
                'id',
                'type'
            ]
        ]);
    }
}
