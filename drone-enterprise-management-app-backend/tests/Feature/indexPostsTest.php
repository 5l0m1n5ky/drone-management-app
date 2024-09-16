<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class indexPostsTest extends TestCase
{
    /** @test */
    public function checks_if_json_response_has_required_fields(): void
    {
        $response = $this->get('/posts');

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
