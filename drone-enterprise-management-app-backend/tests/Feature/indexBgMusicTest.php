<?php

namespace Tests\Feature;

use Tests\TestCase;

class IndexBgMusicTest extends TestCase
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
