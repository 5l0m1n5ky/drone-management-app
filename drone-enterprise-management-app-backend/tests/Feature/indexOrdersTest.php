<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderDetails;
use Illuminate\Support\Facades\DB;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

class IndexOrdersTest extends TestCase
{

    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    /** @test */
    public function checks_response_when_authenticated(): void
    {

        $user = User::factory()->make(['role' => 'user']);

        $response = $this->actingAs($user)->withSession(['banned' => false])->get('/orders');

        $response->assertStatus(200)->assertJsonStructure([
            '*' => [
                'id',
                'service',
                'subservice',
                'amount',
                'bgMusic',
                'format',
                'report',
                'latitude',
                'longitude',
                'date',
                'alias',
                'description',
                'price',
                'state',
                'stateColor',
                'customerName',
                'customerSurname',
                'nip',
                'streetName',
                'streetNumber',
                'apartmentNumber',
                'zip',
                'city',
                'customerComment',
                'email',
                'tel',
            ]
        ]);
    }

    /** @test */
    public function checks_response_when_unauthenticated(): void
    {
        $response = $this->get('/orders');

        $response->assertStatus(500)->assertJsonStructure([
            'data',
            'message'
        ]);
    }

    /** @test */
    public function checks_user_response_content(): void
    {
        /*
            Test checks if endpoint returns only orders that belongs to specified user
        */

        $user = User::factory()->create(['role' => 'user']);

        $ordersAmountToCreate = 5;

        $orderDetailsArray = OrderDetails::factory()->count($ordersAmountToCreate)->create([
            'subservice_id' => 1,
            'amount' => 15,
            'background_music_id' => 1,
        ]);

        foreach ($orderDetailsArray as $orderDetails) {
            Order::factory()->create(['user_id' => $user->id, 'order_details_id' => $orderDetails->id]);
        }

        $anotherUser = User::factory()->create(['role' => 'user']);

        $anotherUserOrdersToCreate = 3;

        $anotherUserOrderDetailsArray = OrderDetails::factory()->count($anotherUserOrdersToCreate)->create([
            'subservice_id' => 1,
            'amount' => 15,
            'background_music_id' => 1,
        ]);

        foreach ($anotherUserOrderDetailsArray as $orderDetails) {
            Order::factory()->create(['user_id' => $anotherUser->id, 'order_details_id' => $orderDetails->id]);
        }

        $response = $this->actingAs($user)->withSession(['banned' => false])->getJson('/orders');

        $response->assertStatus(200);

        $response->assertJsonCount($ordersAmountToCreate);

        DB::table('orders')->where('user_id', $user->id)->orWhere('user_id', $anotherUser->id)->delete();

        $user->delete();
        $anotherUser->delete();
    }

    /** @test */
    public function checks_admin_response_content(): void
    {
        /*
            Test checks if endpoint returns all orders which is related to admin request
        */

        $admin = User::factory()->create(['role' => 'admin']);

        $user = User::factory()->create(['role' => 'user']);

        $existingOrdersCount = count(DB::table('orders')->get());

        $ordersAmountToCreate = 5;

        $orderDetailsArray = OrderDetails::factory()->count($ordersAmountToCreate)->create([
            'subservice_id' => 1,
            'amount' => 15,
            'background_music_id' => 1,
        ]);

        foreach ($orderDetailsArray as $orderDetails) {
            Order::factory()->create(['user_id' => $user->id, 'order_details_id' => $orderDetails->id]);
        }

        $anotherUser = User::factory()->create(['role' => 'user']);

        $anotherUserOrdersToCreate = 3;

        $anotherUserOrderDetailsArray = OrderDetails::factory()->count($anotherUserOrdersToCreate)->create([
            'subservice_id' => 1,
            'amount' => 15,
            'background_music_id' => 1,
        ]);

        foreach ($anotherUserOrderDetailsArray as $orderDetails) {
            Order::factory()->create(['user_id' => $anotherUser->id, 'order_details_id' => $orderDetails->id]);
        }

        $response = $this->actingAs($admin)->withSession(['banned' => false])->getJson('/orders');

        $response->assertStatus(200);

        $response->assertJsonCount($ordersAmountToCreate + $anotherUserOrdersToCreate + $existingOrdersCount);

        DB::table('orders')->where('user_id', $user->id)->orWhere('user_id', $anotherUser->id)->delete();

        $admin->delete();
        $user->delete();
        $anotherUser->delete();
    }

    /** @test */
    public function check_csrf_protection(): void
    {

        $this->assertGuest('web');

        $response = $this->get('/orders');

        $response->assertStatus(500)->assertJsonStructure([
            'message'
        ]);
    }
}
