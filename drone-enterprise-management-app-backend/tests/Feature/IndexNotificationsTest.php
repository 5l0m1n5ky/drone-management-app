<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Notification;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

class IndexNotificationsTest extends TestCase
{

    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }
    
    /** @test */
    public function index_notifications_by_admin_test(): void
    {

        $user_1 = User::factory()->create(['role' => 'user']);

        $notification_amount_for_user_1 = 5;

        $notifications_for_user_1 = Notification::factory()->count($notification_amount_for_user_1)->create(['user_id' => $user_1->id]);

        $user_2 = User::factory()->create(['role' => 'user']);

        $notification_amount_for_user_2 = 3;

        $notifications_for_user_2 = Notification::factory()->count($notification_amount_for_user_2)->create(['user_id' => $user_2->id]);

        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->withSession(['banned' => false])->getJson('/api/notifications');

        $response->assertStatus(200)->assertJsonStructure([
            '*' => [
                'id',
                'userId',
                'title',
                'content',
                'comment',
                'state',
                'seen',
                'createdAt'
            ]
        ])->assertJsonCount($notification_amount_for_user_1 + $notification_amount_for_user_2);

        foreach ($notifications_for_user_1 as $notification) {
            Notification::find($notification->id)->delete();
        }

        foreach ($notifications_for_user_2 as $notification) {
            Notification::find($notification->id)->delete();
        }

        $user_1->delete();
        $user_2->delete();
        $admin->delete();
    }

    /** @test */
    public function index_notifications_by_user_test(): void
    {

        $user_1 = User::factory()->create(['role' => 'user']);

        $notification_amount_for_user_1 = 5;

        $notifications_for_user_1 = Notification::factory()->count($notification_amount_for_user_1)->create(['user_id' => $user_1->id]);

        $user_2 = User::factory()->create(['role' => 'user']);

        $notification_amount_for_user_2 = 3;

        $notifications_for_user_2 = Notification::factory()->count($notification_amount_for_user_2)->create(['user_id' => $user_2->id]);

        $response = $this->actingAs($user_1)->withSession(['banned' => false])->getJson('/api/notifications');

        $response->assertStatus(200)->assertJsonStructure([
            '*' => [
                'id',
                'userId',
                'title',
                'content',
                'comment',
                'state',
                'seen',
                'createdAt'
            ]
        ]);

        $response->assertJsonCount($notification_amount_for_user_1);

        foreach ($notifications_for_user_1 as $notification) {
            Notification::find($notification->id)->delete();
        }

        foreach ($notifications_for_user_2 as $notification) {
            Notification::find($notification->id)->delete();
        }

        $user_1->delete();

        $user_2->delete();
    }

    /** @test */
    public function index_notifications_attempt_by_unauthenticated(): void
    {
        $this->assertGuest(guard: 'api');

        $response = $this->getJson('/api/notifications');

        $response->assertStatus(status: 401)->assertJsonStructure([
            'message'
        ]);
    }
}
