<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Order;
use App\Models\State;
use App\Models\OrderDetails;
use Illuminate\Support\Facades\DB;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderStateUpdateTest extends TestCase
{

    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }
    
    /** @test */
    public function successful_order_state_update_test(): void
    {

        $user = User::factory()->create(['role' => 'user']);

        $admin = User::factory()->create(['role' => 'admin']);

        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $orderDetails = OrderDetails::factory()->create([
            'subservice_id' => 1,
            'amount' => 15,
            'background_music_id' => 1,
        ]);

        $order = Order::factory()->create(['user_id' => $user->id, 'order_details_id' => $orderDetails->id]);

        $newState = State::find(2);

        $response = $this->actingAs($admin)->withSession(['banned' => false])->post('/orders/state-update', [
            'orderId' => $order->id,
            'stateId' => $newState->id,
        ]);

        $responseDataContent = 'Zaktualizowano status zlecenia';
        $responseMessageContent = 'STATE_UPDATED';

        $response->assertStatus(200)->assertJsonStructure([
            'data',
            'message'
        ])->assertJsonFragment(
                [
                    'data' => $responseDataContent,
                    'message' => $responseMessageContent
                ]
            );

        DB::table('notifications')->where(['user_id' => $user->id])->delete();
        $order->delete();
        $user->delete();
        $admin->delete();

    }

    /** @test */
    public function form_request_test(): void
    {

        $user = User::factory()->create(['role' => 'user']);

        $admin = User::factory()->create(['role' => 'admin']);

        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $orderDetails = OrderDetails::factory()->create([
            'subservice_id' => 1,
            'amount' => 15,
            'background_music_id' => 1,
        ]);

        $order = Order::factory()->create(['user_id' => $user->id, 'order_details_id' => $orderDetails->id]);

        $this->expectException(\Illuminate\Validation\ValidationException::class);

        $response = $this->actingAs($admin)->withSession(['banned' => false])->post('/orders/state-update', [
            'orderId' => null,
            'stateId' => null,
        ]);

        $response->assertStatus(302)->assertJsonStructure([
            'message',
            'errors' => [
                'orderId',
                'stateId',
            ],
        ])->assertJsonFragment([
                    'orderId' => ['The orderId field must not be greater than 10000 kilobytes.'],
                    'stateId' => ['The stateId field must not be greater than 10000 kilobytes.']
                ]);

        DB::table('notifications')->where(['user_id' => $user->id])->delete();
        $order->delete();
        $user->delete();
        $admin->delete();

    }

    /** @test */
    public function order_state_update_attempt_by_user(): void
    {

        $user = User::factory()->create(['role' => 'user']);

        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        $orderDetails = OrderDetails::factory()->create([
            'subservice_id' => 1,
            'amount' => 15,
            'background_music_id' => 1,
        ]);

        $order = Order::factory()->create(['user_id' => $user->id, 'order_details_id' => $orderDetails->id]);

        $newState = State::find(2);

        $response = $this->actingAs($user)->withSession(['banned' => false])->post('/orders/state-update', [
            'orderId' => $order->id,
            'stateId' => $newState->id,
        ]);

        $response->assertStatus(401)->assertJsonStructure(
            [
                'message',
            ]
        )->assertJsonFragment(
                [
                    'data' => 'You have no privileges to call that endpoint',
                    'message' => 'UNAUTHORIZED',
                    'status' => 'Error has occured'
                ]
            );

        DB::table('notifications')->where(['user_id' => $user->id])->delete();
        $order->delete();
        $user->delete();
    }

    /** @test */
    public function check_csrf_protection(): void
    {

        $this->assertGuest('web');

        $user = User::factory()->create(['role' => 'user']);

        $orderDetails = OrderDetails::factory()->create([
            'subservice_id' => 1,
            'amount' => 15,
            'background_music_id' => 1,
        ]);

        $order = Order::factory()->create(['user_id' => $user->id, 'order_details_id' => $orderDetails->id]);

        $newState = State::find(2);

        $response = $this->post('/orders/state-update', [
            'orderId' => $order->id,
            'stateId' => $newState->id,
        ]);

        $response->assertStatus(status: 500)->assertJsonStructure(
            [
                'message',
            ]
        )->assertJsonFragment(
                [
                    'message' => 'CSRF_TOKEN_MISMATCH',
                ]
            );

        DB::table('notifications')->where(['user_id' => $user->id])->delete();
        $order->delete();
        $user->delete();
    }
}
