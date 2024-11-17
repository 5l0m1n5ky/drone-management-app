<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;


class ChecklistTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    /** @test */
    public function succesful_checklist_types_index(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $admin = User::factory()->make(['role' => 'admin']);

        $response = $this->actingAs($admin)->withSession(data: ['banned' => false])->get('orders/checklist/1');

        $response->assertStatus(200)->assertJsonStructure([
            '*' => [
                "checklist_id",
                "checked",
                "type"
            ]
        ]);
    }

    /** @test */
    public function unsuccesful_checklist_types_index_bad_order_id(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $admin = User::factory()->make(['role' => 'admin']);

        $response = $this->actingAs($admin)->withSession(['banned' => false])->get('orders/checklist/3');

        $response->assertStatus(status: 200)->assertJsonCount(0);
    }

    /** @test */
    public function unsuccesful_checklist_types_index_by_user(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $user = User::factory()->make(['role' => 'user']);

        $response = $this->actingAs($user)->withSession(['banned' => false])->get('orders/checklist/1');

        $response->assertStatus(status: 401)->assertJsonStructure(
            [
                'data',
                'message'
            ]
        );
    }

    /** @test */
    public function succesful_checklist_update(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $admin = User::factory()->make(['role' => 'admin']);

        $response = $this->actingAs($admin)->withSession(['banned' => false])->put('orders/checklist/1', [
            "1" => true,
            "2" => false,
            "3" => false,
            "4" => false,
            "5" => false,
            "6" => false,
            "7" => false,

        ]);

        $response->assertStatus(200)->assertJsonStructure([
            'data',
            'message'
        ]);
    }

    /** @test */
    public function unsuccesful_checklist_update(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $admin = User::factory()->make(['role' => 'admin']);

        $response = $this->actingAs($admin)->withSession(['banned' => false])->put('orders/checklist/3', [
            "1" => true,
            "2" => false,
            "3" => false,
            "4" => false,
            "5" => false,
            "6" => false,
            "7" => false,

        ]);

        $response->assertStatus(500)->assertJsonStructure([
            'data',
            'message'
        ]);
    }

    /** @test */
    public function checklist_update_attempt_by_user(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $user = User::factory()->make(['role' => 'user']);

        $response = $this->actingAs($user)->withSession(['banned' => false])->put('orders/checklist/2', [
            "1" => true,
            "2" => false,
            "3" => false,
            "4" => false,
            "5" => false,
            "6" => false,
            "7" => false,

        ]);

        $response->assertStatus(401)->assertJsonStructure([
            'data',
            'message'
        ]);
    }
}
